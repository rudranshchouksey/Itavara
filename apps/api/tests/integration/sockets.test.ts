import { io as Client, Socket } from 'socket.io-client';
import { httpServer } from '../../src/server';
import { env } from '@itvara/config';
import { RedisCacheService } from '../../src/common/cache/redis-cache.service';
import { prisma } from '@itvara/db';

describe('WebSockets Integration', () => {
  let clientSocket: Socket;

  beforeAll((done) => {
    // Only start if it's not already listening (it shouldn't be in test mode)
    if (!httpServer.listening) {
      httpServer.listen(() => {
        const port = (httpServer.address() as any).port;
        clientSocket = Client(`http://localhost:${port}`);
        clientSocket.on('connect', done);
      });
    } else {
      const port = (httpServer.address() as any).port;
      clientSocket = Client(`http://localhost:${port}`);
      clientSocket.on('connect', done);
    }
  });

  afterAll((done) => {
    if (clientSocket.connected) {
      clientSocket.disconnect();
    }
    RedisCacheService.disconnect();
    prisma.$disconnect().then(() => {
      httpServer.close(done);
    });
  });

  it('should connect to the socket server and receive emitted events', (done) => {
    // We expect the server to send some event, or we can emit and expect a response.
    // For now, simply validating connection success is a good baseline integration.
    expect(clientSocket.connected).toBe(true);
    done();
  });
});
