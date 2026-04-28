CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    admin BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS genres (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    number BIGINT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    description TEXT,
    price FLOAT(12, 2) NOT NULL,
    cover VARCHAR(255),
    status BOOLEAN DEFAULT FALSE,
    id_genre BIGINT,
    FOREIGN KEY (id_genre) REFERENCES genres(id)
);

CREATE TABLE IF NOT EXISTS sold (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_users BIGINT,
    id_books INT,
    date DATE,
    FOREIGN KEY (id_users) REFERENCES users(id),
    FOREIGN KEY (id_books) REFERENCES books(id)
);

DELIMITER $$
-- 1. Procedure: Barcha janrlarni yangilash
CREATE PROCEDURE sp_UpdateAllGenreCounts()
BEGIN
    UPDATE genres g
    LEFT JOIN (
        SELECT id_genre, COUNT(*) AS book_count
        FROM books
        GROUP BY id_genre
    ) b ON g.id = b.id_genre
    SET g.number = COALESCE(b.book_count, 0);

    SELECT 'All genre counts updated successfully' AS Status;
END$$

-- 2. Procedure: Bitta janrni yangilash
CREATE PROCEDURE sp_UpdateSingleGenreCount(
    IN p_genre_id BIGINT
)
BEGIN
    DECLARE v_count BIGINT;

    SELECT COUNT(*) INTO v_count
    FROM books
    WHERE id_genre = p_genre_id;

    UPDATE genres
    SET number = v_count
    WHERE id = p_genre_id;

    SELECT CONCAT('Genre ID ', p_genre_id, ' updated with ', v_count, ' books') AS Message;
END$$

-- 3. Trigger: Kitob qo'shilganda
CREATE TRIGGER trg_books_after_insert
AFTER INSERT ON books
FOR EACH ROW
BEGIN
    UPDATE genres
    SET number = number + 1
    WHERE id = NEW.id_genre;
END$$

-- 4. Trigger: Kitob o'chirilganda
CREATE TRIGGER trg_books_after_delete
AFTER DELETE ON books
FOR EACH ROW
BEGIN
    UPDATE genres
    SET number = number - 1
    WHERE id = OLD.id_genre;
END$$

-- 5. Trigger: Kitob yangilanganda
CREATE TRIGGER trg_books_after_update
AFTER UPDATE ON books
FOR EACH ROW
BEGIN
    IF OLD.id_genre != NEW.id_genre THEN
        UPDATE genres SET number = number - 1 WHERE id = OLD.id_genre;
        UPDATE genres SET number = number + 1 WHERE id = NEW.id_genre;
    END IF;
END$$

-- 5a. Trigger: Kitob sotilganda statusni TRUE ga o'zgartirish
CREATE TRIGGER trg_sold_after_insert
AFTER INSERT ON sold
FOR EACH ROW
BEGIN
    UPDATE books SET status = TRUE WHERE id = NEW.id_books;
END$$

-- 6. Function: Kitoblar haqida maʼlumotlarni olish
CREATE FUNCTION GetBooksInRangeJSON(
    start_id INT,
    end_id INT
)
RETURNS JSON
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE result JSON;

    SELECT JSON_ARRAYAGG(
        JSON_OBJECT(
            'id', b.id,
            'name', b.name,
            'author', b.author,
            'description', b.description,
            'price', b.price,
            'cover', b.cover,
            'status', b.status,
            'genre_name', g.name,
            'genre_id', g.id
        )
    ) INTO result
    FROM books b
    LEFT JOIN genres g ON b.id_genre = g.id
    WHERE b.id BETWEEN start_id AND end_id;

    IF result IS NULL THEN
        SET result = JSON_ARRAY();
    END IF;

    RETURN result;
END$$

-- 7. Procedure: Fuzzy search
CREATE FUNCTION LEVENSHTEIN(s1 VARCHAR(255), s2 VARCHAR(255))
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE s1_len, s2_len, i, j, c, c_temp, cost INT;
    DECLARE s1_char CHAR;
    DECLARE cv0, cv1 VARBINARY(256);

    SET s1_len = CHAR_LENGTH(s1), s2_len = CHAR_LENGTH(s2), cv1 = 0x00, j = 1, i = 1, c = 0;

    IF s1 = s2 THEN
        RETURN 0;
    ELSEIF s1_len = 0 THEN
        RETURN s2_len;
    ELSEIF s2_len = 0 THEN
        RETURN s1_len;
    ELSE
        SET cv1 = CONCAT(HEX(0x00), REPEAT(HEX(0x01), s2_len));
        WHILE j <= s2_len DO
            SET i = 1;
            SET s1_char = SUBSTRING(s1, i, 1);
            SET cost = IF(SUBSTRING(s2, j, 1) = s1_char, 0, 1);
            SET c = j;
            SET cv0 = CONCAT(HEX(c), HEX(0x00));

            WHILE i <= s1_len DO
                SET c_temp = CONV(HEX(SUBSTRING(cv1, i, 1)), 16, 10) + cost;
                IF c > c_temp THEN SET c = c_temp; END IF;
                SET c_temp = CONV(HEX(SUBSTRING(cv1, i+1, 1)), 16, 10) + 1;
                IF c > c_temp THEN SET c = c_temp; END IF;
                SET cv0 = CONCAT(cv0, HEX(c));
                SET i = i + 1;
                SET s1_char = SUBSTRING(s1, i, 1);
                SET cost = IF(SUBSTRING(s2, j, 1) = s1_char, 0, 1);
            END WHILE;

            SET cv1 = cv0;
            SET j = j + 1;
        END WHILE;
    END IF;

    RETURN c;
