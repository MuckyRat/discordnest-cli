import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { config } from '../lib/config.js';
import { createApi } from '../lib/api.js';
import { OK, ERR, BRAND, DIM } from '../lib/format.js';

export const authCommand = new Command('auth')
  .description('Manage authentication with DiscordNest');

authCommand
  .command('login <api-key>')
  .description('Save your API key and verify it')
  .action(async (apiKey: string) => {
    config.setApiKey(apiKey);
    const spinner = ora('Verifying API key…').start();
    try {
      const api  = createApi(true);
      const user = await api.get('/users/me') as any;
      spinner.succeed(OK(`Logged in as ${chalk.bold(user.username)}`));
      console.log(DIM(`  Get your API key at https://discordnest.xyz/dashboard/settings`));
    } catch (e: any) {
      config.clearApiKey();
      spinner.fail(ERR(`Authentication failed: ${e.message}`));
      process.exit(1);
    }
  });

authCommand
  .command('logout')
  .description('Remove your saved API key')
  .action(() => {
    config.clearApiKey();
    console.log(chalk.yellow('✓ Logged out.'));
  });

authCommand
  .command('status')
  .description('Show whether you are currently authenticated')
  .action(async () => {
    const apiKey = config.getApiKey();
    if (!apiKey) {
      console.log(WARN('Not logged in.') + `  Run: ${BRAND('dn auth login <api-key>')}`);
      return;
    }
    const spinner = ora('Checking…').start();
    try {
      const api  = createApi(true);
      const user = await api.get('/users/me') as any;
      spinner.succeed(OK(`Authenticated as ${chalk.bold(user.username)}`));
    } catch {
      spinner.fail(ERR('API key is invalid or expired. Run: dn auth login <api-key>'));
    }
  });

function WARN(s: string) { return chalk.yellow(s); }
