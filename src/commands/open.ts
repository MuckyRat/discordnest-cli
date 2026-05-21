import { Command } from 'commander';
import { exec } from 'child_process';
import ora from 'ora';
import { createApi } from '../lib/api.js';
import { ERR, DIM, OK } from '../lib/format.js';

function openUrl(url: string): void {
  const cmd = process.platform === 'darwin' ? `open "${url}"`
    : process.platform === 'win32' ? `start "" "${url}"`
    : `xdg-open "${url}"`;
  exec(cmd);
}

export const openCommand = new Command('open')
  .description('Open a bot or server listing in your browser')
  .argument('<vanity>', 'Bot or server vanity name')
  .option('-s, --server', 'Open a server instead of a bot')
  .option('--changelog', 'Open the changelog page')
  .option('--invite', 'Open the invite link directly')
  .action(async (vanity: string, opts: { server?: boolean; changelog?: boolean; invite?: boolean }) => {
    const kind = opts.server ? 'server' : 'bot';

    if (opts.invite) {
      const api = createApi(false);
      const spinner = ora(`Looking up ${kind} "${vanity}"…`).start();
      try {
        const listing = await api.get(`/${kind}s/${vanity}`) as any;
        spinner.stop();
        const inviteUrl = listing.inviteUrl ?? listing.inviteLink ?? listing.invite;
        if (!inviteUrl) {
          console.log(ERR(`No invite link found for "${vanity}".`));
          process.exit(1);
        }
        console.log(OK(`Opening invite link for ${listing.name}…`));
        console.log(DIM(`  ${inviteUrl}`));
        openUrl(inviteUrl);
      } catch (e: any) {
        spinner.fail((e as any).status === 404 ? ERR(`${kind === 'bot' ? 'Bot' : 'Server'} "${vanity}" not found.`) : ERR(`Failed: ${e.message}`));
        process.exit(1);
      }
      return;
    }

    const path = opts.changelog
      ? `/${kind}s/${vanity}/changelog`
      : `/${kind}s/${vanity}`;
    const url = `https://discordnest.xyz${path}`;

    console.log(OK(`Opening ${url}…`));
    console.log(DIM(`  If your browser doesn't open, visit the URL above.`));
    openUrl(url);
  });
