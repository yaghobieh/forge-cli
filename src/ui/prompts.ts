import enquirer from 'enquirer';
const { prompt } = enquirer;
import chalk from 'chalk';
import { COLORS } from './colors.js';

export type ProjectType = 'react' | 'server' | 'fullstack';
export type StateManager = 'synapse' | 'rtk' | 'none';
export type RouterType = 'compass' | 'react-router' | 'none';
export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun';
export type CssFramework = 'aerocraft' | 'tailwind' | 'none';

export type ApiClient = 'forge-query' | 'fetch';
export type ServerFramework = 'harbor' | 'express';

export interface ProjectConfig {
  name: string;
  type: ProjectType;
  stateManager: StateManager;
  router: RouterType;
  cssFramework: CssFramework;
  apiClient: ApiClient;
  serverFramework: ServerFramework;
  includeBackend: boolean;
  includeBear: boolean;
  includeGridTable: boolean;
  includeForgeQuery: boolean;
  includeForgeForm: boolean;
  includeRelay: boolean;
  includeCrucible: boolean;
  includeAuth: boolean;
  includeLingo: boolean;
  includeRail: boolean;
  includeTorch: boolean;
  includeKiln: boolean;
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
  console.log();
  console.log(pink('  ┌──────────────────────────────────────────────────────────┐'));
  console.log(pink('  │') + accent('  Synapse vs Redux Toolkit                                ') + pink('│'));
  console.log(pink('  ├─────────────────────┬──────────────────┬─────────────────┤'));
  console.log(pink('  │') + muted(' Feature             ') + pink('│') + accent(' Synapse          ') + pink('│') + muted(' Redux Toolkit    ') + pink('│'));
  console.log(pink('  ├─────────────────────┼──────────────────┼─────────────────┤'));
  console.log(pink('  │') + muted(' Boilerplate         ') + pink('│') + chalk.green(' ✓ Zero           ') + pink('│') + chalk.red(' ✗ Slices + RTK  ') + pink('│'));
  console.log(pink('  │') + muted(' Bundle size         ') + pink('│') + chalk.green(' ~2 KB            ') + pink('│') + muted(' ~11 KB          ') + pink('│'));
  console.log(pink('  │') + muted(' Nuclear pattern     ') + pink('│') + chalk.green(' ✓ Built-in       ') + pink('│') + chalk.red(' ✗ Manual        ') + pink('│'));
  console.log(pink('  │') + muted(' useQuery/Mutation   ') + pink('│') + chalk.green(' ✓ Built-in       ') + pink('│') + muted(' ✓ RTK Query     ') + pink('│'));
  console.log(pink('  │') + muted(' DevTools            ') + pink('│') + chalk.green(' ✓ Built-in       ') + pink('│') + chalk.green(' ✓ Redux DT      ') + pink('│'));
  console.log(pink('  │') + muted(' Learning curve      ') + pink('│') + chalk.green(' Easy             ') + pink('│') + chalk.red(' Moderate        ') + pink('│'));
  console.log(pink('  └─────────────────────┴──────────────────┴─────────────────┘'));
  console.log();

  const response = await prompt<{ stateManager: StateManager }>({
    type: 'select',
    name: 'stateManager',
    message: pink('State management?'),
    choices: [
      { name: 'synapse', message: `${accent('⚡ Synapse')} ${muted('- Nuclear architecture, zero boilerplate (recommended)')}` },
      { name: 'rtk', message: `${accent('🔧 Redux Toolkit')} ${muted('- SDK pattern: api, reducers, manager, selectors')}` },
      { name: 'none', message: `${accent('❌ None')} ${muted('- Just React useState/useContext')}` },
    ],
  });
  return response.stateManager;
};

