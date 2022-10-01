import express from 'express';
import { createBudgetItem } from '../controllers/budgetItems.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, createBudgetItem);
router.delete('/:id');
router.patch('/:id');

export default router;