END$$

CREATE PROCEDURE FuzzySearchAllTables(
    IN search_text VARCHAR(255),
    IN max_distance INT
)
BEGIN
    SELECT
        'books' AS source,
        b.id,
        b.name AS title,
        b.author,
        b.description,
        b.price,
        b.cover,
        b.status,
        LEVENSHTEIN(LOWER(search_text), LOWER(b.name)) AS name_distance,
        LEVENSHTEIN(LOWER(search_text), LOWER(b.author)) AS author_distance,
        LEVENSHTEIN(LOWER(search_text), LOWER(SUBSTRING(b.description, 1, 100))) AS desc_distance,
        g.name AS genre
    FROM books b
    LEFT JOIN genres g ON b.id_genre = g.id
    WHERE
        LEVENSHTEIN(LOWER(search_text), LOWER(b.name)) <= max_distance
        OR LEVENSHTEIN(LOWER(search_text), LOWER(b.author)) <= max_distance
        OR LEVENSHTEIN(LOWER(search_text), LOWER(SUBSTRING(b.description, 1, 100))) <= max_distance

    UNION

    SELECT
        'genres' AS source,
        g.id,
        g.name AS title,
        NULL AS author,
        CONCAT(g.number, ' books') AS description,
        0 AS price,
        NULL AS cover,
        1 AS status,
        LEVENSHTEIN(LOWER(search_text), LOWER(g.name)) AS name_distance,
        999 AS author_distance,
        999 AS desc_distance,
        NULL AS genre
    FROM genres g
    WHERE LEVENSHTEIN(LOWER(search_text), LOWER(g.name)) <= max_distance

    ORDER BY name_distance, author_distance, desc_distance
    LIMIT 50;
END$$

DELIMITER ;

INSERT INTO genres (name, number) VALUES
('Tarix', 12),
('Fantastika', 8),
('Psixologiya', 10),
('Detektiv', 7),
('Satira', 5),
('Falsafa', 6),
('Klassika', 9),
('Drama', 4),
('Bolalar', 11),
('Texnologiya', 6),
('Biografiya', 0);

INSERT INTO users (name, password, email, admin) VALUES
('Admin User', 'password', 'admin@example.com', TRUE),
('Ali Valiyev', 'password', 'ali@example.com', FALSE),
('Dilnoza Karimova', 'password', 'dilnoza@example.com', FALSE),
('Bobur Tursunov', 'password', 'bobur@example.com', FALSE),
('Madina Rahimova', 'password', 'madina@example.com', FALSE),
('Jasur Abdullayev', 'password', 'jasur@example.com', FALSE),
('Zebo Rasulova', 'password', 'zebo@example.com', FALSE),
('Shoxrux Mirzayev', 'password', 'shoxrux@example.com', FALSE),
('Nilufar Sodiqova', 'password', 'nilufar@example.com', FALSE),
('Akmal Karimov', 'password', 'akmal@example.com', FALSE);

INSERT INTO books (name, author, description, price, cover, status, id_genre) VALUES
('Sapiens: Insoniyatning qisqacha tarixi', 'Yuval Noah Harari', 'Insoniyat evolyutsiyasi va sivilizatsiya rivoji haqida', 150000, 'https://picsum.photos/seed/sapiens/400/600', TRUE, 1),
('Homo Deus: Ertangi kun tarixi', 'Yuval Noah Harari', 'Kelajak ssenariylari va texnologik taraqqiyot', 140000, 'https://picsum.photos/seed/homodeus/400/600', FALSE, 1),
('21-asr uchun 21 dars', 'Yuval Noah Harari', 'Zamonaviy dunyo muammolari', 135000, 'https://picsum.photos/seed/21lessons/400/600', FALSE, 1),
('Jahon tarixi', 'Will Durant', 'Sivilizatsiyalar tarixi', 180000, 'https://picsum.photos/seed/worldhistory/400/600', FALSE, 1),
('Oʻzbekiston tarixi', 'Akmal Saidov', 'Oʻzbekistonning qadimgi davrdan hozirgacha', 95000, 'https://picsum.photos/seed/uzhistory/400/600', FALSE, 1),
('Imperiyalar davri', 'Niall Ferguson', 'Buyuk imperiyalar yuksalishi va qulashi', 125000, 'https://picsum.photos/seed/empires/400/600', FALSE, 1),
('Ikkinchi jahon urushi', 'Antony Beevor', 'Eng dahshatli urush tarixi', 145000, 'https://picsum.photos/seed/ww2/400/600', FALSE, 1),
('Sovuq urush', 'John Gaddis', 'SSSR va AQSH oʻrtasidagi qarama-qarshilik', 110000, 'https://picsum.photos/seed/coldwar/400/600', FALSE, 1),
('Islom sivilizatsiyasi', 'Marshall Hodgson', 'Islom olamining tarixiy rivoji', 155000, 'https://picsum.photos/seed/islam/400/600', FALSE, 1),
('Buyuk Ipak yoʻli', 'Peter Frankopan', 'Ipak yoʻlining jahon tarixidagi oʻrni', 130000, 'https://picsum.photos/seed/silkroad/400/600', FALSE, 1),
('Qadimgi Misr', 'Toby Wilkinson', 'Firʼavnlar davri', 115000, 'https://picsum.photos/seed/egypt/400/600', FALSE, 1),
('Rim Imperiyasi', 'Mary Beard', 'Qadimgi Rim tarixi', 125000, 'https://picsum.photos/seed/rome/400/600', FALSE, 1),

