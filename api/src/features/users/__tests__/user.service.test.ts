import { describe, expect, it, vi } from 'vitest';
import type { User } from '../../../generated/prisma/client.js';
import userRepository from '../user.repository.js';
import userService from '../user.service.js';

const mockUserData = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    firstName: 'Alice',
    lastName: 'Martin',
    email: 'alice@mail.com',
    username: 'alice',
    isVerified: true,
    role: 'USER' as const,
    plan: 'FREE' as const,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    firstName: 'Bob',
    lastName: 'Smith',
    email: 'bob@mail.com',
    username: 'bob',
    isVerified: true,
    role: 'USER' as const,
    plan: 'FREE' as const,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    firstName: 'Carol',
    lastName: 'Jones',
    email: 'carol@mail.com',
    username: 'carol',
    isVerified: false,
    role: 'USER' as const,
    plan: 'PAID' as const,
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01'),
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    firstName: 'Dan',
    lastName: 'Brown',
    email: 'dan@mail.com',
    username: 'dan',
    isVerified: true,
    role: 'ADMIN' as const,
    plan: 'PAID' as const,
    createdAt: new Date('2024-04-01'),
    updatedAt: new Date('2024-04-01'),
  },
  {
    id: '55555555-5555-5555-5555-555555555555',
    firstName: 'Eve',
    lastName: 'White',
    email: 'eve@mail.com',
    username: 'eve',
    isVerified: false,
    role: 'USER' as const,
    plan: 'FREE' as const,
    createdAt: new Date('2024-05-01'),
    updatedAt: new Date('2024-05-01'),
  },
] as User[];

vi.mock('../user.repository.js', () => ({
  default: {
    findUsers: vi.fn(),
    findUserById: vi.fn(),
  },
}));

describe('userService', () => {
  describe('userService generation', () => {
    it('returns all users', async () => {
      vi.mocked(userRepository.findUsers).mockResolvedValueOnce(mockUserData);

      const mockUsers = await userService.getUsers();
      expect(mockUsers).toHaveLength(5);
    });

    it('returns a specific user based on id', async () => {
      vi.mocked(userRepository.findUserById).mockResolvedValueOnce(mockUserData[4] as User);

      const mockUsers = await userService.getUserById('55555555-5555-5555-5555-555555555555');
      expect(mockUsers).toMatchObject({
        lastName: 'White',
      });
    });
  });
});
