import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import redis from '../services/redis.service';
import { AuthService } from '../services/auth.service';
import { prisma } from '@itvara/db';
import { env } from '@itvara/config';
import { JwtPayload } from '@itvara/types';

export interface AuthenticatedSocket extends Socket {
  user?: JwtPayload;
}

let io: Server;

export function initSocketIO(httpServer: HttpServer): Server {
  io = new Server(httpServer, {
    cors: {
      origin: env.SOCKET_CORS_ORIGIN,
      credentials: true,
    },
  });

  const pubClient = redis;
  const subClient = pubClient.duplicate();

  io.adapter(createAdapter(pubClient, subClient));

  // Authentication Middleware
  io.use((socket: AuthenticatedSocket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error: Missing token'));
    }

    try {
      const payload = AuthService.verifyJwt(token);
      socket.user = payload;
      next();
    } catch (err) {
      return next(new Error('Authentication error: Invalid or expired token'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    const user = socket.user;
    if (!user) return socket.disconnect();
    console.log(`User connected to Socket.io: ${user.userId}`);

    socket.on('join_conversation', async ({ conversationId }) => {
      // Validate participation
      const conversation = await prisma.conversation.findFirst({
        where: {
          id: conversationId,
          participants: {
            some: { id: user.userId }
          }
        }
      });

      if (conversation) {
        socket.join(conversationId);
        console.log(`User ${user.userId} joined conversation ${conversationId}`);
      }
    });

    socket.on('send_message', async ({ conversationId, content, mediaUrl }) => {
      try {
        const message = await prisma.message.create({
          data: {
            conversationId,
            senderId: user.userId,
            content,
            mediaUrl,
          },
          include: {
            sender: {
              select: { id: true, name: true, profilePhoto: true }
            }
          }
        });

        // Update conversation updatedAt
        await prisma.conversation.update({
          where: { id: conversationId },
          data: { updatedAt: new Date() }
        });

        io.to(conversationId).emit('new_message', message);
      } catch (err) {
        console.error('Error sending message:', err);
      }
    });

    socket.on('typing_indicator', ({ conversationId, isTyping }) => {
      socket.to(conversationId).emit('typing_indicator', {
        userId: user.userId,
        isTyping
      });
    });

    socket.on('message_read_receipt', async ({ messageId, conversationId }) => {
      try {
        const message = await prisma.message.update({
          where: { id: messageId },
          data: { isRead: true }
        });
        
        io.to(conversationId).emit('read_receipt', {
          messageId,
          userId: user.userId
        });
      } catch (err) {
        console.error('Error updating read receipt:', err);
      }
    });

    // Group Rooms & Messaging
    socket.on('join_group_room', async ({ roomId }) => {
      try {
        const membership = await prisma.groupRoomMember.findUnique({
          where: {
            roomId_userId: { roomId, userId: user.userId }
          }
        });

        if (membership) {
          socket.join(`group_${roomId}`);
          console.log(`User ${user.userId} joined group room ${roomId}`);
        }
      } catch (err) {
        console.error('Error joining group room:', err);
      }
    });

    socket.on('send_group_message', async ({ roomId, content, mediaUrl }) => {
      try {
        const message = await prisma.groupMessage.create({
          data: {
            roomId,
            senderId: user.userId,
            content,
            mediaUrl,
          },
          include: {
            sender: {
              select: { id: true, name: true, profilePhoto: true }
            }
          }
        });

        io.to(`group_${roomId}`).emit('new_group_message', message);
      } catch (err) {
        console.error('Error sending group message:', err);
      }
    });

    // WebRTC Signaling
    socket.on('webrtc_offer', ({ roomId, offer, targetUserId }) => {
      socket.to(`group_${roomId}`).emit('webrtc_offer', {
        roomId,
        offer,
        senderId: user.userId,
        targetUserId
      });
    });

    socket.on('webrtc_answer', ({ roomId, answer, targetUserId }) => {
      socket.to(`group_${roomId}`).emit('webrtc_answer', {
        roomId,
        answer,
        senderId: user.userId,
        targetUserId
      });
    });

    socket.on('webrtc_ice_candidate', ({ roomId, candidate, targetUserId }) => {
      socket.to(`group_${roomId}`).emit('webrtc_ice_candidate', {
        roomId,
        candidate,
        senderId: user.userId,
        targetUserId
      });
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected from Socket.io: ${user.userId}`);
    });
  });

  return io;
}
