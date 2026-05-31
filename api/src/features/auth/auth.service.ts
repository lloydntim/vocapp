import { hash, verify } from 'argon2';
import logger from '../../config/logger.js';
import { BadRequestError } from '../../errors/BadRequestError.js';
import { ConflictError } from '../../errors/ConflictError.js';
import { UnauthorizedError } from '../../errors/UnauthorizedError.js';
import type { UserInput as RegisterInput } from '../users/user.types.js';
import userRepository from './../users/user.repository.js';
import { TOKEN_PURPOSES, type ForgotPasswordInput, type LoginInput } from './auth.types.js';
import tokenRepository from './token.repository.js';
import tokenService from './token.service.js';

export async function registerUser(input: RegisterInput) {
  const { username, email, password } = input;
  const hashedPassword = await hash(password);

  const existingUser = userRepository.findUser({ username });

  if (existingUser) {
    logger.warn({ username, email }, 'Username or email exists already');
    throw new ConflictError('Username or email exists already');
  }

  const newUser = userRepository.addUser({ ...input, password: hashedPassword });

  const rawVerifyUserToken = tokenService.generateRandomToken();
  const hashedVerifyToken = tokenService.hashRandomToken(rawVerifyUserToken);

  tokenRepository.addToken({
    id: '01',
    user_id: newUser.id,
    token_hash: hashedVerifyToken,
    purpose: TOKEN_PURPOSES.VERIFY_ACCOUNT,
    expires_at: new Date(Date.now() + 15 * 60 * 1000),
  });

  logger.info({ userId: newUser.id }, 'User was created');
  const { password: _password, refresh_token: _refreshToken, ...userData } = newUser;

  //  //mailer.sendMail(user.email, 'accound has been created sucessfully please verify https://wwww.vocapp.com/verify/${randomToken}')

  return {
    userData,
  };
}

export async function loginUser({ username, password }: LoginInput) {
  const existingUser = userRepository.findUser({ username });

  if (!existingUser?.password) {
    logger.warn({ username }, 'Invalid login attempt');
    throw new UnauthorizedError('Wrong username or password, please try again');
  }

  const matched = await verify(existingUser.password, password);

  if (!matched) {
    logger.warn({ username }, 'Invalid login attempt');
    throw new UnauthorizedError('Wrong username or password, please try again');
  }

  const accessToken = tokenService.generateAccessToken(existingUser);
  const refreshToken = tokenService.generateRefreshToken(existingUser);

  const { password: _password, refresh_token: _refreshToken, ...userData } = existingUser;

  existingUser.refresh_token = await hash(refreshToken);

  logger.info({ userId: existingUser.id }, 'User logged in');

  return {
    userData,
    accessToken,
    refreshToken,
  };
}

export function logoutUser(refreshToken: string) {
  const decoded = tokenService.verifyRefreshToken(refreshToken);

  if (!decoded?.sub) {
    throw new UnauthorizedError('Invalid Token');
  }

  // 2. Remove refresh token from database
  userRepository.updateUser(decoded.sub, { refresh_token: '' });
}

export async function rotateRefreshToken(refreshToken: string) {
  // verify refresh token with jwt
  const decoded = tokenService.verifyRefreshToken(refreshToken);

  // find user using repo
  const user = userRepository.findUserById(decoded.sub);

  if (!user?.refresh_token) {
    throw new UnauthorizedError('Invalid refresh token');
  }

  // compare refresh token using password service
  const isValid = await verify(refreshToken, user.refresh_token);

  if (!isValid) {
    user.refresh_token = '';
    logger.warn(
      { userId: user.id, username: user.username },
      'Refresh token reuse detected — possible token theft',
    );

    throw new UnauthorizedError('Token reuse detected');
  }

  // discard and replace with new acess and refresh token
  const newAccessToken = tokenService.generateAccessToken(user);
  const newRefreshToken = tokenService.generateRefreshToken(user);

  user.refresh_token = await hash(newRefreshToken);

  return {
    newAccessToken,
    newRefreshToken,
  };
}

export function requestPasswordReset({ email }: ForgotPasswordInput) {
  const user = userRepository.findUser({ email });

  if (!user) {
    logger.warn({ email }, 'User could not be found');
    throw new BadRequestError('Reset token is invalid or expired');
  }

  // create access token
  const rawResetToken = tokenService.generateRandomToken();
  const hashedResetToken = tokenService.hashRandomToken(rawResetToken);

  // will be start in database to
  tokenRepository.addToken({
    id: '01',
    user_id: user.id,
    token_hash: hashedResetToken,
    purpose: TOKEN_PURPOSES.RESET_PASSWORD,
    expires_at: new Date(Date.now() + 15 * 60 * 1000),
  });

  // send email to user
  // mailer.sendMail(user.email, forgotPasswordEmailtText)
  // Mail: `got to this link https://www.vocapp.com/res-et?token=rawResetToken link to reset passowrd`
  // stop requestPasswordReset
  return {
    rawResetToken,
  };
}

export async function resetUserPassword({ token, password }: { token: string; password: string }) {
  const hashedToken = tokenService.hashRandomToken(token);
  // Find valid token
  const validToken = tokenRepository.findValidToken(hashedToken);

  if (validToken.expires_at < new Date()) {
    throw new BadRequestError('Reset token is invalid or expired');
  }
  // check whether user exists

  const user = userRepository.findUserById(validToken.user_id);

  if (!user) {
    logger.warn({ userId: validToken.user_id }, 'User could not be found');
    throw new UnauthorizedError('Password could not be created');
  }

  // update new password
  // const refreshToken = tokenService.generateRefreshToken(user);
  const hashedPassword = await hash(password);

  user.password = hashedPassword;
  // user.refresh_token = await hash(refreshToken);

  const { password: _password, /* refresh_token: _refreshToken, */ ...userData } = user;

  // send email
  //mailer.sendMail(user.email, 'your pasword has been updated sucessfully')

  return userData;
}

export async function verifyUser(token: string) {
  const hashedToken = tokenService.hashRandomToken(token);
  // get user id from valid token
  const validToken = tokenRepository.findValidToken(hashedToken);

  if (validToken.expires_at < new Date()) {
    throw new BadRequestError('Reset token is invalid or expired');
  }

  // get user by using user id
  const user = userRepository.findUserById(validToken.user_id);

  // check whether user exists
  if (!user) {
    logger.warn({ userId: validToken.user_id }, 'User could not be found');
    throw new UnauthorizedError('User could not be verified');
  }
  // if user is  isVerified throw an error
  if (user.is_verified) {
    throw new BadRequestError('User already verified');
  }

  const newAccessToken = tokenService.generateAccessToken(user);
  const newRefreshToken = tokenService.generateRefreshToken(user);

  const hashedRefreshToken = await hash(newRefreshToken);

  userRepository.updateUser(user.id, { is_verified: true, refresh_token: hashedRefreshToken });

  // setUp res.cookie refreshToken

  return {
    newAccessToken,
    newRefreshToken,
  };
  //mailer.sendMail(user.email, 'You have been verified')
}
