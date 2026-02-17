import enquirer from 'enquirer';
const { prompt } = enquirer;
import chalk from 'chalk';
import { COLORS } from './colors.js';

export type ProjectType = 'react' | 'server' | 'fullstack';
export type StateManager = 'synapse' | 'none';
export type RouterType = 'compass' | 'react-router' | 'none';
export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun';

export type ApiClient = 'forge-query' | 'fetch';
export type ServerFramework = 'harbor' | 'express';

export interface ProjectConfig {
  name: string;
  type: ProjectType;
  stateManager: StateManager;
  router: RouterType;
  apiClient: ApiClient;
  serverFramework: ServerFramework;
  includeBear: boolean;
  includeGridTable: boolean;
  includeForgeQuery: boolean;
  includeForgeForm: boolean;
  includeRelay: boolean;
  includeCrucible: boolean;
  includeAuth: boolean;
  packageManager: PackageManager;
  bearPrimaryColor?: string;
  typescript: boolean;
  installDependencies: boolean;
  includeDocker: boolean;
}

const pink = chalk.hex(COLORS.primary);
const accent = chalk.hex(COLORS.accent);
const muted = chalk.hex(COLORS.muted);

export const promptProjectName = async (defaultName?: string): Promise<string> => {
  const response = await prompt<{ name: string }>({
    type: 'input',
    name: 'name',
    message: pink('What is your project name?'),
    initial: defaultName || 'my-forge-app',
    validate: (value: string) => {
      if (!value.trim()) return 'Project name is required';
      if (!/^[a-z0-9-_]+$/i.test(value)) return 'Use only letters, numbers, dashes, and underscores';
      return true;
    },
  });
  return response.name;
};

export const promptProjectType = async (): Promise<ProjectType> => {
  const response = await prompt<{ type: ProjectType }>({
    type: 'select',
    name: 'type',
    message: pink('What type of project?'),
    choices: [
      { name: 'react', message: `${accent('⚛️  React')} ${muted('- Frontend with Vite + ForgeStack')}` },
      { name: 'server', message: `${accent('🖥️  Server')} ${muted('- Express/Node.js API')}` },
      { name: 'fullstack', message: `${accent('🚀 Full-Stack')} ${muted('- Monorepo with React + Express')}` },
    ],
  });
  return response.type;
};

export const promptStateManager = async (): Promise<StateManager> => {
  const response = await prompt<{ stateManager: StateManager }>({
    type: 'select',
    name: 'stateManager',
    message: pink('Include state management?'),
    choices: [
      { name: 'synapse', message: `${accent('⚡ Synapse')} ${muted('- ForgeStack state management (recommended)')}` },
      { name: 'none', message: `${accent('❌ None')} ${muted('- Just React useState/useContext')}` },
    ],
  });
  return response.stateManager;
};

export const promptRouter = async (): Promise<RouterType> => {
  const response = await prompt<{ router: RouterType }>({
    type: 'select',
    name: 'router',
    message: pink('Which router?'),
    choices: [
      { name: 'compass', message: `${accent('🧭 Forge Compass')} ${muted('- ForgeStack routing (recommended)')}` },
      { name: 'react-router', message: `${accent('🔀 React Router')} ${muted('- Standard React Router v6')}` },
      { name: 'none', message: `${accent('❌ None')} ${muted('- Single page app')}` },
    ],
  });
  return response.router;
};

export const promptApiClient = async (): Promise<ApiClient> => {
  const response = await prompt<{ api: ApiClient }>({
    type: 'select',
    name: 'api',
    message: pink('API client for data fetching?'),
    choices: [
      { name: 'forge-query', message: `${accent('🔍 Forge Query')} ${muted('- ForgeStack data fetching & caching (recommended)')}` },
      { name: 'fetch', message: `${accent('🌐 Fetch')} ${muted('- Native fetch API')}` },
    ],
  });
  return response.api;
};

export const promptServerFramework = async (): Promise<ServerFramework> => {
  const response = await prompt<{ framework: ServerFramework }>({
    type: 'select',
    name: 'framework',
    message: pink('Server framework?'),
    choices: [
      { name: 'harbor', message: `${accent('⚓')} ${chalk.bold('Harbor')} ${muted('- ForgeStack backend framework (recommended)')}` },
      { name: 'express', message: `${accent('🚂 Express')} ${muted('- Standard Express.js setup')}` },
    ],
  });
  return response.framework;
};

