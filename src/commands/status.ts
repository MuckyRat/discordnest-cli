import { Command } from 'commander';
import ora from 'ora';
import { createApi } from '../lib/api.js';
import { config } from '../lib/config.js';
import { hr, ERR, BRAND, DIM, OK, WARN } from '../lib/format.js';

export const statusCommand = new Command('status')
  .description('Check DiscordNest API status and your auth state')
  .action(async () => {
    const api = createApi(false);
    const spinner = ora('Checking status…').start();

    const start = Date.now();
    let apiOk = false;
    let latencyMs = 0;
    let botCount = 0;

    try {
      const res = await api.get('/bots?limit=1&sort=top') as any;
      latencyMs = Date.now() - start;
      apiOk = true;
      botCount = res?.total ?? 0;
    } catch {
      latencyMs = Date.now() - start;
    }

    spinner.stop();

    console.log(`\n${BRAND('DiscordNest Status')}`);
    hr();
    console.log(`  ${'API'.padEnd(16)} ${apiOk ? OK('● online') : ERR('● offline')}  ${DIM(`${latencyMs}ms`)}`);
    if (apiOk && botCount) {
      console.log(`  ${'Bots indexed'.padEnd(16)} ${botCount.toLocaleString()}`);
    }
    hr();

    const apiKey = config.getApiKey();
    if (!apiKey) {
      console.log(`  ${'Auth'.padEnd(16)} ${WARN('not logged in')}`);
      console.log(DIM(`\n  Run: dn auth login <api-key>  to authenticate.\n`));
    } else {
      const authApi = createApi(true);
      try {
        const user = await authApi.get('/users/me') as any;
        console.log(`  ${'Auth'.padEnd(16)} ${OK('● logged in')}  ${DIM(`as ${user.username}`)}`);
        console.log(`  ${'Plan'.padEnd(16)} ${user.premiumTier ?? 'FREE'}`);
      } catch {
        console.log(`  ${'Auth'.padEnd(16)} ${ERR('● key invalid or expired')}`);
        console.log(DIM(`\n  Run: dn auth login <api-key>  to re-authenticate.\n`));
      }
    }
    console.log('');
  });
