import express from 'express';
import {
  createBudgetItem,
  editBudgetItem,
} from '../controllers/budgetItems.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, createBudgetItem);
//router.delete('/:id');
router.patch('/:id', auth, editBudgetItem);

export default router;
