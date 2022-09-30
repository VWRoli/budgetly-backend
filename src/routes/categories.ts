import express from 'express';
import {
  createCategory,
  deleteCategory,
  editCategory,
  getCategories,
  getCategory,
} from '../controllers/categories.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, getCategories);
router.get('/:id', auth, getCategory);
router.post('/', auth, createCategory);
router.delete('/:id', auth, deleteCategory);
router.patch('/:id', auth, editCategory);

export default router;
