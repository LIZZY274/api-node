import express from 'express';
import cors from 'cors';
import userRouter from './routes/userRoutes.js';
import productoRouter from './routes/productRoutes.js';
import regexRouter from './routes/regexRoutes.js';
import questionRouter from './routes/questionRoutes.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use('/api', userRouter);
app.use('/api', productoRouter);
app.use('/api', regexRouter);
app.use('/api/questions', questionRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});