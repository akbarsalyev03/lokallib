import express from 'express';
import { query } from './connect.js';

const router = express.Router();

// Get users
router.get('/', async (req, res) => {
    try {
        const users = await query('SELECT id, name, email, admin FROM users');
        res.json(users.map(u => ({
            ...u,
            id: String(u.id),
            admin: !!u.admin
        })));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/', async (req, res) => {
    const { id } = req.query;
    try {
        await query('DELETE FROM users WHERE id = ?', [id]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/', async (req, res) => {
    const { id } = req.query;
    const { admin } = req.body;
    try {
        await query('UPDATE users SET admin = ? WHERE id = ?', [admin, id]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
export default router;
