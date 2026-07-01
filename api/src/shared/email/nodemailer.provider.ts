import nodemailer from 'nodemailer';
import env from '../../config/env.js';
import type { EmailProvider, SendEmailInput } from './email.types.js';

export class NodeMailerProvider implements EmailProvider {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: Number(env.SMTP_PORT ?? 587),
      secure: env.SMTP_SECURE === 'true',
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });
  }

  async send(input: SendEmailInput): Promise<void> {
    await this.transporter.sendMail({
      ...input,
      from: env.EMAIL_FROM,
    });
  }
}
