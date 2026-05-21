import { Command } from 'commander';
import ora from 'ora';
import { createApi } from '../lib/api.js';
import { hr, label, votes, tag, ERR, BRAND, DIM, OK } from '../lib/format.js';

const TIER_LABELS: Record<string, string> = {
  FREE: 'Free',
  NEST_EGG: 'Nest Egg',
  NEST_BUILDER: 'Nest Builder',
  NEST_MASTER: 'Nest Master',
};

export const profileCommand = new Command('profile')
  .description('View a user\'s public profile')
  .argument('<username>', 'DiscordNest username')
  .action(async (username: string) => {
    const api = createApi(false);
    const spinner = ora(`Looking up "${username}"…`).start();

    try {
      const user = await api.get(`/users/${username}`) as any;
      spinner.stop();

      const tier = TIER_LABELS[user.premiumTier] ?? user.premiumTier ?? 'Free';
      const totalVotes = [
        ...(user.bots ?? []),
        ...(user.servers ?? []),
      ].reduce((sum: number, l: any) => sum + (l.totalVotes ?? 0), 0);

      console.log(`\n${BRAND(user.username)}`);
      if (user.bio) console.log(DIM(`  ${user.bio.slice(0, 120)}${user.bio.length > 120 ? '…' : ''}`));
      hr();
      label('Plan', tier !== 'Free' ? OK(tier) : DIM(tier));
      label('Level', user.level ?? 0);
      label('XP', user.xp ?? 0);
      label('Vote streak', user.voteStreak ? `🔥 ${user.voteStreak} days` : null);
      label('Total votes', votes(totalVotes));
      label('Joined', user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : null);
      hr();

      if (user.bots?.length) {
        console.log(`  ${BRAND('Bots')} ${DIM(`(${user.bots.length})`)}`);
        user.bots.slice(0, 5).forEach((b: any) => {
          console.log(`    ${b.name.padEnd(20).slice(0, 20)} ${DIM(`${votes(b.totalVotes ?? 0)} votes`)}  ${DIM(`discordnest.xyz/bots/${b.vanity}`)}`);
        });
        if (user.bots.length > 5) console.log(DIM(`    …and ${user.bots.length - 5} more`));
      }

      if (user.servers?.length) {
        console.log(`\n  ${BRAND('Servers')} ${DIM(`(${user.servers.length})`)}`);
        user.servers.slice(0, 5).forEach((s: any) => {
          console.log(`    ${s.name.padEnd(20).slice(0, 20)} ${DIM(`${votes(s.totalVotes ?? 0)} votes`)}  ${DIM(`discordnest.xyz/servers/${s.vanity}`)}`);
        });
        if (user.servers.length > 5) console.log(DIM(`    …and ${user.servers.length - 5} more`));
      }

      hr();
      console.log(DIM(`  https://discordnest.xyz/profile/${user.username}\n`));
    } catch (e: any) {
      spinner.fail((e as any).status === 404 ? ERR(`User "${username}" not found.`) : ERR(`Failed: ${e.message}`));
      process.exit(1);
    }
  });
