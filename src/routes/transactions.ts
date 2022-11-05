import express from 'express';
import {
  createTransaction,
  deleteTransaction,
  editTransaction,
  getTransactions,
} from '../controllers/transactions.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/:budgetId', auth, getTransactions);
router.post('/', auth, createTransaction);
router.delete('/:id', auth, deleteTransaction);
router.patch('/:id', auth, editTransaction);

export default router;
