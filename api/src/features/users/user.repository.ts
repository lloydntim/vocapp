import logger from '../../config/logger.js';

import prisma from '../../db/client.js';
import type { Credential, Prisma, User } from '../../generated/prisma/client.js';
import { handlePrismaError } from '../../utils/handlePrismaError.js';

type UserWithCredential = Prisma.UserGetPayload<{ include: { credential: true } }>;

async function findUsers(): Promise<User[]> {
  return prisma.user.findMany();
}

async function findUserByLoginIdentifier(identifier: string): Promise<UserWithCredential | null> {
  const normalizedIdentifier = identifier.trim().toLowerCase();

  if (!normalizedIdentifier) {
    return null;
  }

  return prisma.user.findFirst({
    where: {
      OR: [{ email: normalizedIdentifier }, { username: normalizedIdentifier }],
    },
    include: { credential: true },
  });
}

async function findConflictingUser(
  username: string,
  email: string,
): Promise<UserWithCredential | null> {
  const normalizedUsername = username.trim().toLowerCase();
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedUsername || !normalizedEmail) {
    return null;
  }

  return prisma.user.findFirst({
    where: {
      OR: [{ username: normalizedUsername }, { email: normalizedEmail }],
    },
    include: { credential: true },
  });
}

async function findUserById(userId: string): Promise<User> {
  return handlePrismaError(prisma.user.findUniqueOrThrow({ where: { id: userId } }), {
    P2025: 'User does not exist',
  });
}

async function addUser(
  data: Pick<User, 'firstName' | 'lastName' | 'email' | 'username'>,
  passwordHash: string,
): Promise<User> {
  const newUser = await handlePrismaError(
    prisma.user.create({
      data: {
        ...data,
        email: data.email.trim().toLowerCase(),
        username: data.username.trim().toLowerCase(),
        credential: { create: { passwordHash } },
      },
    }),
    { P2002: 'User already exists' },
  );

  logger.info({ userId: newUser.id }, 'User was created');

  return newUser;
}

async function updateUser(userId: string, data: Partial<Omit<User, 'id'>>): Promise<User> {
  return handlePrismaError(prisma.user.update({ where: { id: userId }, data }), {
    P2025: 'User does not exist',
  });
}

async function deleteUser(userId: string): Promise<void> {
  await handlePrismaError(prisma.user.delete({ where: { id: userId } }), {
    P2025: 'User does not exist',
  });
}

async function updateCredential(userId: string, passwordHash: string): Promise<Credential> {
  return handlePrismaError(
    prisma.credential.update({
      where: { userId },
      data: { passwordHash },
    }),
    { P2025: 'Credential does not exist' },
  );
}

export default {
  findUsers,
  findUserByLoginIdentifier,
  findConflictingUser,
  findUserById,
  addUser,
  updateUser,
  deleteUser,
  updateCredential,
};
