import express from 'express';

const router = express.Router();

router.post('/');
router.delete('/:id');
router.patch('/:id');

export default router;
