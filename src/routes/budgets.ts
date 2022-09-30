import express from 'express';
import {
  createBudget,
  deleteBudget,
  getBudget,
  getBudgets,
} from '../controllers/budgets.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, getBudgets);
router.get('/:id', auth, getBudget);
router.post('/', auth, createBudget);
router.delete('/:id', auth, deleteBudget);

export default router;
