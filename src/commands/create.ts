import path from 'path';
import chalk from 'chalk';
import {
  promptProjectName,
  promptProjectType,
  promptStateManager,
  promptRouter,
  promptApiClient,
  promptServerFramework,
  promptForgePackages,
  promptPackageManager,
  promptBearColor,
  promptInstallDependencies,
  promptIncludeDocker,
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

const VERSION = '1.0.1';

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
      apiClient: 'forge-query',
      serverFramework: 'harbor',
      includeBear: true,
      includeGridTable: true,
      includeForgeQuery: true,
      includeForgeForm: true,
      includeRelay: true,
      includeCrucible: true,
      includeAuth: true,
      packageManager: (options.packageManager as ProjectConfig['packageManager']) || 'npm',
      typescript: true,
      installDependencies: true,
      includeDocker: true,
    };
  } else {
    const type = (options.template as ProjectType) || await promptProjectType();
    
    // Frontend specific options
    let stateManager: ProjectConfig['stateManager'] = 'none';
    let router: ProjectConfig['router'] = 'none';
    let apiClient: ProjectConfig['apiClient'] = 'fetch';
    let serverFramework: ProjectConfig['serverFramework'] = 'express';
    let packages = { bear: false, gridTable: false, forgeQuery: false, forgeForm: false, relay: false, crucible: false, auth: false };
    let bearColor: string | undefined;
    
    if (type === 'server') {
      // Server-only options
      serverFramework = await promptServerFramework();
    } else if (type === 'fullstack') {
      // Fullstack gets both frontend and server options
      stateManager = await promptStateManager();
      router = await promptRouter();
      apiClient = await promptApiClient();
      packages = await promptForgePackages();
      if (packages.bear) {
        bearColor = await promptBearColor();
      }
      serverFramework = await promptServerFramework();
    } else {
      // React frontend options
      stateManager = await promptStateManager();
      router = await promptRouter();
      apiClient = await promptApiClient();
      packages = await promptForgePackages();
      if (packages.bear) {
        bearColor = await promptBearColor();
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
      apiClient,
      serverFramework,
      includeBear: packages.bear,
      includeGridTable: packages.gridTable,
      includeForgeQuery: packages.forgeQuery,
      includeForgeForm: packages.forgeForm,
      includeRelay: packages.relay,
      includeCrucible: packages.crucible,
      includeAuth: packages.auth,
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

    // Add ForgeStack packages
    const forgePackages: string[] = [];
    if (config.includeBear) forgePackages.push('@forgedevstack/bear@^1.0.7');
    if (config.includeGridTable) forgePackages.push('@forgedevstack/grid-table');
    if (config.includeForgeQuery || config.apiClient === 'forge-query') forgePackages.push('@forgedevstack/forge-query');
    if (config.includeForgeForm) forgePackages.push('@forgedevstack/forge-form');
    if (config.includeRelay) forgePackages.push('@forgedevstack/relay');
    if (config.includeAuth) forgePackages.push('@forgedevstack/forge-auth');
    if (config.router === 'compass') forgePackages.push('@forgedevstack/forge-compass');
    if (config.router === 'react-router') forgePackages.push('react-router-dom');
    if (config.stateManager === 'synapse') forgePackages.push('@forgedevstack/synapse');
    // Crucible is a devDependency — added separately below
    // Note: Harbor is added in server template's package.json directly

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

    // Crucible is a devDependency (testing library)
    if (config.includeCrucible) {
      const crucibleSpinner = createSpinner('Adding Crucible (testing)...');
      crucibleSpinner.start();
      try {
        await addPackages(config.packageManager, ['@forgedevstack/crucible'], projectDir, true);
        spinnerSuccess(crucibleSpinner, 'Crucible added as devDependency');
      } catch {
        spinnerError(crucibleSpinner, 'Failed to add Crucible');
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
  
  if (config.stateManager === 'synapse') {
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

  // Core packages based on config
  if (config.includeBear) {
    packages.push({ name: 'Bear UI', package: '@forgedevstack/bear', version: '^1.0.7', included: true });
  }
  if (config.stateManager === 'synapse') {
    packages.push({ name: 'Synapse', package: '@forgedevstack/synapse', version: '^1.0.0', included: true });
  }
  if (config.router === 'compass') {
    packages.push({ name: 'Forge Compass', package: '@forgedevstack/forge-compass', version: '^1.2.1', included: true });
  }
  if (config.includeForgeForm) {
    packages.push({ name: 'Forge Form', package: '@forgedevstack/forge-form', version: '^1.0.0', included: true });
  }
  if (config.includeForgeQuery || config.apiClient === 'forge-query') {
    packages.push({ name: 'Forge Query', package: '@forgedevstack/forge-query', version: '^1.0.0', included: true });
  }
  if (config.includeGridTable) {
    packages.push({ name: 'Grid Table', package: '@forgedevstack/grid-table', version: '^1.0.0', included: true });
  }
  if (config.includeRelay) {
    packages.push({ name: 'Relay', package: '@forgedevstack/relay', version: '^1.0.0', included: true });
  }
  if (config.includeAuth) {
    packages.push({ name: 'Forge Auth', package: '@forgedevstack/forge-auth', version: '^1.0.0', included: true });
  }
  // Anvil is always included
  packages.push({ name: 'Anvil', package: '@forgedevstack/anvil', version: '^1.0.0', included: true });
  
  // Testing (devDependency)
  if (config.includeCrucible) {
    packages.push({ name: 'Crucible', package: '@forgedevstack/crucible', version: '^1.0.0', included: true });
  }

  // Server packages
  if (config.type === 'server' || config.type === 'fullstack') {
    if (config.serverFramework === 'harbor') {
      packages.push({ name: 'Harbor', package: '@forgedevstack/harbor', version: '^1.0.0', included: true });
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