('Dune', 'Frank Herbert', 'Choʻl sayyorasidagi epik fantastika', 135000, 'https://picsum.photos/seed/dune/400/600', FALSE, 2),
('Asos', 'Isaac Asimov', 'Galaktik imperiya va psixotarix', 120000, 'https://picsum.photos/seed/foundation/400/600', FALSE, 2),
('Marsdagi xronikalar', 'Ray Bradbury', 'Mars kolonizatsiyasi haqida', 90000, 'https://picsum.photos/seed/mars/400/600', FALSE, 2),
('Uch jism muammosi', 'Liu Cixin', 'Begona sivilizatsiya bilan aloqa', 140000, 'https://picsum.photos/seed/threebody/400/600', FALSE, 2),
('Oʻyinlar ochligi', 'Suzanne Collins', 'Distopiya va omon qolish oʻyinlari', 115000, 'https://picsum.photos/seed/hungergames/400/600', FALSE, 2),
('Brave New World', 'Aldous Huxley', 'Texnokratik jamiyat', 125000, 'https://picsum.photos/seed/bravenew/400/600', FALSE, 2),
('Ferenhayt 451', 'Ray Bradbury', 'Kitoblar taqiqlangan jamiyat', 95000, 'https://picsum.photos/seed/fahrenheit/400/600', FALSE, 2),
('Yulduzlararo', 'Christopher Nolan', 'Koinot sarguzashtlari', 130000, 'https://picsum.photos/seed/interstellar/400/600', FALSE, 2),

('Mulohaza yuritish', 'Daniel Kahneman', 'Tez va sekin fikrlash', 135000, 'https://picsum.photos/seed/thinking/400/600', FALSE, 3),
('Kishilar oʻyinlari', 'Eric Berne', 'Shaxslararo munosabatlar', 95000, 'https://picsum.photos/seed/games/400/600', FALSE, 3),
('Emotsional intellekt', 'Daniel Goleman', 'His-tuygʻularni boshqarish', 120000, 'https://picsum.photos/seed/eq/400/600', FALSE, 3),
('Odamlar bilan muomala', 'Dale Carnegie', 'Muloqot psixologiyasi', 85000, 'https://picsum.photos/seed/people/400/600', FALSE, 3),
('Mukammallik siri', 'Robert Greene', 'Hokimiyat va taʼsir', 140000, 'https://picsum.photos/seed/power/400/600', FALSE, 3),
('Onaning taʼsiri', 'Sue Gerhardt', 'Bola psixologiyasi', 110000, 'https://picsum.photos/seed/mother/400/600', FALSE, 3),
('Depressiya bilan kurash', 'Johann Hari', 'Ruhiy tushkunlik sabablari', 100000, 'https://picsum.photos/seed/depression/400/600', FALSE, 3),
('Stress va uning oqibatlari', 'Robert Sapolsky', 'Stressni boshqarish', 125000, 'https://picsum.photos/seed/stress/400/600', FALSE, 3),
('Tushlar talqini', 'Sigmund Freud', 'Psixoanaliz asoslari', 115000, 'https://picsum.photos/seed/dreams/400/600', FALSE, 3),
('Ijodkorlik psixologiyasi', 'Mihaly Csikszentmihalyi', 'Ijodiy jarayon sirlari', 130000, 'https://picsum.photos/seed/creativity/400/600', FALSE, 3);

INSERT INTO sold (id_users, id_books, date) VALUES
(2, 1, '2024-01-15'),
(3, 3, '2024-01-20'),
(4, 5, '2024-01-25'),
(5, 2, '2024-02-01'),
(6, 4, '2024-02-05'),
(7, 7, '2024-02-10'),
(8, 9, '2024-02-15'),
(9, 11, '2024-02-20'),
(10, 13, '2024-02-25'),
(2, 15, '2024-03-01'),
(3, 17, '2024-03-05'),
(4, 19, '2024-03-10'),
(5, 21, '2024-03-15'),
(6, 23, '2024-03-20');

-- Ensure accurate category counts
CALL sp_UpdateAllGenreCounts();
