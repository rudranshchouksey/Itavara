import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes';
import { authGuard } from './middleware/authGuard';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Auth routes
app.use('/api/auth', authRoutes);

// Example of a protected route using the authGuard
app.get('/api/me', authGuard, (req, res) => {
  res.status(200).json({ user: req.user });
});

app.listen(PORT, () => {
  console.log(`API Server running on port ${PORT}`);
});