export const promptRouter = async (): Promise<RouterType> => {
  console.log();
  console.log(pink('  ┌─────────────────────────────────────────────────────┐'));
  console.log(pink('  │') + accent('  Compass vs React Router                            ') + pink('│'));
  console.log(pink('  ├────────────────────┬────────────────┬───────────────┤'));
  console.log(pink('  │') + muted(' Feature            ') + pink('│') + accent(' Compass        ') + pink('│') + muted(' React Router   ') + pink('│'));
  console.log(pink('  ├────────────────────┼────────────────┼───────────────┤'));
  console.log(pink('  │') + muted(' Type-safe routes   ') + pink('│') + chalk.green(' ✓ Built-in     ') + pink('│') + chalk.red(' ✗ Manual       ') + pink('│'));
  console.log(pink('  │') + muted(' Route guards       ') + pink('│') + chalk.green(' ✓ Declarative  ') + pink('│') + chalk.red(' ✗ DIY          ') + pink('│'));
  console.log(pink('  │') + muted(' Bundle size        ') + pink('│') + chalk.green(' ~4 KB          ') + pink('│') + muted(' ~14 KB         ') + pink('│'));
  console.log(pink('  │') + muted(' Middleware          ') + pink('│') + chalk.green(' ✓ Native       ') + pink('│') + chalk.red(' ✗ Loaders only ') + pink('│'));
  console.log(pink('  │') + muted(' Zero config         ') + pink('│') + chalk.green(' ✓              ') + pink('│') + chalk.red(' ✗              ') + pink('│'));
  console.log(pink('  └────────────────────┴────────────────┴───────────────┘'));
  console.log();

  const response = await prompt<{ router: RouterType }>({
    type: 'select',
    name: 'router',
    message: pink('Which router?'),
    choices: [
      { name: 'compass', message: `${accent('🧭 Forge Compass')} ${muted('- Type-safe routing + guards (recommended)')}` },
      { name: 'react-router', message: `${accent('🔀 React Router')} ${muted('- Standard React Router v6')}` },
      { name: 'none', message: `${accent('❌ None')} ${muted('- Single page app')}` },
    ],
  });
  return response.router;
};

export const promptCssFramework = async (): Promise<CssFramework> => {
  console.log();
  console.log(pink('  ┌──────────────────────────────────────────────────────────┐'));
  console.log(pink('  │') + accent('  AeroCraft vs Tailwind                                   ') + pink('│'));
  console.log(pink('  ├─────────────────────┬──────────────────┬─────────────────┤'));
  console.log(pink('  │') + muted(' Feature             ') + pink('│') + accent(' AeroCraft        ') + pink('│') + muted(' Tailwind         ') + pink('│'));
  console.log(pink('  ├─────────────────────┼──────────────────┼─────────────────┤'));
  console.log(pink('  │') + muted(' Component recipes   ') + pink('│') + chalk.green(' ✓ 25+ built-in  ') + pink('│') + chalk.red(' ✗ None          ') + pink('│'));
  console.log(pink('  │') + muted(' Runtime theming     ') + pink('│') + chalk.green(' ✓ CSS variables  ') + pink('│') + chalk.red(' ✗ Build-time    ') + pink('│'));
  console.log(pink('  │') + muted(' Dark mode           ') + pink('│') + chalk.green(' ✓ Native         ') + pink('│') + chalk.green(' ✓ Class-based   ') + pink('│'));
  console.log(pink('  │') + muted(' Custom prefix       ') + pink('│') + chalk.green(' ✓ Any prefix     ') + pink('│') + chalk.red(' ✗ tw- only      ') + pink('│'));
  console.log(pink('  │') + muted(' Model API           ') + pink('│') + chalk.green(' ✓ Runtime        ') + pink('│') + chalk.red(' ✗ None          ') + pink('│'));
  console.log(pink('  │') + muted(' Bundle size         ') + pink('│') + chalk.green(' ~3 KB            ') + pink('│') + muted(' ~10 KB          ') + pink('│'));
  console.log(pink('  │') + muted(' Bear UI integration ') + pink('│') + chalk.green(' ✓ Native         ') + pink('│') + chalk.red(' ✗ Manual        ') + pink('│'));
  console.log(pink('  └─────────────────────┴──────────────────┴─────────────────┘'));
  console.log();

  const response = await prompt<{ css: CssFramework }>({
    type: 'select',
    name: 'css',
    message: pink('CSS utility framework?'),
    choices: [
      { name: 'aerocraft', message: `${accent('✈️  AeroCraft')} ${muted('- ForgeStack CSS engine, 25+ recipes, runtime theming (recommended)')}` },
      { name: 'tailwind', message: `${accent('🌊 Tailwind CSS')} ${muted('- Popular utility-first CSS framework')}` },
      { name: 'none', message: `${accent('❌ None')} ${muted('- Write your own CSS')}` },
    ],
  });
  return response.css;
};

