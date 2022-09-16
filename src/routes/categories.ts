import express from 'express';
import {
  createCategory,
  deleteCategory,
  getCategories,
} from '../controllers/categories';
import auth from '../middleware/auth';

const router = express.Router();

router.get('/', auth, getCategories);
router.post('/', auth, createCategory);
router.delete('/:id', auth, deleteCategory);

export default router;
