import express from 'express';
import { createAccount, getAccounts } from '../controllers/accounts.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, getAccounts);
router.post('/', auth, createAccount);

export default router;
