import type { JwtPayload } from 'jsonwebtoken';
import type { UserRole } from '../../generated/prisma/client.js';
import type { CreateUserInput } from '../users/user.schema.js';

export interface AuthenticatedUser extends JwtPayload {
  email: string;
  role: UserRole;
}

export type TokenPurpose = 'reset_password' | 'verify_account';
export type TokenPurposeKey = 'RESET_PASSWORD' | 'VERIFY_ACCOUNT';

export const TOKEN_PURPOSES = {
  RESET_PASSWORD: 'reset_password',
  VERIFY_ACCOUNT: 'verify_account',
} as const satisfies Record<TokenPurposeKey, TokenPurpose>;

export interface Token {
  id: string;
  user_id: string;
  token_hash: string;
  expires_at: Date;
  purpose: TokenPurpose;
}

export type LoginInput = Required<Pick<CreateUserInput, 'username' | 'password'>>;
export type ForgotPasswordInput = Required<Pick<CreateUserInput, 'email'>>;
