import express from 'express';
import { query } from './connect.js';

const router = express.Router();

router.post('/login.php', async (req, res) => {
    const { email, password } = req.body;
    try {
        const users = await query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
        if (users.length > 0) {
            const user = users[0];
            delete user.password;
            user.id = String(user.id);
            user.admin = !!user.admin;
            res.json({ user });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/register.php', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const result = await query(
            'INSERT INTO users (name, email, password, admin) VALUES (?, ?, ?, false)',
            [name, email, password]
        );
        res.json({ user: { id: String(result.insertId), name, email, admin: false } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
