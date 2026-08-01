import env from '../../config/env.js';
import EmailService from './email.service.js';
import type { EmailProvider } from './email.types.js';
import { NodeMailerProvider } from './nodemailer.provider.js';
import { ResendEmailProvider } from './resend.provider.js';

function createEmailProvider(): EmailProvider {
  if (env.NODE_ENV === 'production') {
    if (!env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY must be set when NODE_ENV=production');
    }
    return new ResendEmailProvider(env.RESEND_API_KEY, env.EMAIL_FROM);
  }

  return new NodeMailerProvider();
}

export default new EmailService(createEmailProvider());
