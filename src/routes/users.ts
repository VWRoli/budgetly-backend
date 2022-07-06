import express from 'express';
import { createUser, getProfile, login } from '../controllers/users.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/user', createUser);
router.post('/login', login);
router.get('/me', auth, getProfile);

export default router;
