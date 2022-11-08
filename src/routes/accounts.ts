import express from 'express';
import { createAccount, getAccount } from '../controllers/accounts.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, createAccount);
router.get('/:id', auth, getAccount);

export default router;
