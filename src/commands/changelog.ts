import { Command } from 'commander';
import ora from 'ora';
import { createApi } from '../lib/api.js';
import { hr, ERR, BRAND, DIM, WARN } from '../lib/format.js';

const TYPE_LABELS: Record<string, string> = {
  FEATURE:  'New Feature',
  FIX:      'Bug Fix',
  UPDATE:   'Update',
  SECURITY: 'Security',
  BREAKING: 'Breaking Change',
};

function typeColor(type: string): (s: string) => string {
  const chalk = { green: (s: string) => `\x1b[32m${s}\x1b[0m`, red: (s: string) => `\x1b[31m${s}\x1b[0m`, blue: (s: string) => `\x1b[34m${s}\x1b[0m`, yellow: (s: string) => `\x1b[33m${s}\x1b[0m` };
  switch (type) {
    case 'FEATURE':  return chalk.green;
    case 'FIX':      return chalk.red;
    case 'SECURITY': return chalk.yellow;
    case 'BREAKING': return chalk.red;
    default:         return chalk.blue;
  }
}

export const changelogCommand = new Command('changelog')
  .description('View recent changelogs for a bot or server');

changelogCommand
  .command('bot <vanity>')
  .description('View a bot\'s recent changelog entries')
  .option('-n, --limit <n>', 'Number of entries to show', '10')
  .action(async (vanity: string, opts: { limit: string }) => {
    const api = createApi(false);
    const spinner = ora(`Fetching changelog for bot "${vanity}"…`).start();
    try {
      const data = await api.get(`/changelogs/bot/${vanity}?limit=${opts.limit}`) as any;
      spinner.stop();
      const items = data.items ?? [];
      if (!items.length) { console.log(DIM('\n  No changelog entries yet.\n')); return; }

      console.log(`\n${BRAND(vanity + ' Changelog')} ${DIM(`(${data.total} total)`)}`);
      hr();
      items.forEach((entry: any) => {
        const label = TYPE_LABELS[entry.type] ?? entry.type;
        const color = typeColor(entry.type);
        const date = new Date(entry.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        console.log(`  ${color(`[${label}]`)}${entry.version ? DIM(` v${entry.version}`) : ''}  ${date}`);
        console.log(`  ${entry.title}`);
        if (entry.body) {
          const preview = entry.body.slice(0, 120);
          console.log(DIM(`  ${preview}${entry.body.length > 120 ? '…' : ''}`));
        }
        console.log('');
      });
      console.log(DIM(`  https://discordnest.xyz/bots/${vanity}/changelog\n`));
    } catch (e: any) {
      spinner.fail((e as any).status === 404 ? ERR(`Bot "${vanity}" not found.`) : ERR(`Failed: ${e.message}`));
      process.exit(1);
    }
  });

changelogCommand
  .command('server <vanity>')
  .description('View a server\'s recent changelog entries')
  .option('-n, --limit <n>', 'Number of entries to show', '10')
  .action(async (vanity: string, opts: { limit: string }) => {
    const api = createApi(false);
    const spinner = ora(`Fetching changelog for server "${vanity}"…`).start();
    try {
      const data = await api.get(`/changelogs/server/${vanity}?limit=${opts.limit}`) as any;
      spinner.stop();
      const items = data.items ?? [];
      if (!items.length) { console.log(DIM('\n  No changelog entries yet.\n')); return; }

      console.log(`\n${BRAND(vanity + ' Changelog')} ${DIM(`(${data.total} total)`)}`);
      hr();
      items.forEach((entry: any) => {
        const label = TYPE_LABELS[entry.type] ?? entry.type;
        const color = typeColor(entry.type);
        const date = new Date(entry.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        console.log(`  ${color(`[${label}]`)}${entry.version ? DIM(` v${entry.version}`) : ''}  ${date}`);
        console.log(`  ${entry.title}`);
        if (entry.body) {
          const preview = entry.body.slice(0, 120);
          console.log(DIM(`  ${preview}${entry.body.length > 120 ? '…' : ''}`));
        }
        console.log('');
      });
      console.log(DIM(`  https://discordnest.xyz/servers/${vanity}/changelog\n`));
    } catch (e: any) {
      spinner.fail((e as any).status === 404 ? ERR(`Server "${vanity}" not found.`) : ERR(`Failed: ${e.message}`));
      process.exit(1);
    }
  });
