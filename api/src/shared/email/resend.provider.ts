import { Resend } from 'resend';
import type { EmailProvider, SendEmailInput } from './email.types.js';

export class ResendEmailProvider implements EmailProvider {
  private readonly resend: Resend;

  constructor(
    apiKey: string,
    private readonly fromEmail: string,
  ) {
    this.resend = new Resend(apiKey);
  }

  async send(input: SendEmailInput): Promise<void> {
    await this.resend.emails.send({
      from: this.fromEmail,
      to: input.to,
      subject: input.subject,
      text: input.text,
      html: input.html,
    });
  }
}
