import { Command } from 'commander';
import ora from 'ora';
import chalk from 'chalk';
import { createApi } from '../lib/api.js';
import { hr, listingRow, ERR, BRAND, DIM } from '../lib/format.js';

export const searchCommand = new Command('search')
  .description('Search for bots and servers on DiscordNest')
  .argument('<query>', 'Search term')
  .option('-b, --bots',    'Search bots only')
  .option('-s, --servers', 'Search servers only')
  .option('-n, --limit <n>', 'Max results per type', '5')
  .action(async (query: string, opts: { bots?: boolean; servers?: boolean; limit: string }) => {
    const api     = createApi();
    const limit   = parseInt(opts.limit, 10) || 5;
    const botsOnly    = opts.bots && !opts.servers;
    const serversOnly = opts.servers && !opts.bots;
    const spinner = ora(`Searching for "${query}"…`).start();

    try {
      const [botsRes, serversRes] = await Promise.allSettled([
        botsOnly || !serversOnly
          ? api.get(`/bots?q=${encodeURIComponent(query)}&limit=${limit}`) as Promise<any>
          : Promise.resolve(null),
        serversOnly || !botsOnly
          ? api.get(`/servers?q=${encodeURIComponent(query)}&limit=${limit}`) as Promise<any>
          : Promise.resolve(null),
      ]);

      spinner.stop();

      const bots    = botsRes.status    === 'fulfilled' ? (botsRes.value?.items    ?? []) : [];
      const servers = serversRes.status === 'fulfilled' ? (serversRes.value?.items ?? []) : [];

      if (bots.length === 0 && servers.length === 0) {
        console.log(chalk.yellow(`No results found for "${query}"`));
        return;
      }

      if (bots.length > 0) {
        console.log(`\n${BRAND('Bots')} ${DIM(`(${bots.length} result${bots.length !== 1 ? 's' : ''})`)}`);
        hr();
        bots.forEach((b: any, i: number) => listingRow(i + 1, b.name, b.tags ?? [], b.totalVotes ?? 0));
        console.log(DIM(`\n  View more: https://discordnest.xyz/bots?q=${encodeURIComponent(query)}`));
      }

      if (servers.length > 0) {
        console.log(`\n${BRAND('Servers')} ${DIM(`(${servers.length} result${servers.length !== 1 ? 's' : ''})`)}`);
        hr();
        servers.forEach((s: any, i: number) => listingRow(i + 1, s.name, s.tags ?? [], s.totalVotes ?? 0));
        console.log(DIM(`\n  View more: https://discordnest.xyz/servers?q=${encodeURIComponent(query)}`));
      }

      console.log('');
    } catch (e: any) {
      spinner.fail(ERR(`Search failed: ${e.message}`));
      process.exit(1);
    }
  });
