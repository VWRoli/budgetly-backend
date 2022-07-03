import express from 'express';
import { createUser, getProfile, login } from '../controllers/users.js';

const router = express.Router();

router.post('/user', createUser);
router.post('/login', login);
router.get('/user', getProfile);

export default router;
