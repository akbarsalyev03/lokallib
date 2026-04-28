export const mockData = {
    books: [
        { id: '1', name: 'O\'tkan kunlar', author: 'Abdulla Qodiriy', description: 'O\'zbek adabiyotining durdonasi.', price: 45000, cover: 'https://picsum.photos/seed/book1/400/600', status: true, id_genre: '1' },
        { id: '2', name: 'Sariq devni minib', author: 'Xudoyberdi To\'xtaboyev', description: 'Sarguzasht asar.', price: 35000, cover: 'https://picsum.photos/seed/book2/400/600', status: true, id_genre: '11' },
        { id: '3', name: 'Atom odatlar', author: 'James Clear', description: 'Shaxsiy rivojlanish haqida.', price: 55000, cover: 'https://picsum.photos/seed/book3/400/600', status: true, id_genre: '3' },
        { id: '4', name: 'Boy ota, kambag\'al ota', author: 'Robert Kiyosaki', description: 'Moliyaviy savodxonlik.', price: 48000, cover: 'https://picsum.photos/seed/book4/400/600', status: true, id_genre: '3' },
        { id: '5', name: 'Shaytanat', author: 'Tohir Malik', description: 'Detektiv asar.', price: 60000, cover: 'https://picsum.photos/seed/book5/400/600', status: true, id_genre: '5' }
    ],
    users: [
        { id: '1', name: 'Admin User', email: 'admin@example.com', password: 'password', admin: true },
        { id: '2', name: 'Ali Valiyev', email: 'ali@example.com', password: 'password', admin: false }
    ],
    genres: [
        { id: '1', name: 'Tarix', number: 12 },
        { id: '2', name: 'Fantastika', number: 8 },
        { id: '3', name: 'Psixologiya', number: 10 },
        { id: '4', name: 'Detektiv', number: 7 },
        { id: '5', name: 'Satira', number: 5 },
        { id: '6', name: 'Falsafa', number: 6 },
        { id: '7', name: 'Klassika', number: 9 },
        { id: '8', name: 'Drama', number: 4 },
        { id: '9', name: 'Bolalar', number: 11 },
        { id: '10', name: 'Texnologiya', number: 6 },
        { id: '11', name: 'Biografiya', number: 0 }
    ],
    sold: [
        { id: '1', id_users: '2', id_books: '1', date: '2024-01-15' }
    ]
};

export const executeMockQuery = (sql, params) => {
    sql = sql.toLowerCase();
    
    if (sql.includes('select * from users where email')) {
        return mockData.users.filter(u => u.email === params[0] && u.password === params[1]);
    }
    if (sql.includes('select id, name, email, admin from users')) {
        return mockData.users;
    }
    if (sql.includes('insert into users')) {
        const newUser = { id: String(Date.now()), name: params[0], email: params[1], password: params[2], admin: false };
        mockData.users.push(newUser);
        return { insertId: newUser.id };
    }
    
    if (sql.includes('delete from users')) {
        mockData.users = mockData.users.filter(u => u.id !== String(params[0]));
        return {};
    }
    
    if (sql.includes('update users set admin')) {
        const index = mockData.users.findIndex(u => u.id === String(params[1]));
        if (index !== -1) {
            mockData.users[index].admin = Boolean(params[0]);
        }
        return {};
    }
    
    if (sql.includes('select b.*, g.name as genre_name from books')) {
        if (sql.includes('where b.id = ?')) {
            const book = mockData.books.find(b => b.id === String(params[0]));
            if (book) {
                const genre = mockData.genres.find(g => g.id === book.id_genre);
                return [{ ...book, genre_name: genre ? genre.name : null }];
            }
            return [];
        }
        if (sql.includes('where b.name like ?')) {
            const search = params[0].replace(/%/g, '').toLowerCase();
            return mockData.books.filter(b => b.name.toLowerCase().includes(search) || b.author.toLowerCase().includes(search)).map(book => {
                const genre = mockData.genres.find(g => g.id === book.id_genre);
                return { ...book, genre_name: genre ? genre.name : null };
            });
        }
        return mockData.books.map(book => {
            const genre = mockData.genres.find(g => g.id === book.id_genre);
            return { ...book, genre_name: genre ? genre.name : null };
        });
    }
    
    if (sql.includes('insert into books')) {
        const newBook = { 
            id: String(Date.now()), 
            name: params[0], 
            author: params[1], 
            description: params[2], 
            price: params[3], 
            cover: params[4], 
            status: params[5], 
            id_genre: String(params[6]) 
        };
        mockData.books.push(newBook);
        return { insertId: newBook.id };
    }
    
    if (sql.includes('update books set')) {
        const index = mockData.books.findIndex(b => b.id === String(params[7]));
        if (index !== -1) {
            mockData.books[index] = {
                ...mockData.books[index],
                name: params[0], author: params[1], description: params[2], price: params[3], cover: params[4], status: params[5], id_genre: String(params[6])
            };
        }
        return {};
    }
    
    if (sql.includes('delete from books')) {
        mockData.books = mockData.books.filter(b => b.id !== String(params[0]));
        return {};
    }
    
    if (sql.includes('select * from genres')) {
        return mockData.genres;
    }
    
    if (sql.includes('select * from sold')) {
        if (sql.includes('where id_users = ?')) {
            return mockData.sold.filter(s => s.id_users === String(params[0]));
        }
        return mockData.sold;
    }
    
    if (sql.includes('insert into sold')) {
        const newSold = { id: String(Date.now()), id_users: String(params[0]), id_books: String(params[1]), date: params[2] };
        mockData.sold.push(newSold);
        
        // Mock trigger
        const bookIndex = mockData.books.findIndex(b => b.id === String(params[1]));
        if (bookIndex !== -1) mockData.books[bookIndex].status = true;
        
        return { insertId: newSold.id };
    }
    
    return [];
};
