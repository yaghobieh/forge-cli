import chalk from 'chalk';
import enquirer from 'enquirer';
const { prompt } = enquirer;
import { printSmallLogo, printSuccess } from '../ui/logo.js';
import { COLORS } from '../ui/colors.js';
import { generateSynapseNuclear } from '../templates/synapse.js';

interface NuclearOptions {
  path?: string;
}

export const nuclearCommand = async (
  sliceName?: string,
  options: NuclearOptions = {}
): Promise<void> => {
  printSmallLogo();

  const cwd = process.cwd();
  const pink = chalk.hex(COLORS.primary);

  // Get slice name if not provided
  let name: string;
  if (!sliceName) {
    const response = await prompt<{ name: string }>({
      type: 'input',
      name: 'name',
      message: pink('Synapse slice name (e.g., user, cart, auth):'),
      validate: (value: string) => {
        if (!value.trim()) return 'Slice name is required';
        if (!/^[a-z][a-zA-Z0-9]*$/.test(value)) return 'Use camelCase (e.g., userProfile)';
        return true;
      },
    });
    name = response.name;
  } else {
    name = sliceName;
  }

  await generateSynapseNuclear(cwd, name, options.path);

  console.log();
  printSuccess(`Synapse nuclear slice "${name}" created!`);
  console.log();
  console.log(chalk.hex(COLORS.muted)(`  Import it in your store:`));
  console.log();
  console.log(chalk.hex(COLORS.primary)(`  import { ${name}Actions, ${name}Selectors } from './nuclear/${name}';`));
  console.log();
};
