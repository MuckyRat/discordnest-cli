import { Command } from 'commander';
import ora from 'ora';
import { createApi } from '../lib/api.js';
import { hr, ERR, BRAND, DIM, OK, WARN } from '../lib/format.js';

export const notifyCommand = new Command('notify')
  .description('View your notifications (requires authentication)')
  .option('--mark-read', 'Mark all notifications as read after viewing')
  .action(async (opts: { markRead?: boolean }) => {
    const api = createApi(true);
    const spinner = ora('Fetching notifications…').start();

    try {
      const data = await api.get('/notifications?limit=15') as any;
      spinner.stop();

      const items: any[] = data.items ?? [];
      const unread: number = data.unread ?? 0;

      if (!items.length) {
        console.log(DIM('\n  No notifications yet.\n'));
        return;
      }

      console.log(`\n${BRAND('Notifications')} ${unread > 0 ? WARN(`(${unread} unread)`) : DIM('(all read)')}`);
      hr();

      items.forEach((n: any) => {
        const dot = n.read ? DIM('○') : WARN('●');
        const date = new Date(n.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
        console.log(`  ${dot} ${n.title}  ${DIM(date)}`);
        if (n.body) console.log(DIM(`      ${n.body.slice(0, 100)}${n.body.length > 100 ? '…' : ''}`));
        if (n.link) console.log(DIM(`      https://discordnest.xyz${n.link}`));
        console.log('');
      });

      if (data.total > items.length) {
        console.log(DIM(`  …and ${data.total - items.length} more. Visit discordnest.xyz to see all.\n`));
      }

      if (opts.markRead && unread > 0) {
        await api.patch('/notifications/read-all');
        console.log(OK('  ✓ All notifications marked as read.\n'));
      } else if (unread > 0) {
        console.log(DIM('  Tip: run dn notify --mark-read to clear all.\n'));
      }
    } catch (e: any) {
      spinner.fail(ERR(`Failed: ${e.message}`));
      process.exit(1);
    }
  });
