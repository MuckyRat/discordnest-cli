import { Command } from 'commander';
import ora from 'ora';
import { createApi } from '../lib/api.js';
import { OK, ERR, DIM } from '../lib/format.js';

export const voteCommand = new Command('vote')
  .description('Vote for a bot (requires authentication)')
  .argument('<vanity>', 'Bot vanity name')
  .action(async (vanity: string) => {
    const api     = createApi(true);
    const spinner = ora(`Voting for "${vanity}"…`).start();

    try {
      const res = await api.post(`/bots/${vanity}/vote`) as any;
      spinner.succeed(OK(`Voted for ${vanity}!`) + DIM(` Next vote in 12 hours.`));
      if (res?.totalVotes) console.log(DIM(`  Total votes: ${res.totalVotes}`));
    } catch (e: any) {
      spinner.fail(ERR(`Could not vote: ${e.message}`));
      process.exit(1);
    }
  });
