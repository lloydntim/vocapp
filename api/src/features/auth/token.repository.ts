import logger from '../../config/logger.js';
import { BadRequestError } from '../../errors/BadRequestError.js';
import { NotFoundError } from '../../errors/NotFoundError.js';
import { TOKEN_PURPOSES, type Token, type TokenPurpose } from '../auth/auth.types.js';

const mockTokens = [
  {
    id: '01',
    user_id: '12',
    token_hash: '23093',
    purpose: TOKEN_PURPOSES.RESET_PASSWORD as TokenPurpose,
    expires_at: new Date('2099-01-01'),
  },
  {
    id: '02',
    user_id: '13',
    token_hash: '39485',
    purpose: TOKEN_PURPOSES.RESET_PASSWORD as TokenPurpose,
    expires_at: new Date(Date.now() + 15 * 60 * 1000),
  },
];

function findTokenByUserId(userId: string): Token | undefined {
  const existingToken = mockTokens.find(({ user_id }) => user_id === userId);

  // if (!existingToken) {
  //   throw new NotFoundError('Token cannot be found');
  // }

  return existingToken;
}

function findValidToken(hashedToken: string): Token {
  const validToken = mockTokens.find(({ token_hash }) => token_hash === hashedToken);

  if (!validToken) {
    throw new NotFoundError('Token cannot be found');
  }

  return validToken;
}

function addToken(token: Token): Token {
  const existingToken = findTokenByUserId(token.user_id);

  if (existingToken) {
    throw new BadRequestError('User could not be added');
  }

  const newToken = { ...token, id: Date.now().toString() };

  mockTokens.push(newToken);

  logger.info({ tokenId: token.id }, 'Token was created');

  return newToken;
}

export default { addToken, findTokenByUserId, findValidToken };
