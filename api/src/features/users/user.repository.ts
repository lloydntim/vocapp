import logger from '../../config/logger.js';
import type User from '../../shared/types/user.types.js';

export const mockUsers: User[] = [
  {
    id: '01',
    first_name: 'John',
    last_name: 'Doe',
    email: 'jdoe@mail.com',
    username: 'jdoe',
    password: 'secret',
    is_verified: true,
    role: 'admin',
  },
  {
    id: '02',
    first_name: 'Joe',
    last_name: 'Bloggs',
    email: 'jbloggs@mail.com',
    username: 'jbloggs',
    password: 'secret1',
    is_verified: false,
    role: 'user',
  },
];

function getUsers(): User[] {
  return mockUsers;
}

function findUser({
  username = '',
  email = '',
}: Pick<User, 'username' | 'email'>): User | undefined {
  if (!username) {
    throw Error('Username required');
  }
  return mockUsers.find((user) => user.username === username || user.email === email);
}

function findUserById(id = ''): User {
  if (!id) {
    throw Error('id required');
  }
  const user = mockUsers.find((user) => user.id === id);

  if (!user) {
    throw Error('User does not exist');
  }

  const { password: _password, ...userData } = user;

  return userData;
}

function addUser(user: Omit<User, 'id'>): User {
  const existingUser = findUser({ username: user.username ?? '' });

  if (existingUser) {
    throw Error('User could not be added');
  }

  const newUser = { ...user, id: Date.now().toString(), role: 'user' as const };

  mockUsers.push(newUser);

  logger.info({ userId: newUser.id }, 'User was created');

  return newUser;
}

function updateUser(id: string, props: Partial<Omit<User, 'id'>>) {
  const user = findUserById(id);

  if (user) {
    const userItemIndex = mockUsers.findIndex((user) => user.id === id);
    mockUsers[userItemIndex] = { ...mockUsers[userItemIndex], ...props } as User;
  }

  return user;
}

export default { getUsers, findUser, findUserById, addUser, updateUser };
