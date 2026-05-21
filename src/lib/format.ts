import chalk from 'chalk';

export const BRAND = chalk.hex('#7C3AED');
export const DIM   = chalk.gray;
export const OK    = chalk.green;
export const WARN  = chalk.yellow;
export const ERR   = chalk.red;

export function hr(): void {
  console.log(DIM('─'.repeat(52)));
}

export function label(key: string, value: string | number | undefined | null): void {
  if (value == null || value === '') return;
  const k = chalk.gray(key.padEnd(14));
  console.log(`  ${k} ${value}`);
}

export function votes(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

export function tag(t: string): string {
  return BRAND(`[${t}]`);
}

export function badge(status: string): string {
  switch (status) {
    case 'APPROVED': return OK('● approved');
    case 'PENDING':  return WARN('● pending');
    case 'DENIED':   return ERR('● denied');
    default:         return DIM(`● ${status.toLowerCase()}`);
  }
}

export function listingRow(i: number, name: string, tags: string[], totalVotes: number): void {
  const num     = DIM(`${String(i).padStart(2)}.`);
  const nameStr = chalk.white(name.padEnd(20).slice(0, 20));
  const tagStr  = DIM(tags.slice(0, 3).join(' · ').padEnd(30).slice(0, 30));
  const voteStr = BRAND(`${votes(totalVotes)} votes`);
  console.log(`  ${num} ${nameStr} ${tagStr} ${voteStr}`);
}
