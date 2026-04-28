import express from 'express';
import { query } from './connect.js';

const router = express.Router();

router.get('/', async (req, res) => {
    const { id, search } = req.query;
    try {
        if (id) {
            const books = await query('SELECT b.*, g.name as genre_name FROM books b LEFT JOIN genres g ON b.id_genre = g.id WHERE b.id = ?', [id]);
            if (!books.length) return res.json(null);
            
            const b = books[0];
            return res.json({
                ...b,
                id: String(b.id),
                id_genre: String(b.id_genre),
                status: !!b.status
            });
        }
        if (search) {
            const searchTerm = `%${search}%`;
            const books = await query('SELECT b.*, g.name as genre_name FROM books b LEFT JOIN genres g ON b.id_genre = g.id WHERE b.name LIKE ? OR b.author LIKE ?', [searchTerm, searchTerm]);
            return res.json(books.map(b => ({
                ...b,
                id: String(b.id),
                id_genre: String(b.id_genre),
                status: !!b.status
            })));
        }
        
        const books = await query('SELECT b.*, g.name as genre_name FROM books b LEFT JOIN genres g ON b.id_genre = g.id');
        
        const formattedBooks = books.map(b => ({
            ...b,
            id: String(b.id),
            id_genre: String(b.id_genre),
            status: !!b.status
        }));
        res.json(formattedBooks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    const { name, author, description, price, cover, status, id_genre } = req.body;
    try {
        const result = await query(
            'INSERT INTO books (name, author, description, price, cover, status, id_genre) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [name, author, description, price, cover, status || false, id_genre]
        );
        res.json({ id: String(result.insertId), ...req.body });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/', async (req, res) => {
    const { id } = req.query;
    const { name, author, description, price, cover, status, id_genre } = req.body;
    try {
        await query(
            'UPDATE books SET name = ?, author = ?, description = ?, price = ?, cover = ?, status = ?, id_genre = ? WHERE id = ?',
            [name, author, description, price, cover, status, id_genre, id]
        );
        res.json({ id: String(id), ...req.body });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/', async (req, res) => {
    const { id } = req.query;
    try {
        await query('DELETE FROM books WHERE id = ?', [id]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
