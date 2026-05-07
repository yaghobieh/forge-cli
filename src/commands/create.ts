import path from 'path';
import chalk from 'chalk';
import {
  promptProjectName,
  promptProjectType,
  promptStateManager,
  promptRouter,
  promptCssFramework,
  promptApiClient,
  promptServerFramework,
  promptForgePackages,
  promptPackageManager,
  promptBearColor,
  promptInstallDependencies,
  promptIncludeDocker,
  promptIncludeBackend,
  promptConfirm,
  promptOutputPath,
  type ProjectConfig,
  type ProjectType,
} from '../ui/prompts.js';
import { printWelcome, printSuccess, printGradient } from '../ui/logo.js';
import { createSpinner, spinnerSuccess, spinnerError } from '../ui/spinner.js';
import { COLORS } from '../ui/colors.js';
import {
  ensureDir,
  pathExists,
  installDependencies,
  addPackages,
} from '../utils/index.js';
import { generateReactTemplate } from '../templates/react.js';
import { generateServerTemplate } from '../templates/server.js';
import { generateFullStackTemplate } from '../templates/fullstack.js';

const VERSION = '1.2.0';

interface CreateOptions {
  template?: ProjectType;
  packageManager?: string;
  yes?: boolean;
  outDir?: string;
}

export const createCommand = async (
  projectName?: string,
  options: CreateOptions = {}
): Promise<void> => {
  printWelcome(VERSION);

  // Get project configuration
  const name = projectName || await promptProjectName();
  
  // Determine output directory
  let projectDir: string;
  if (options.outDir) {
    projectDir = path.resolve(process.cwd(), options.outDir);
  } else if (options.yes) {
    projectDir = path.resolve(process.cwd(), name);
  } else {
    const outputPath = await promptOutputPath(name);
    projectDir = path.resolve(process.cwd(), outputPath);
  }

  // Check if directory exists
  if (await pathExists(projectDir)) {
    const overwrite = await promptConfirm(`Directory "${name}" already exists. Overwrite?`);
    if (!overwrite) {
      console.log(chalk.hex(COLORS.muted)('\n  Cancelled.\n'));
      process.exit(0);
    }
  }

  // Quick mode with --yes flag
  let config: ProjectConfig;
  
  if (options.yes) {
    config = {
      name,
      type: (options.template as ProjectType) || 'react',
      stateManager: 'synapse',
      router: 'compass',
      cssFramework: 'aerocraft',
      apiClient: 'forge-query',
      serverFramework: 'harbor',
      includeBackend: true,
      includeBear: true,
      includeGridTable: true,
      includeForgeQuery: true,
      includeForgeForm: true,
      includeRelay: true,
      includeCrucible: true,
      includeAuth: true,
      includeLingo: true,
      includeRail: true,
      includeTorch: true,
      includeKiln: true,
      packageManager: (options.packageManager as ProjectConfig['packageManager']) || 'npm',
      typescript: true,
      installDependencies: true,
      includeDocker: true,
    };
  } else {
    const type = (options.template as ProjectType) || await promptProjectType();
    
    let stateManager: ProjectConfig['stateManager'] = 'none';
    let router: ProjectConfig['router'] = 'none';
    let cssFramework: ProjectConfig['cssFramework'] = 'none';
    let apiClient: ProjectConfig['apiClient'] = 'fetch';
    let serverFramework: ProjectConfig['serverFramework'] = 'express';
    let packages = { bear: false, gridTable: false, forgeQuery: false, forgeForm: false, relay: false, crucible: false, auth: false, lingo: false, rail: false, torch: false, kiln: false };
    let bearColor: string | undefined;
    
    let includeBackend = false;

    if (type === 'server') {
      serverFramework = await promptServerFramework();
    } else if (type === 'fullstack') {
      stateManager = await promptStateManager();
      router = await promptRouter();
      cssFramework = await promptCssFramework();
      apiClient = await promptApiClient();
      packages = await promptForgePackages();
      if (packages.bear) {
        bearColor = await promptBearColor();
      }
      serverFramework = await promptServerFramework();
      includeBackend = true;
    } else {
      stateManager = await promptStateManager();
      router = await promptRouter();
      cssFramework = await promptCssFramework();
      apiClient = await promptApiClient();
      packages = await promptForgePackages();
      if (packages.bear) {
        bearColor = await promptBearColor();
      }
      includeBackend = await promptIncludeBackend();
      if (includeBackend) {
        serverFramework = await promptServerFramework();
      }
    }
    
    const packageManager = await promptPackageManager();
    const includeDocker = await promptIncludeDocker();
    const shouldInstall = await promptInstallDependencies();

    config = {
      name,
      type,
      stateManager,
      router,
      cssFramework,
      apiClient,
      serverFramework,
      includeBackend,
      includeBear: packages.bear,
      includeGridTable: packages.gridTable,
      includeForgeQuery: packages.forgeQuery,
      includeForgeForm: packages.forgeForm,
      includeRelay: packages.relay,
      includeCrucible: packages.crucible,
      includeAuth: packages.auth,
      includeLingo: packages.lingo,
      includeRail: packages.rail,
      includeTorch: packages.torch,
      includeKiln: packages.kiln,
      packageManager,
      bearPrimaryColor: bearColor,
      typescript: true,
      installDependencies: shouldInstall,
      includeDocker,
    };
  }

  console.log();
  
  // Create project directory
  const dirSpinner = createSpinner('Creating project directory...');
  dirSpinner.start();
  
  try {
    await ensureDir(projectDir);
    spinnerSuccess(dirSpinner, 'Project directory created');
  } catch {
    spinnerError(dirSpinner, 'Failed to create directory');
    process.exit(1);
  }

  // Generate template files
  const templateSpinner = createSpinner('Generating project files...');
  templateSpinner.start();
  
  try {
    switch (config.type) {
      case 'react':
        await generateReactTemplate(projectDir, config);
        break;
      case 'server':
        await generateServerTemplate(projectDir, config);
        break;
      case 'fullstack':
        await generateFullStackTemplate(projectDir, config);
        break;
    }
    spinnerSuccess(templateSpinner, 'Project files generated');
  } catch (error) {
    spinnerError(templateSpinner, `Failed to generate files: ${error}`);
    process.exit(1);
  }

  // Install dependencies if requested
  if (config.installDependencies) {
    const installSpinner = createSpinner('Installing dependencies...');
    installSpinner.start();
    
    try {
      await installDependencies(config.packageManager, projectDir);
      spinnerSuccess(installSpinner, 'Dependencies installed');
    } catch {
      spinnerError(installSpinner, 'Failed to install dependencies');
      console.log(chalk.hex(COLORS.muted)(`  Run "${config.packageManager} install" manually in the project directory.\n`));
    }

    const forgePackages: string[] = [];
    if (config.includeBear) forgePackages.push('@forgedevstack/bear@^1.2.2');
    if (config.cssFramework === 'aerocraft') forgePackages.push('@forgedevstack/aerocraft@^1.0.4');
    if (config.includeGridTable) forgePackages.push('@forgedevstack/grid-table@^1.0.8');
    if (config.includeForgeQuery || config.apiClient === 'forge-query') forgePackages.push('@forgedevstack/forge-query@^1.0.1');
    if (config.includeForgeForm) forgePackages.push('@forgedevstack/forge-form@^1.0.0');
    if (config.includeRelay) forgePackages.push('@forgedevstack/relay@^1.0.0');
    if (config.includeAuth) forgePackages.push('@forgedevstack/forge-auth@^1.0.0');
    if (config.includeLingo) forgePackages.push('@forgedevstack/lingo@^1.0.0');
    if (config.includeRail) forgePackages.push('@forgedevstack/rail@^1.0.0');
    if (config.includeTorch) forgePackages.push('@forgedevstack/torch@^1.0.0');
    if (config.router === 'compass') forgePackages.push('@forgedevstack/forge-compass@^1.0.2');
    if (config.router === 'react-router') forgePackages.push('react-router-dom');
    if (config.stateManager === 'synapse') forgePackages.push('@forgedevstack/synapse@^1.0.2');
    if (config.stateManager === 'rtk') {
      forgePackages.push('@reduxjs/toolkit');
      forgePackages.push('react-redux');
    }

    if (forgePackages.length > 0) {
      const forgeSpinner = createSpinner('Adding ForgeStack packages...');
      forgeSpinner.start();
      
      try {
        await addPackages(config.packageManager, forgePackages, projectDir);
        spinnerSuccess(forgeSpinner, 'ForgeStack packages added');
      } catch {
        spinnerError(forgeSpinner, 'Failed to add ForgeStack packages');
      }
    }

    // Crucible and Kiln are devDependencies
    const devPkgs: string[] = [];
    if (config.includeCrucible) devPkgs.push('@forgedevstack/crucible');
    if (config.includeKiln) devPkgs.push('@forgedevstack/kiln');

    if (devPkgs.length > 0) {
      const devSpinner = createSpinner(`Adding ${devPkgs.map(p => p.split('/')[1]).join(', ')} (dev)...`);
      devSpinner.start();
      try {
        await addPackages(config.packageManager, devPkgs, projectDir, true);
        spinnerSuccess(devSpinner, `${devPkgs.map(p => p.split('/')[1]).join(', ')} added as devDependencies`);
      } catch {
        spinnerError(devSpinner, 'Failed to add dev packages');
      }
    }
  }

  // Print success message
  console.log();
  printSuccess('Project created successfully!');
  console.log();
  console.log(printGradient('  ─────────────────────────────────────────'));
  console.log();
  console.log(`  ${chalk.hex(COLORS.text)('Next steps:')}`);
  console.log();
  console.log(`  ${chalk.hex(COLORS.muted)('1.')} ${chalk.hex(COLORS.primary)(`cd ${name}`)}`);
  
  if (!config.installDependencies) {
    console.log(`  ${chalk.hex(COLORS.muted)('2.')} ${chalk.hex(COLORS.primary)(`${config.packageManager} install`)}`);
    console.log(`  ${chalk.hex(COLORS.muted)('3.')} ${chalk.hex(COLORS.primary)(`${config.packageManager}${config.packageManager === 'yarn' ? '' : ' run'} dev`)}`);
  } else {
    console.log(`  ${chalk.hex(COLORS.muted)('2.')} ${chalk.hex(COLORS.primary)(`${config.packageManager}${config.packageManager === 'yarn' ? '' : ' run'} dev`)}`);
  }
  
  console.log();
  
  if (config.stateManager === 'synapse' || config.stateManager === 'rtk') {
    console.log(`  ${chalk.hex(COLORS.muted)('Generate new slice:')} ${chalk.hex(COLORS.accent)(`${config.packageManager}${config.packageManager === 'yarn' ? '' : ' run'} generate:slice`)}`);
  }
  console.log(`  ${chalk.hex(COLORS.muted)('Generate new page:')} ${chalk.hex(COLORS.accent)(`${config.packageManager}${config.packageManager === 'yarn' ? '' : ' run'} generate:page`)}`);
  console.log(`  ${chalk.hex(COLORS.muted)('Generate component:')} ${chalk.hex(COLORS.accent)(`${config.packageManager}${config.packageManager === 'yarn' ? '' : ' run'} generate:component`)}`);
  
  console.log();
  console.log(printGradient('  ─────────────────────────────────────────'));
  console.log();

  // Print ForgeStack packages table
  printForgeStackPackages(config);

  console.log(printGradient('  ─────────────────────────────────────────'));
  console.log();
  console.log(`  ${chalk.hex(COLORS.muted)('Documentation:')} ${chalk.hex(COLORS.accent)('https://forgedevstack.com')}`);
  console.log();
};

