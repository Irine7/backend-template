import express from 'express';
import { signup, login, logout } from '../controllers/auth.controllers.js';

// Создаем новый экземпляр маршрутизатора Express, который будет использоваться для определения маршрутов.
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

export default router;
