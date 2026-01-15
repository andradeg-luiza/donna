export const prismaMock = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },

  task: {
    findUnique: jest.fn(),   // ← ADICIONADO
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },

  taskItem: {
    findUnique: jest.fn(),   // ← ADICIONADO
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },

  reminder: {
    findUnique: jest.fn(),   // ← ADICIONADO
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },

  appointment: {
    findUnique: jest.fn(),   // ← ADICIONADO
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },

  userAction: {
    create: jest.fn(),
    findMany: jest.fn(),
  },
};