export const promptApiClient = async (): Promise<ApiClient> => {
  console.log();
  console.log(pink('  ┌──────────────────────────────────────────────────────────┐'));
  console.log(pink('  │') + accent('  Forge Query vs Alternatives                             ') + pink('│'));
  console.log(pink('  ├─────────────────────┬──────────────────┬─────────────────┤'));
  console.log(pink('  │') + muted(' Feature             ') + pink('│') + accent(' Forge Query      ') + pink('│') + muted(' TanStack / SWR   ') + pink('│'));
  console.log(pink('  ├─────────────────────┼──────────────────┼─────────────────┤'));
  console.log(pink('  │') + muted(' Auto caching        ') + pink('│') + chalk.green(' ✓ Smart stale    ') + pink('│') + chalk.green(' ✓ Config-heavy  ') + pink('│'));
  console.log(pink('  │') + muted(' Retry logic         ') + pink('│') + chalk.green(' ✓ Built-in       ') + pink('│') + chalk.green(' ✓ Manual config ') + pink('│'));
  console.log(pink('  │') + muted(' Optimistic updates  ') + pink('│') + chalk.green(' ✓ Declarative    ') + pink('│') + muted(' ✓ Imperative    ') + pink('│'));
  console.log(pink('  │') + muted(' Bundle size         ') + pink('│') + chalk.green(' ~3 KB            ') + pink('│') + muted(' ~12 KB          ') + pink('│'));
  console.log(pink('  │') + muted(' Synapse integration ') + pink('│') + chalk.green(' ✓ Native         ') + pink('│') + chalk.red(' ✗ Manual        ') + pink('│'));
  console.log(pink('  │') + muted(' Zero config         ') + pink('│') + chalk.green(' ✓ Works out-of-box') + pink('│') + chalk.red(' ✗ Provider setup') + pink('│'));
  console.log(pink('  └─────────────────────┴──────────────────┴─────────────────┘'));
  console.log();

  const response = await prompt<{ api: ApiClient }>({
    type: 'select',
    name: 'api',
    message: pink('API client for data fetching?'),
    choices: [
      { name: 'forge-query', message: `${accent('🔍 Forge Query')} ${muted('- Auto caching, retry, optimistic updates (recommended)')}` },
      { name: 'fetch', message: `${accent('🌐 Fetch')} ${muted('- Native fetch API, manual caching')}` },
    ],
  });
  return response.api;
};

