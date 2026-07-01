import { User } from '../../generated/prisma/client.js';
import userRepository from './user.repository.js';

async function getUsers(): Promise<User[]> {
  return userRepository.findUsers();
}

async function getUserById(id: string): Promise<User> {
  return userRepository.findUserById(id);
}

async function updateUser(id: string, data: Partial<Omit<User, 'id'>>): Promise<User> {
  return userRepository.updateUser(id, data);
}
async function deleteUser(id: string): Promise<void> {
  await userRepository.deleteUser(id);
}

export default { getUserById, getUsers, deleteUser, updateUser };