export const promptForgePackages = async (): Promise<{
  bear: boolean;
  gridTable: boolean;
  forgeQuery: boolean;
  forgeForm: boolean;
  relay: boolean;
  crucible: boolean;
  auth: boolean;
}> => {
  const choices = [
    { name: 'all', message: `${chalk.bold.hex(COLORS.accent)('⭐ ALL')} ${muted('- Include all ForgeStack packages')}` },
    { name: 'bear', message: `${accent('🐻 Bear UI')} ${muted('- Component library + Theme')}` },
    { name: 'grid-table', message: `${accent('📊 Grid Table')} ${muted('- Advanced data grid')}` },
    { name: 'forge-query', message: `${accent('🔍 Forge Query')} ${muted('- Data fetching & caching')}` },
    { name: 'forge-form', message: `${accent('📝 Forge Form')} ${muted('- Form state management')}` },
    { name: 'relay', message: `${accent('📡 Relay')} ${muted('- HTTP client & WebSockets')}` },
    { name: 'crucible', message: `${accent('🧪 Crucible')} ${muted('- Testing framework (client & server)')}` },
    { name: 'forge-auth', message: `${accent('🔐 Forge Auth')} ${muted('- Authentication & OAuth')}` },
  ];

  // Use enquirer.prompt with type 'multiselect' for proper multi-select behavior
  const response = await (prompt as (options: Record<string, unknown>) => Promise<Record<string, string[]>>)({
    type: 'multiselect',
    name: 'packages',
    message: pink('Select ForgeStack packages:') + muted(' (↑↓ navigate, space select, a toggle all, enter confirm)'),
    hint: muted('(Use <space> to select, <a> to toggle all)'),
    choices,
    initial: [0], // Pre-select "ALL" by index
  });

  const packages = response.packages;
  const hasAll = packages.includes('all');
  
  return {
    bear: hasAll || packages.includes('bear'),
    gridTable: hasAll || packages.includes('grid-table'),
    forgeQuery: hasAll || packages.includes('forge-query'),
    forgeForm: hasAll || packages.includes('forge-form'),
    relay: hasAll || packages.includes('relay'),
    crucible: hasAll || packages.includes('crucible'),
    auth: hasAll || packages.includes('forge-auth'),
  };
};

export const promptPackageManager = async (): Promise<PackageManager> => {
  const response = await prompt<{ pm: PackageManager }>({
    type: 'select',
    name: 'pm',
    message: pink('Which package manager?'),
    choices: [
      { name: 'npm', message: `${accent('📦 npm')} ${muted('- Node Package Manager')}` },
      { name: 'pnpm', message: `${accent('⚡ pnpm')} ${muted('- Fast, disk space efficient')}` },
      { name: 'yarn', message: `${accent('🧶 yarn')} ${muted('- Fast, reliable')}` },
      { name: 'bun', message: `${accent('🥟 bun')} ${muted('- All-in-one toolkit')}` },
    ],
  });
  return response.pm;
};

export const promptBearColor = async (): Promise<string> => {
  const response = await prompt<{ color: string }>({
    type: 'input',
    name: 'color',
    message: pink('Bear UI primary color (hex):'),
    initial: '#ec4899',
    validate: (value: string) => {
      if (!/^#[0-9A-Fa-f]{6}$/.test(value)) return 'Enter a valid hex color (e.g., #ec4899)';
      return true;
    },
  });
  return response.color;
};

export const promptInstallDependencies = async (): Promise<boolean> => {
  const response = await prompt<{ install: string }>({
    type: 'select',
    name: 'install',
    message: pink('Install dependencies now?'),
    choices: [
      { name: 'yes', message: `${accent('Yes')} ${muted('- Install with package manager')}` },
      { name: 'no', message: `${accent('No')} ${muted('- Skip, install later manually')}` },
    ],
  });
  return response.install === 'yes';
};

export const promptOutputPath = async (defaultPath: string): Promise<string> => {
  const response = await prompt<{ path: string }>({
    type: 'input',
    name: 'path',
    message: pink('Output directory (relative or absolute):'),
    initial: defaultPath,
  });
  return response.path;
};

export const promptIncludeDocker = async (): Promise<boolean> => {
  const response = await prompt<{ docker: boolean }>({
    type: 'confirm',
    name: 'docker',
    message: pink('Include Docker configuration?'),
    initial: true,
  });
  return response.docker;
};

export const promptConfirm = async (message: string): Promise<boolean> => {
  const response = await prompt<{ confirm: boolean }>({
    type: 'confirm',
    name: 'confirm',
    message: pink(message),
    initial: true,
  });
  return response.confirm;
};

export const promptSliceName = async (): Promise<string> => {
  const response = await prompt<{ name: string }>({
    type: 'input',
    name: 'name',
    message: pink('Slice name (e.g., user, cart, auth):'),
    validate: (value: string) => {
      if (!value.trim()) return 'Slice name is required';
      if (!/^[a-z][a-z0-9]*$/i.test(value)) return 'Use camelCase (e.g., user, shoppingCart)';
      return true;
    },
  });
  return response.name;
};

export const promptPageName = async (): Promise<string> => {
  const response = await prompt<{ name: string }>({
    type: 'input',
    name: 'name',
    message: pink('Page name (e.g., Home, Dashboard, Settings):'),
    validate: (value: string) => {
      if (!value.trim()) return 'Page name is required';
      if (!/^[A-Z][a-zA-Z0-9]*$/.test(value)) return 'Use PascalCase (e.g., Home, UserProfile)';
      return true;
    },
  });
  return response.name;
};

export const promptComponentName = async (): Promise<string> => {
  const response = await prompt<{ name: string }>({
    type: 'input',
    name: 'name',
    message: pink('Component name (e.g., Button, UserCard):'),
    validate: (value: string) => {
      if (!value.trim()) return 'Component name is required';
      if (!/^[A-Z][a-zA-Z0-9]*$/.test(value)) return 'Use PascalCase (e.g., Button, UserCard)';
      return true;
    },
  });
  return response.name;
};
