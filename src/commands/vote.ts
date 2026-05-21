import { Command } from 'commander';
import ora from 'ora';
import { createApi } from '../lib/api.js';
import { OK, ERR, DIM, BRAND } from '../lib/format.js';

function formatCooldown(seconds: number): string {
  if (seconds < 60) return `${seconds} second${seconds !== 1 ? 's' : ''}`;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h === 0) return `${m} minute${m !== 1 ? 's' : ''}`;
  if (m === 0) return `${h} hour${h !== 1 ? 's' : ''}`;
  return `${h} hour${h !== 1 ? 's' : ''} and ${m} minute${m !== 1 ? 's' : ''}`;
}

export const voteCommand = new Command('vote')
  .description('Vote for a bot or server (requires authentication)')
  .argument('<vanity>', 'Bot or server vanity name')
  .option('-s, --server', 'Vote for a server instead of a bot')
  .action(async (vanity: string, opts: { server?: boolean }) => {
    const api = createApi(true);
    const kind = opts.server ? 'server' : 'bot';
    const spinner = ora(`Looking up ${kind} "${vanity}"…`).start();

    try {
      // Resolve vanity → id
      const listing = await api.get(`/${kind}s/${vanity}`) as any;
      const id: string = listing.id;

      spinner.text = `Casting vote for "${listing.name ?? vanity}"…`;

      const res = await api.post(`/votes/${kind}/${id}`) as any;

      spinner.succeed(OK(`Voted for ${BRAND(listing.name ?? vanity)}!`));
      if (res?.nextVoteAt) {
        const next = new Date(res.nextVoteAt);
        console.log(DIM(`  Next vote available: ${next.toLocaleString()}`));
      } else {
        console.log(DIM(`  Next vote available in 12 hours.`));
      }
      if (res?.totalVotes != null) console.log(DIM(`  Total votes: ${res.totalVotes}`));
    } catch (e: any) {
      if (e.secondsRemaining != null || e.message?.toLowerCase().includes('cooldown')) {
        const timeLeft = e.secondsRemaining ? formatCooldown(Math.ceil(e.secondsRemaining)) : '12 hours';
        spinner.fail(ERR(`You've already voted for this ${kind}.`) + `\n  Try again in ${timeLeft}.`);
      } else if (e.status === 404 || e.message?.toLowerCase().includes('not found')) {
        spinner.fail(ERR(`No ${kind} found with vanity "${vanity}".`));
      } else if (e.status === 401 || e.message?.toLowerCase().includes('auth')) {
        spinner.fail(ERR(`Not authenticated. Run: dn auth login <api-key>`));
      } else {
        spinner.fail(ERR(`Could not vote: ${e.message}`));
      }
      process.exit(1);
    }
  });
