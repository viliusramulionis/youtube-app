import { Router } from 'express';
import Category from '../models/category.js';

const router = Router();

router.get('/', async (req, res) => {
    try {
        res.json(await Category.find());
    } catch {
        res.status(500).json('Unable to reach server');
    }
});

export default router;