export const promptServerFramework = async (): Promise<ServerFramework> => {
  console.log();
  console.log(pink('  ┌──────────────────────────────────────────────────────────┐'));
  console.log(pink('  │') + accent('  Harbor vs Express                                       ') + pink('│'));
  console.log(pink('  ├─────────────────────┬──────────────────┬─────────────────┤'));
  console.log(pink('  │') + muted(' Feature             ') + pink('│') + accent(' Harbor           ') + pink('│') + muted(' Express          ') + pink('│'));
  console.log(pink('  ├─────────────────────┼──────────────────┼─────────────────┤'));
  console.log(pink('  │') + muted(' Zero config         ') + pink('│') + chalk.green(' ✓ Out of box     ') + pink('│') + chalk.red(' ✗ Manual setup  ') + pink('│'));
  console.log(pink('  │') + muted(' MongoDB ODM         ') + pink('│') + chalk.green(' ✓ Built-in       ') + pink('│') + chalk.red(' ✗ Add Mongoose  ') + pink('│'));
  console.log(pink('  │') + muted(' JWT auth            ') + pink('│') + chalk.green(' ✓ Built-in       ') + pink('│') + chalk.red(' ✗ Add passport  ') + pink('│'));
  console.log(pink('  │') + muted(' Validation          ') + pink('│') + chalk.green(' ✓ Built-in       ') + pink('│') + chalk.red(' ✗ Add Joi/Zod   ') + pink('│'));
  console.log(pink('  │') + muted(' Rate limiting       ') + pink('│') + chalk.green(' ✓ Built-in       ') + pink('│') + chalk.red(' ✗ Add manually  ') + pink('│'));
  console.log(pink('  │') + muted(' Health checks       ') + pink('│') + chalk.green(' ✓ Built-in       ') + pink('│') + chalk.red(' ✗ Add manually  ') + pink('│'));
  console.log(pink('  │') + muted(' WebSocket           ') + pink('│') + chalk.green(' ✓ Built-in       ') + pink('│') + chalk.red(' ✗ Add socket.io ') + pink('│'));
  console.log(pink('  └─────────────────────┴──────────────────┴─────────────────┘'));
  console.log();

  const response = await prompt<{ framework: ServerFramework }>({
    type: 'select',
    name: 'framework',
    message: pink('Server framework?'),
    choices: [
      { name: 'harbor', message: `${accent('⚓')} ${chalk.bold('Harbor')} ${muted('- Zero config, MongoDB, JWT, WebSocket (recommended)')}` },
      { name: 'express', message: `${accent('🚂 Express')} ${muted('- Standard Express.js, manual setup')}` },
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
  lingo: boolean;
  rail: boolean;
  torch: boolean;
  kiln: boolean;
}> => {
  // ── Lingo vs i18next ───────────────────────────────────────────────────
  console.log();
  console.log(pink('  ┌──────────────────────────────────────────────────────────┐'));
  console.log(pink('  │') + accent('  Lingo vs i18next                                        ') + pink('│'));
  console.log(pink('  ├─────────────────────┬──────────────────┬─────────────────┤'));
  console.log(pink('  │') + muted(' Feature             ') + pink('│') + accent(' Lingo            ') + pink('│') + muted(' i18next          ') + pink('│'));
  console.log(pink('  ├─────────────────────┼──────────────────┼─────────────────┤'));
  console.log(pink('  │') + muted(' AI translations     ') + pink('│') + chalk.green(' ✓ Built-in       ') + pink('│') + chalk.red(' ✗ Manual         ') + pink('│'));
  console.log(pink('  │') + muted(' React hooks         ') + pink('│') + chalk.green(' ✓ useTranslate   ') + pink('│') + muted(' ✓ useTranslation ') + pink('│'));
  console.log(pink('  │') + muted(' Bundle size         ') + pink('│') + chalk.green(' ~2 KB            ') + pink('│') + muted(' ~22 KB           ') + pink('│'));
  console.log(pink('  │') + muted(' Namespace free      ') + pink('│') + chalk.green(' ✓ Flat keys      ') + pink('│') + chalk.red(' ✗ Namespace cfg  ') + pink('│'));
  console.log(pink('  │') + muted(' Type-safe keys      ') + pink('│') + chalk.green(' ✓ Auto-inferred  ') + pink('│') + chalk.red(' ✗ Plugin needed  ') + pink('│'));
  console.log(pink('  │') + muted(' Zero config         ') + pink('│') + chalk.green(' ✓ Works out-of-box') + pink('│') + chalk.red(' ✗ Init + plugins') + pink('│'));
  console.log(pink('  └─────────────────────┴──────────────────┴─────────────────┘'));

  // ── Anvil vs Lodash ────────────────────────────────────────────────────
  console.log();
  console.log(pink('  ┌──────────────────────────────────────────────────────────┐'));
  console.log(pink('  │') + accent('  Anvil vs Lodash                                         ') + pink('│'));
  console.log(pink('  ├─────────────────────┬──────────────────┬─────────────────┤'));
  console.log(pink('  │') + muted(' Feature             ') + pink('│') + accent(' Anvil            ') + pink('│') + muted(' Lodash           ') + pink('│'));
  console.log(pink('  ├─────────────────────┼──────────────────┼─────────────────┤'));
  console.log(pink('  │') + muted(' Tree-shaking        ') + pink('│') + chalk.green(' ✓ ESM native     ') + pink('│') + chalk.red(' ✗ Partial        ') + pink('│'));
  console.log(pink('  │') + muted(' TypeScript          ') + pink('│') + chalk.green(' ✓ Written in TS  ') + pink('│') + muted(' ✓ @types/lodash  ') + pink('│'));
  console.log(pink('  │') + muted(' Bundle size         ') + pink('│') + chalk.green(' ~3 KB            ') + pink('│') + muted(' ~72 KB full      ') + pink('│'));
  console.log(pink('  │') + muted(' React helpers       ') + pink('│') + chalk.green(' ✓ Built-in       ') + pink('│') + chalk.red(' ✗ None           ') + pink('│'));
  console.log(pink('  │') + muted(' Forge integration   ') + pink('│') + chalk.green(' ✓ Native         ') + pink('│') + chalk.red(' ✗ Third-party    ') + pink('│'));
  console.log(pink('  │') + muted(' Modern APIs         ') + pink('│') + chalk.green(' ✓ ES2020+        ') + pink('│') + chalk.red(' ✗ Legacy compat  ') + pink('│'));
  console.log(pink('  └─────────────────────┴──────────────────┴─────────────────┘'));

  // ── Rail vs Swiper ─────────────────────────────────────────────────────
  console.log();
  console.log(pink('  ┌──────────────────────────────────────────────────────────┐'));
  console.log(pink('  │') + accent('  Rail vs Swiper                                          ') + pink('│'));
  console.log(pink('  ├─────────────────────┬──────────────────┬─────────────────┤'));
  console.log(pink('  │') + muted(' Feature             ') + pink('│') + accent(' Rail             ') + pink('│') + muted(' Swiper           ') + pink('│'));
  console.log(pink('  ├─────────────────────┼──────────────────┼─────────────────┤'));
  console.log(pink('  │') + muted(' Bundle size         ') + pink('│') + chalk.green(' ~4 KB            ') + pink('│') + muted(' ~40 KB           ') + pink('│'));
  console.log(pink('  │') + muted(' Touch gestures      ') + pink('│') + chalk.green(' ✓ Native         ') + pink('│') + chalk.green(' ✓ Native        ') + pink('│'));
  console.log(pink('  │') + muted(' Infinite scroll     ') + pink('│') + chalk.green(' ✓ Built-in       ') + pink('│') + muted(' ✓ Plugin         ') + pink('│'));
  console.log(pink('  │') + muted(' Accessible          ') + pink('│') + chalk.green(' ✓ ARIA native    ') + pink('│') + chalk.red(' ✗ Manual ARIA   ') + pink('│'));
  console.log(pink('  │') + muted(' Modular plugins     ') + pink('│') + chalk.green(' ✓ Composable     ') + pink('│') + muted(' ✓ Modules        ') + pink('│'));
  console.log(pink('  │') + muted(' Zero dependencies   ') + pink('│') + chalk.green(' ✓ Standalone     ') + pink('│') + chalk.red(' ✗ Core required ') + pink('│'));
  console.log(pink('  └─────────────────────┴──────────────────┴─────────────────┘'));

  // ── Torch vs Video.js ──────────────────────────────────────────────────
  console.log();
  console.log(pink('  ┌──────────────────────────────────────────────────────────┐'));
  console.log(pink('  │') + accent('  Torch vs Video.js                                       ') + pink('│'));
  console.log(pink('  ├─────────────────────┬──────────────────┬─────────────────┤'));
  console.log(pink('  │') + muted(' Feature             ') + pink('│') + accent(' Torch            ') + pink('│') + muted(' Video.js         ') + pink('│'));
  console.log(pink('  ├─────────────────────┼──────────────────┼─────────────────┤'));
  console.log(pink('  │') + muted(' React native        ') + pink('│') + chalk.green(' ✓ Hooks + JSX    ') + pink('│') + chalk.red(' ✗ DOM-based     ') + pink('│'));
  console.log(pink('  │') + muted(' Ads integration     ') + pink('│') + chalk.green(' ✓ Built-in       ') + pink('│') + muted(' ✓ Plugin         ') + pink('│'));
  console.log(pink('  │') + muted(' Analytics           ') + pink('│') + chalk.green(' ✓ Built-in       ') + pink('│') + chalk.red(' ✗ Manual         ') + pink('│'));
  console.log(pink('  │') + muted(' Reels/Stories       ') + pink('│') + chalk.green(' ✓ Built-in       ') + pink('│') + chalk.red(' ✗ Not supported ') + pink('│'));
  console.log(pink('  │') + muted(' Bundle size         ') + pink('│') + chalk.green(' ~8 KB            ') + pink('│') + muted(' ~120 KB          ') + pink('│'));
  console.log(pink('  │') + muted(' Audio player        ') + pink('│') + chalk.green(' ✓ Unified API    ') + pink('│') + chalk.red(' ✗ Video only    ') + pink('│'));
  console.log(pink('  └─────────────────────┴──────────────────┴─────────────────┘'));

  // ── Kiln vs Storybook ──────────────────────────────────────────────────
  console.log();
  console.log(pink('  ┌──────────────────────────────────────────────────────────┐'));
  console.log(pink('  │') + accent('  Kiln vs Storybook                                       ') + pink('│'));
  console.log(pink('  ├─────────────────────┬──────────────────┬─────────────────┤'));
  console.log(pink('  │') + muted(' Feature             ') + pink('│') + accent(' Kiln             ') + pink('│') + muted(' Storybook        ') + pink('│'));
  console.log(pink('  ├─────────────────────┼──────────────────┼─────────────────┤'));
  console.log(pink('  │') + muted(' Setup time          ') + pink('│') + chalk.green(' ✓ Zero config    ') + pink('│') + chalk.red(' ✗ Heavy config  ') + pink('│'));
  console.log(pink('  │') + muted(' Bundle size         ') + pink('│') + chalk.green(' ~5 KB            ') + pink('│') + muted(' ~2 MB            ') + pink('│'));
  console.log(pink('  │') + muted(' Live preview        ') + pink('│') + chalk.green(' ✓ Hot reload     ') + pink('│') + chalk.green(' ✓ Hot reload    ') + pink('│'));
  console.log(pink('  │') + muted(' Auto docs           ') + pink('│') + chalk.green(' ✓ From props     ') + pink('│') + muted(' ✓ Addon needed   ') + pink('│'));
  console.log(pink('  │') + muted(' Forge integration   ') + pink('│') + chalk.green(' ✓ Native themes  ') + pink('│') + chalk.red(' ✗ Manual setup  ') + pink('│'));
  console.log(pink('  │') + muted(' Build speed         ') + pink('│') + chalk.green(' ✓ Vite native    ') + pink('│') + chalk.red(' ✗ Webpack based ') + pink('│'));
  console.log(pink('  └─────────────────────┴──────────────────┴─────────────────┘'));
  console.log();

  const choices = [
    { name: 'all', message: `${chalk.bold.hex(COLORS.accent)('⭐ ALL')} ${muted('- Include all ForgeStack packages')}` },
    { name: 'bear', message: `${accent('🐻 Bear UI')} ${muted('- 50+ components, AeroCraft-powered')}` },
    { name: 'grid-table', message: `${accent('📊 Grid Table')} ${muted('- Headless data grid, drag columns, mobile-ready')}` },
    { name: 'forge-query', message: `${accent('🔍 Forge Query')} ${muted('- Auto caching, retry, optimistic updates')}` },
    { name: 'forge-form', message: `${accent('📝 Forge Form')} ${muted('- Validation, multi-step, field arrays')}` },
    { name: 'relay', message: `${accent('📡 Relay')} ${muted('- HTTP client, WebSockets, interceptors')}` },
    { name: 'lingo', message: `${accent('🌐 Lingo')} ${muted('- AI-powered translations, React hooks (replaces i18next)')}` },
    { name: 'rail', message: `${accent('🎠 Rail')} ${muted('- Touch carousel, infinite scroll, accessible (replaces Swiper)')}` },
    { name: 'torch', message: `${accent('🎬 Torch')} ${muted('- Video/audio/reels player, ads, analytics (replaces Video.js)')}` },
    { name: 'kiln', message: `${accent('🏗️  Kiln')} ${muted('- Component docs, live preview (replaces Storybook)')}` },
    { name: 'crucible', message: `${accent('🧪 Crucible')} ${muted('- Testing framework, client + server')}` },
    { name: 'forge-auth', message: `${accent('🔐 Forge Auth')} ${muted('- OAuth, JWT, social login')}` },
  ];

  const response = await (prompt as (options: Record<string, unknown>) => Promise<Record<string, string[]>>)({
    type: 'multiselect',
    name: 'packages',
    message: pink('Select ForgeStack packages:') + muted(' (↑↓ navigate, space select, a toggle all, enter confirm)'),
    hint: muted('(Use <space> to select, <a> to toggle all)'),
    choices,
    initial: [0],
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
    lingo: hasAll || packages.includes('lingo'),
    rail: hasAll || packages.includes('rail'),
    torch: hasAll || packages.includes('torch'),
    kiln: hasAll || packages.includes('kiln'),
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

export const promptIncludeBackend = async (): Promise<boolean> => {
  const response = await prompt<{ backend: boolean }>({
    type: 'confirm',
    name: 'backend',
    message: pink('Include backend API server?'),
    initial: false,
  });
  return response.backend;
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
