import { User } from '../../generated/prisma/client.js';

export type SendEmailInput = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

export type WelcomeEmailInput = Pick<User, 'firstName' | 'email'>;

export type verificationEmailInput = { verificationUrl: string; to: string };

export type ResetPasswordEmailInput = { resetUrl: string; to: string };

export interface EmailProvider {
  send(input: SendEmailInput): Promise<void>;
}