/**
 * Print ForgeStack packages table with versions
 */
const printForgeStackPackages = (config: ProjectConfig): void => {
  const packages: { name: string; package: string; version: string; included: boolean }[] = [];

  if (config.includeBear) {
    packages.push({ name: 'Bear UI', package: '@forgedevstack/bear', version: '^1.2.2', included: true });
  }
  if (config.cssFramework === 'aerocraft') {
    packages.push({ name: 'AeroCraft', package: '@forgedevstack/aerocraft', version: '^1.0.4', included: true });
  }
  if (config.stateManager === 'synapse') {
    packages.push({ name: 'Synapse', package: '@forgedevstack/synapse', version: '^1.0.2', included: true });
  }
  if (config.stateManager === 'rtk') {
    packages.push({ name: 'Redux Toolkit', package: '@reduxjs/toolkit', version: 'latest', included: true });
    packages.push({ name: 'React Redux', package: 'react-redux', version: 'latest', included: true });
  }
  if (config.router === 'compass') {
    packages.push({ name: 'Forge Compass', package: '@forgedevstack/forge-compass', version: '^1.0.2', included: true });
  }
  if (config.includeForgeForm) {
    packages.push({ name: 'Forge Form', package: '@forgedevstack/forge-form', version: '^1.0.0', included: true });
  }
  if (config.includeForgeQuery || config.apiClient === 'forge-query') {
    packages.push({ name: 'Forge Query', package: '@forgedevstack/forge-query', version: '^1.0.1', included: true });
  }
  if (config.includeGridTable) {
    packages.push({ name: 'Grid Table', package: '@forgedevstack/grid-table', version: '^1.0.8', included: true });
  }
  if (config.includeRelay) {
    packages.push({ name: 'Relay', package: '@forgedevstack/relay', version: '^1.0.0', included: true });
  }
  if (config.includeAuth) {
    packages.push({ name: 'Forge Auth', package: '@forgedevstack/forge-auth', version: '^1.0.0', included: true });
  }
  if (config.includeLingo) {
    packages.push({ name: 'Lingo', package: '@forgedevstack/lingo', version: '^1.0.0', included: true });
  }
  if (config.includeRail) {
    packages.push({ name: 'Rail', package: '@forgedevstack/rail', version: '^1.0.0', included: true });
  }
  if (config.includeTorch) {
    packages.push({ name: 'Torch', package: '@forgedevstack/torch', version: '^1.0.0', included: true });
  }
  packages.push({ name: 'Anvil', package: '@forgedevstack/anvil', version: '^1.0.6', included: true });
  
  if (config.includeKiln) {
    packages.push({ name: 'Kiln', package: '@forgedevstack/kiln', version: '^1.0.5', included: true });
  }
  if (config.includeCrucible) {
    packages.push({ name: 'Crucible', package: '@forgedevstack/crucible', version: '^1.0.0', included: true });
  }

  if (config.type === 'server' || config.type === 'fullstack' || config.includeBackend) {
    if (config.serverFramework === 'harbor') {
      packages.push({ name: 'Harbor', package: '@forgedevstack/harbor', version: '^1.6.2', included: true });
    }
  }

  if (packages.length === 0) return;

  console.log(`  ${chalk.hex(COLORS.text)('ForgeStack Packages:')}`);
  console.log();
  
  // Table header
  const headerPkg = chalk.hex(COLORS.muted)('Package'.padEnd(30));
  const headerVer = chalk.hex(COLORS.muted)('Version'.padEnd(10));
  console.log(`  ${headerPkg} ${headerVer}`);
  console.log(`  ${chalk.hex(COLORS.muted)('─'.repeat(42))}`);

  // Table rows
  for (const pkg of packages) {
    const pkgName = chalk.hex(COLORS.accent)(pkg.package.padEnd(30));
    const pkgVersion = chalk.hex(COLORS.primary)(pkg.version.padEnd(10));
    console.log(`  ${pkgName} ${pkgVersion}`);
  }

  console.log();
};
