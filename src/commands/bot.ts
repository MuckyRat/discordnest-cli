import { Command } from 'commander';
import ora from 'ora';
import chalk from 'chalk';
import { createApi } from '../lib/api.js';
import { hr, label, votes, tag, ERR, BRAND, DIM } from '../lib/format.js';

export const botCommand = new Command('bot')
  .description('Look up a bot by its vanity name')
  .argument('<vanity>', 'Bot vanity name (e.g. mee6)')
  .action(async (vanity: string) => {
    const api     = createApi();
    const spinner = ora(`Fetching bot "${vanity}"…`).start();

    try {
      const bot = await api.get(`/bots/${vanity}`) as any;
      spinner.stop();

      console.log(`\n${BRAND('🤖 ' + bot.name)} ${DIM(`@${bot.vanity}`)}`);
      hr();
      label('Description', bot.shortDesc);
      label('Tags',        bot.tags?.map(tag).join('  '));
      label('Votes',       votes(bot.totalVotes ?? 0));
      label('Prefix',      bot.prefix);
      label('Status',      bot.status?.toLowerCase());
      label('Owner',       bot.owner?.username);
      if (bot.website)  label('Website', bot.website);
      if (bot.supportServer) label('Support', bot.supportServer);
      if (bot.inviteUrl) {
        hr();
        console.log(`  ${DIM('Invite')}  ${chalk.cyan(bot.inviteUrl)}`);
      }
      hr();
      console.log(DIM(`  https://discordnest.xyz/bots/${bot.vanity}\n`));
    } catch (e: any) {
      spinner.fail(ERR(`Bot not found: ${e.message}`));
      process.exit(1);
    }
  });
