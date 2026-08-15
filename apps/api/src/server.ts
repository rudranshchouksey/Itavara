import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes';
import verificationRoutes from './routes/verification.routes';
import userRoutes from './routes/user.routes';
import uploadRoutes from './routes/upload.routes';
import listingsRoutes from './routes/listings.routes';
import bookingsRoutes from './routes/bookings.routes';
import paymentsRoutes from './routes/payments.routes';
import mediaRoutes from './routes/media.routes';
import feedRoutes from './routes/feed.routes';
import postsRoutes from './routes/posts.routes';
import hostsRoutes from './routes/hosts.routes';
import { env } from '@itvara/config';
import { authGuard } from './middleware/authGuard';
import { initSocketIO } from './sockets';

import { serializeResponseMiddleware } from './middleware/serializeResponse';

const app = express();
const httpServer = createServer(app);
const PORT = env.PORT;

// Initialize Socket.io
initSocketIO(httpServer);

app.use(cors({
  origin: env.SOCKET_CORS_ORIGIN,
  credentials: true,
}));

app.use(express.json({
  verify: (req: any, res, buf) => {
    if (req.originalUrl === '/api/payments/verify') {
      req.rawBody = buf.toString();
    }
  }
}));
app.use(cookieParser());

// Apply global serialization middleware
app.use(serializeResponseMiddleware);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/verification', verificationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/listings', listingsRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/feed', feedRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/hosts', hostsRoutes);

// Example of a protected route using the authGuard
app.get('/api/me', authGuard, (req, res) => {
  res.status(200).json({ user: req.user });
});

httpServer.listen(PORT, () => {
  console.log(`API Server running on port ${PORT}`);
});


