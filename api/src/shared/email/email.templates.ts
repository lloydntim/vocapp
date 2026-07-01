import { User } from '../../generated/prisma/client.js';

export function verifcationEmailTemplate(to: string, verificationUrl: string) {
  return {
    to,
    subject: 'Verify the email',
    html: `
      <h1>Verify your email address</h1>
      <p>Please click the link below:</p>
      <a href="${verificationUrl}">Verify email</a>
    `,

    text: `Verify your email address: ${to}`,
  };
}
export function resetPasswordTemplate(to: string, resetUrl: string) {
  return {
    to,
    subject: 'Reset password',
    html: `
      <h1>Reset your password</h1>
      <p>Please click the link below:</p>
      <a href="${resetUrl}">Reset password</a>
    `,

    text: `Reset your password: ${resetUrl}`,
  };
}

export function welcomeEmailTemplate(user: Pick<User, 'firstName' | 'email'>) {
  return {
    to: user.email,
    subject: `Welcome ${user.firstName}!`,
    html: `
      <h1>Welcome onboard user.firstName/h1>
    `,

    text: `Welcome onbaord: ${user.firstName}`,
  };
}
