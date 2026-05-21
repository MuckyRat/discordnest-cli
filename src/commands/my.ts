import { Command } from 'commander';
import ora from 'ora';
import { createApi } from '../lib/api.js';
import { hr, listingRow, badge, votes, ERR, BRAND, DIM, WARN, OK } from '../lib/format.js';

export const myCommand = new Command('my')
  .description('View and manage your own listings (requires authentication)');

myCommand
  .command('bots')
  .description('List your submitted bots')
  .action(async () => {
    const api     = createApi(true);
    const spinner = ora('Fetching your bots…').start();

    try {
      const bots = await api.get('/users/me/bots') as any[];
      spinner.stop();

      if (!bots?.length) {
        console.log(DIM('\n  No bots found. Submit one at https://discordnest.xyz/bots/submit\n'));
        return;
      }

      console.log(`\n${BRAND('Your Bots')} ${DIM(`(${bots.length})`)}`);
      hr();
      bots.forEach((b: any, i: number) => {
        listingRow(i + 1, b.name, b.tags ?? [], b.totalVotes ?? 0);
        console.log(`     ${badge(b.status)}  ${DIM(`https://discordnest.xyz/bots/${b.vanity}`)}`);
      });
      console.log('');
    } catch (e: any) {
      spinner.fail(ERR(`Failed: ${e.message}`));
      process.exit(1);
    }
  });

myCommand
  .command('servers')
  .description('List your submitted servers')
  .action(async () => {
    const api     = createApi(true);
    const spinner = ora('Fetching your servers…').start();

    try {
      const servers = await api.get('/users/me/servers') as any[];
      spinner.stop();

      if (!servers?.length) {
        console.log(DIM('\n  No servers found. Submit one at https://discordnest.xyz/servers/submit\n'));
        return;
      }

      console.log(`\n${BRAND('Your Servers')} ${DIM(`(${servers.length})`)}`);
      hr();
      servers.forEach((s: any, i: number) => {
        listingRow(i + 1, s.name, s.tags ?? [], s.totalVotes ?? 0);
        console.log(`     ${badge(s.status)}  ${DIM(`https://discordnest.xyz/servers/${s.vanity}`)}`);
      });
      console.log('');
    } catch (e: any) {
      spinner.fail(ERR(`Failed: ${e.message}`));
      process.exit(1);
    }
  });

myCommand
  .command('votes')
  .description('Show your recent vote history')
  .action(async () => {
    const api     = createApi(true);
    const spinner = ora('Fetching your vote history…').start();

    try {
      const voteList = await api.get('/users/me/votes') as any[];
      spinner.stop();

      if (!voteList?.length) {
        console.log(DIM('\n  No votes yet. Try: dn vote <vanity>\n'));
        return;
      }

      console.log(`\n${BRAND('Your Recent Votes')} ${DIM(`(${voteList.length})`)}`);
      hr();
      voteList.slice(0, 20).forEach((v: any) => {
        const listing = v.bot ?? v.server;
        const kind    = v.bot ? 'bot' : 'server';
        const name    = listing?.name ?? 'Unknown';
        const date    = new Date(v.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        const path    = v.bot ? `bots/${listing?.vanity}` : `servers/${listing?.vanity}`;
        console.log(`  ${name.padEnd(22).slice(0, 22)} ${DIM(kind.padEnd(7))} ${DIM(date)}`);
        if (listing?.vanity) console.log(DIM(`     https://discordnest.xyz/${path}`));
      });
      if (voteList.length > 20) console.log(DIM(`\n  …and ${voteList.length - 20} older votes.`));
      console.log('');
    } catch (e: any) {
      spinner.fail(ERR(`Failed: ${e.message}`));
      process.exit(1);
    }
  });

myCommand
  .command('stats')
  .description('Show your overall profile stats')
  .action(async () => {
    const api     = createApi(true);
    const spinner = ora('Fetching your stats…').start();

    try {
      const [user, bots, servers] = await Promise.all([
        api.get('/users/me') as Promise<any>,
        api.get('/users/me/bots').catch(() => []) as Promise<any[]>,
        api.get('/users/me/servers').catch(() => []) as Promise<any[]>,
      ]);
      spinner.stop();

      const totalVotes = [
        ...(Array.isArray(bots) ? bots : []),
        ...(Array.isArray(servers) ? servers : []),
      ].reduce((sum: number, l: any) => sum + (l.totalVotes ?? 0), 0);

      console.log(`\n${BRAND(user.username ?? 'Your Stats')}`);
      hr();
      console.log(`  ${'Bots'.padEnd(14)} ${Array.isArray(bots)    ? bots.length    : 0}`);
      console.log(`  ${'Servers'.padEnd(14)} ${Array.isArray(servers) ? servers.length : 0}`);
      console.log(`  ${'Total votes'.padEnd(14)} ${totalVotes}`);
      hr();
      console.log(DIM(`  https://discordnest.xyz/profile/${user.username}\n`));
    } catch (e: any) {
      spinner.fail(ERR(`Failed: ${e.message}`));
      process.exit(1);
    }
  });
