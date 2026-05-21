import { Command } from 'commander';
import ora from 'ora';
import chalk from 'chalk';
import { createApi } from '../lib/api.js';
import { hr, label, votes, tag, ERR, BRAND, DIM } from '../lib/format.js';

function fmt(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

export const serverCommand = new Command('server')
  .description('Look up a server by its vanity name')
  .argument('<vanity>', 'Server vanity name')
  .action(async (vanity: string) => {
    const api     = createApi();
    const spinner = ora(`Fetching server "${vanity}"…`).start();

    try {
      const sv = await api.get(`/servers/${vanity}`) as any;
      spinner.stop();

      console.log(`\n${BRAND('🏠 ' + sv.name)} ${DIM(`@${sv.vanity}`)}`);
      hr();
      label('Description', sv.shortDesc);
      label('Tags',        sv.tags?.map(tag).join('  '));
      label('Members',     fmt(sv.memberCount ?? 0));
      label('Votes',       votes(sv.totalVotes ?? 0));
      label('Language',    sv.language);
      label('Owner',       sv.owner?.username);
      if (sv.inviteUrl) {
        hr();
        console.log(`  ${DIM('Join')}   ${chalk.cyan(sv.inviteUrl)}`);
      }
      hr();
      console.log(DIM(`  https://discordnest.xyz/servers/${sv.vanity}\n`));
    } catch (e: any) {
      spinner.fail(ERR(`Server not found: ${e.message}`));
      process.exit(1);
    }
  });
