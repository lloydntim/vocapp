import {
  resetPasswordTemplate,
  verifcationEmailTemplate,
  welcomeEmailTemplate,
} from './email.templates.js';
import type {
  EmailProvider,
  ResetPasswordEmailInput,
  verificationEmailInput,
  WelcomeEmailInput,
} from './email.types.js';

export default class EmailService {
  constructor(private readonly emailProvider: EmailProvider) {
    this.emailProvider = emailProvider;
  }

  async sendVerificationEmail({ to, verificationUrl }: verificationEmailInput) {
    await this.emailProvider.send(verifcationEmailTemplate(to, verificationUrl));
  }

  async sendWelcomeEmail(input: WelcomeEmailInput) {
    await this.emailProvider.send(welcomeEmailTemplate(input));
  }

  async sendResetPasswordEmail({ to, resetUrl }: ResetPasswordEmailInput) {
    await this.emailProvider.send(resetPasswordTemplate(to, resetUrl));
  }
}
