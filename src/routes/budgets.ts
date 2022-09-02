import express from 'express';
import {
  createBudget,
  deleteBudget,
  getBudgets,
} from '../controllers/budgets.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, getBudgets);
router.post('/', auth, createBudget);
router.delete('/:id', auth, deleteBudget);

export default router;
