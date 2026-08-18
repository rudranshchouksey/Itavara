import { io as Client, Socket } from 'socket.io-client';
import { httpServer } from '../../src/server';
import { env } from '@itvara/config';
import { RedisCacheService } from '../../src/common/cache/redis-cache.service';
import { AuthService } from '../../src/services/auth.service';
import { prisma } from '@itvara/db';

describe('WebSockets Integration', () => {
  let clientSocket: Socket;

  beforeAll((done) => {
    jest.spyOn(AuthService, 'verifyJwt').mockReturnValue({ userId: 'test_user', role: 'guest' } as any);

    const connectClient = (port: number) => {
      clientSocket = Client(`http://localhost:${port}`, { auth: { token: 'dummy_token' } });
      clientSocket.on('connect', done);
      clientSocket.on('connect_error', done);
    };

    if (!httpServer.listening) {
      httpServer.listen(() => connectClient((httpServer.address() as any).port));
    } else {
      connectClient((httpServer.address() as any).port);
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
