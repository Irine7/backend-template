import bcrypt from 'bcryptjs';

import User from '../models/user.model.js';
import generateTokenAndSetCookie from '../utils/generateToken.js';

export const signup = async (req, res) => {
	try {
		const { fullName, userName, password, confirmPassword, gender } = req.body;
		if (password !== confirmPassword) {
			return res.status(400).json({ error: 'Passwords do not match' });
		}
		const user = await User.findOne({ userName });
		if (user) {
			return res.status(400).json({ error: 'User already exists' });
		}

		// Хэш пароля
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const newUser = new User({
			fullName,
			userName,
			password: hashedPassword,
			gender,
		});

		if (newUser) {
			// Генерируем JWT токен и устанавливаем его в куки
			generateTokenAndSetCookie(newUser._id, res);
			await newUser.save(); // Сохраняем нового пользователя в базе данных
			res.status(201).json({
				_id: newUser._id,
				fullName: newUser.fullName,
				userName: newUser.userName,
			});
		} else {
			res.status(400).json({ error: 'Invalid user data' });
		}
	} catch (error) {
		console.log('Error in signup controller:', error.message);
		res.status(500).json({ error: 'Internal server error' });
	}
};

export const login = async (req, res) => {
	try {
		const { userName, password } = req.body;
		// Проверяем, есть ли пользователь с таким именем в базе данных
		const user = await User.findOne({ userName });
		const isPasswordCorrect = await bcrypt.compare(
			password,
			user?.password || ''
		);

		// Если пользователь не найден или пароль неверен
		if (!user || !isPasswordCorrect) {
			return res.status(400).json({ error: 'Invalid username or password' });
		}

		// Генерация JWT токена и установка его в куки
		generateTokenAndSetCookie(user._id, res);
		// Отправка JSON-ответа с данными пользователя
		res.status(200).json({
			_id: user._id,
			fullName: user.fullName,
			userName: user.userName,
		});
	} catch (error) {
		console.log('Error in login controller:', error.message);
		res.status(500).json({ error: 'Internal server error' });
	}
};

export const logout = async (req, res) => {
	try {
		// Устанавливает куки с именем jwt в пустое значение и устанавливает его максимальное время жизни (maxAge) в 0 миллисекунд. При установке времени жизни куки в 0, она немедленно удаляется
		res.cookie('jwt', '', { maxAge: 0 });
		res.status(200).json({ message: 'Logout successfully done' });
	} catch (error) {
		console.log('Error in logout controller:', error.message);
		res.status(500).json({ error: 'Internal server error' });
	}
};
