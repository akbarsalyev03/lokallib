import express from 'express';
import { query } from './connect.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const genres = await query('SELECT * FROM genres');
        res.json(genres.map(g => ({
            ...g,
            id: String(g.id),
            number: Number(g.number)
        })));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
