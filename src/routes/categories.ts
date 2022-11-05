import express from 'express';
import {
  createCategory,
  deleteCategory,
  editCategory,
  getCategories,
} from '../controllers/categories.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/:budgetId', auth, getCategories);
router.post('/', auth, createCategory);
router.delete('/:id', auth, deleteCategory);
router.patch('/:id', auth, editCategory);

export default router;
