import jwt from 'jsonwebtoken';
import { Response } from 'express';

type UserId = string;

// Создание токен аутентификации и его установка в cookies ответа (res)
const generateTokenAndSetCookie = (userId: UserId, res: Response) => {
	// Проверка, определено ли значение process.env.JWT_SECRET
	if (!process.env.JWT_SECRET) {
		throw new Error('JWT_SECRET is not defined');
	}

	const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: '15d', // время жизни токена
	});

	res.cookie('jwt', token, {
		httpOnly: true, // доступен только для HTTP-запросов (защита от атак XSS)
		sameSite: 'strict', // куки будут отправляться только в случае, если домен в адресной строке полностью совпадает с доменом, на который отправляется запрос (защита от атак CSRF)
		maxAge: 15 * 24 * 60 * 60 * 1000, // время жизни куки в миллисекундах
		secure: process.env.NODE_ENV !== 'development', // куки будут отправляться только в случае, если настройка NODE_ENV равна production
		path: '/',
	});
};

export default generateTokenAndSetCookie;
