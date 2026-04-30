export function maskEmail(email: string | null | undefined): string | null {
  if (!email) return null;
  const at = email.indexOf('@');
  if (at <= 0) return '***';
  const local = email.slice(0, at);
  const domain = email.slice(at + 1);
  const visible = local.charAt(0);
  const stars = '*'.repeat(Math.max(local.length - 1, 2));
  return `${visible}${stars}@${domain}`;
}
