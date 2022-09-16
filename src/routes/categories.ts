import express from 'express';
import auth from '../middleware/auth';

const router = express.Router();

router.get('/', auth, getCategories);
router.post('/', auth, createCategory);
router.delete('/:id', auth, deleteCategory);

export default router;
