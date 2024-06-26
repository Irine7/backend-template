import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express'; //Добавлены типы для req и res с помощью интерфейсов Request и Response из пакета express
import User, { UserDocument } from '../models/user.model.js';

// Определение интерфейса для объекта запроса с учетом свойства user
interface AuthenticatedRequest extends Request {
	user?: UserDocument; // Свойство user может быть UserDocument или undefined
}

const protectRoute = async (
	req: AuthenticatedRequest, // Используем пользовательский интерфейс
	res: Response,
	next: NextFunction
) => {
	try {
		// Здесь извлекается токен из куки запроса (если он там есть)
		const token = req.cookies.jwt;
		if (!token) {
			return res.status(401).json({ error: 'Unauthorized. No token provided' });
		}
		// Проверяем, что JWT_SECRET не является undefined
		if (!process.env.JWT_SECRET) {
			return res
				.status(500)
				.json({ error: 'Internal server error. JWT_SECRET is undefined' });
		}
		// Если токен верифицируется успешно, его расшифрованные данные сохраняются в переменной decoded.
		const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
			userId: string;
		};
		if (!decoded) {
			return res.status(401).json({ error: 'Unauthorized. Invalid token' });
		}
		// Запрашивается пользователь из базы данных с помощью userId, извлеченного из расшифрованного токена. Поле -password указывает, что пароль пользователя не должен быть включен в возвращаемый результат.
		const user = await User.findById(decoded.userId).select('-password');
		if (!user) {
			return res.status(404).json({ error: 'Unauthorized. User not found' });
		}

		//  Пользователь добавляется в объект запроса (req.user), чтобы следующие обработчики маршрута имели к нему доступ
		req.user = user;
		next();
	} catch (error) {
		console.log('Error in protectRoute controller:', (error as Error).message);
		res.status(500).json({ error: 'Internal server error' });
	}
};

export default protectRoute;
