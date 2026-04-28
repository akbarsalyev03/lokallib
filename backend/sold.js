import express from 'express';
import { query } from './connect.js';

const router = express.Router();

router.get('/', async (req, res) => {
    const { user_id } = req.query;
    try {
        if (user_id) {
            const soldList = await query('SELECT * FROM sold WHERE id_users = ?', [user_id]);
            return res.json(soldList.map(s => ({
                ...s,
                id: String(s.id),
                id_users: String(s.id_users),
                id_books: String(s.id_books)
            })));
        }
        const soldList = await query('SELECT * FROM sold');
        res.json(soldList.map(s => ({
            ...s,
            id: String(s.id),
            id_users: String(s.id_users),
            id_books: String(s.id_books)
        })));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    const { id_users, id_books } = req.body;
    try {
        // Assume trigger updates book status on insertion 
        const date = new Date().toISOString().split('T')[0];
        const result = await query(
            'INSERT INTO sold (id_users, id_books, date) VALUES (?, ?, ?)',
            [id_users, id_books, date]
        );
        res.json({ 
            id: String(result.insertId), 
            id_users: String(id_users), 
            id_books: String(id_books), 
            date 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
