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
import guidesRoutes from './routes/guides.routes';
import rentalsRoutes from './routes/rentals.routes';
import superhostsRoutes from './routes/superhosts.routes';
import corporateRoutes from './routes/corporate.routes';
import adsRoutes from './routes/ads.routes';
import notificationsRoutes from './routes/notifications.routes';
import privacyRoutes from './routes/privacy.routes';
import securityRoutes from './routes/security.routes';
import { env } from '@itvara/config';
import { authGuard } from './middleware/authGuard';
import { initSocketIO } from './sockets';

import { serializeResponseMiddleware } from './middleware/serializeResponse';

import { sanitizeMiddleware } from './middleware/sanitize.middleware';
import helmet from 'helmet';

const app = express();
const httpServer = createServer(app);
const PORT = env.PORT;

// Initialize Socket.io
initSocketIO(httpServer);

// Security Headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", env.CLIENT_WEB_URL || '*'],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// Strict CORS Origin Whitelisting
const allowedOrigins = [env.CLIENT_WEB_URL, env.CLIENT_MOBILE_SCHEME, env.SOCKET_CORS_ORIGIN].filter(Boolean);
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json({
  verify: (req: any, res, buf) => {
    if (req.originalUrl === '/api/payments/verify') {
      req.rawBody = buf.toString();
    }
  }
}));

// Apply global input sanitization
app.use(sanitizeMiddleware);

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
app.use('/api/guides', guidesRoutes);
app.use('/api/rentals', rentalsRoutes);
app.use('/api/superhosts', superhostsRoutes);
app.use('/api/corporate', corporateRoutes);
app.use('/api/ads', adsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/privacy', privacyRoutes);
app.use('/api/security', securityRoutes);

// Example of a protected route using the authGuard
app.get('/api/me', authGuard, (req, res) => {
  res.status(200).json({ user: req.user });
});

httpServer.listen(PORT, () => {
  console.log(`API Server running on port ${PORT}`);
});


