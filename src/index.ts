import { Command } from 'commander';
import { createCommand } from './commands/create.js';
import { addCommand } from './commands/add.js';
import { nuclearCommand } from './commands/nuclear.js';

const program = new Command();

program
  .name('forge')
  .description('⚒️  Forge CLI - Create and manage ForgeStack projects')
  .version('1.2.0');

// Create command
program
  .command('create [project-name]')
  .description('Create a new ForgeStack project')
  .option('-t, --template <template>', 'Project template (react, server, fullstack)')
  .option('-p, --package-manager <pm>', 'Package manager (npm, pnpm, yarn, bun)')
  .option('-o, --out-dir <path>', 'Output directory (default: project name)')
  .option('-y, --yes', 'Skip prompts and use defaults')
  .action(createCommand);

// Add command
program
  .command('add [package]')
  .description('Add a ForgeStack package to your project')
  .option('-c, --color <hex>', 'Bear UI primary color (for bear package)')
  .option('-n, --nuclear <name>', 'Create nuclear slice (for synapse package)')
  .option('-s, --scope <scope>', 'Crucible testing scope (client, server, both)')
  .action(addCommand);

// Nuclear command (Synapse slice generator)
program
  .command('nuclear [slice-name]')
  .description('Generate a Synapse nuclear slice with types, actions, selectors')
  .option('-p, --path <path>', 'Base path for nuclear folder (default: src)')
  .action(nuclearCommand);

// Default: show help or run create
program
  .argument('[project-name]', 'Project name for quick create')
  .action((projectName?: string) => {
    if (projectName && !['create', 'add', 'nuclear'].includes(projectName)) {
      createCommand(projectName);
    } else if (!projectName) {
      program.help();
    }
  });

program.parse();
