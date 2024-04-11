import express from 'express';
import dotenv from 'dotenv';
import http from 'http';
import cookieParser from 'cookie-parser';

import connectToMongoDB from './db/connectToMongoDB.js';
import authRoutes from './routes/auth.routes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3001;

// Добавляем middleware для парсинга JSON
app.use(express.json());
// Добавляем middleware для обработки cookies
app.use(cookieParser());

// Подключает маршруты аутентификации, которые определены в файле auth.routes.js
app.use('/api/auth', authRoutes);

server.listen(PORT, () => {
	connectToMongoDB();
	console.log(`Server listening on port ${PORT}`);
});

