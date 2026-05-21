import { Command } from 'commander';
import chalk from 'chalk';
import { authCommand }   from './commands/auth.js';
import { searchCommand } from './commands/search.js';
import { botCommand }    from './commands/bot.js';
import { serverCommand } from './commands/server.js';
import { voteCommand }   from './commands/vote.js';
import { myCommand }     from './commands/my.js';

const program = new Command();

program
  .name('dn')
  .description(
    chalk.hex('#7C3AED').bold('DiscordNest CLI') +
    chalk.gray(' — search bots, servers, vote and manage your listings'),
  )
  .version('1.0.0', '-v, --version');

program.addCommand(authCommand);
program.addCommand(searchCommand);
program.addCommand(botCommand);
program.addCommand(serverCommand);
program.addCommand(voteCommand);
program.addCommand(myCommand);

program.parse();
