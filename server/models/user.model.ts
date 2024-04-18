import mongoose, { Document } from 'mongoose';

// Определение интерфейса для модели пользователя
interface User {
	fullName: string;
	userName: string;
	password: string;
	gender: 'male' | 'female' | 'other';
}

// Определение интерфейса для документа пользователя в MongoDB
export interface UserDocument extends User, Document {}

// Определение схемы пользователя
const userSchema = new mongoose.Schema(
	{
		fullName: {
			type: String,
			required: true,
		},
		userName: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		gender: {
			type: String,
			required: true,
			enum: ['male', 'female', 'other'],
		},
	},
	{ timestamps: true }
);

// Создание модели пользователя
const User = mongoose.model<UserDocument>('User', userSchema);

export default User;
