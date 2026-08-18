// Mock ioredis completely for all integration tests
jest.mock('ioredis', () => {
  const mRedis = {
    on: jest.fn(),
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue('OK'),
    scan: jest.fn().mockResolvedValue(['0', []]),
    del: jest.fn().mockResolvedValue(1),
    ping: jest.fn().mockResolvedValue('PONG'),
    disconnect: jest.fn(),
    status: 'ready',
    duplicate: jest.fn().mockReturnThis()
  };
  return jest.fn(() => mRedis);
});

// Mock Socket.io-redis adapter to avoid redis connections from sockets
jest.mock('@socket.io/redis-adapter', () => ({
  createAdapter: jest.fn(() => jest.fn())
}));

// Mock Prisma
jest.mock('@itvara/db', () => ({
  prisma: {
    $queryRawUnsafe: jest.fn().mockResolvedValue([]),
    $transaction: jest.fn(),
    $disconnect: jest.fn().mockResolvedValue(true),
    listing: {
      findMany: jest.fn().mockResolvedValue([]),
    },
    conversation: {
      findFirst: jest.fn().mockResolvedValue(null),
      update: jest.fn(),
    },
    message: {
      create: jest.fn().mockResolvedValue({}),
      update: jest.fn().mockResolvedValue({}),
    },
    groupRoomMember: {
      findUnique: jest.fn().mockResolvedValue(null),
    },
    groupMessage: {
      create: jest.fn().mockResolvedValue({}),
    },
    booking: {
      create: jest.fn().mockResolvedValue({}),
      findMany: jest.fn().mockResolvedValue([]),
      update: jest.fn().mockResolvedValue({}),
    }
  },
}));
