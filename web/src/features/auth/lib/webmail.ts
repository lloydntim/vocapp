const WEBMAIL_INBOX_URLS: Record<string, string> = {
  'gmail.com': 'https://mail.google.com/mail/u/0/#inbox',
  'googlemail.com': 'https://mail.google.com/mail/u/0/#inbox',
  'outlook.com': 'https://outlook.live.com/mail/0/inbox',
  'hotmail.com': 'https://outlook.live.com/mail/0/inbox',
  'live.com': 'https://outlook.live.com/mail/0/inbox',
  'msn.com': 'https://outlook.live.com/mail/0/inbox',
  'yahoo.com': 'https://mail.yahoo.com',
  'icloud.com': 'https://www.icloud.com/mail',
  'me.com': 'https://www.icloud.com/mail',
  'aol.com': 'https://mail.aol.com',
};

function getWebmailInboxUrl(email: string): string | null {
  const domain = email.split('@')[1]?.toLowerCase();
  return (domain && WEBMAIL_INBOX_URLS[domain]) || null;
}

export function getOpenEmailAppUrl(email?: string | null): string {
  if (!email) return 'mailto:';
  return getWebmailInboxUrl(email) ?? `mailto:${email}`;
}
