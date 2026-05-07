import path from 'path';
import { writeFile, ensureDir, getLatestVersion } from '../utils/index.js';
import type { ProjectConfig } from '../ui/prompts.js';

export const generateReactTemplate = async (
  projectDir: string,
  config: ProjectConfig
): Promise<void> => {
  // Create directory structure
  await ensureDir(path.join(projectDir, 'src'));
  await ensureDir(path.join(projectDir, 'src', 'assets'));
  await ensureDir(path.join(projectDir, 'public'));
  await ensureDir(path.join(projectDir, 'src', 'config'));
  await ensureDir(path.join(projectDir, 'src', 'types'));
  await ensureDir(path.join(projectDir, 'src', 'api'));
  
  // Components with proper structure
  await ensureDir(path.join(projectDir, 'src', 'components'));
  await ensureDir(path.join(projectDir, 'src', 'components', 'Layout'));
  await ensureDir(path.join(projectDir, 'src', 'components', 'common'));
  
  // Pages with proper structure
  await ensureDir(path.join(projectDir, 'src', 'pages'));
  await ensureDir(path.join(projectDir, 'src', 'pages', 'Home'));
  await ensureDir(path.join(projectDir, 'src', 'pages', 'Dashboard'));
  await ensureDir(path.join(projectDir, 'src', 'pages', 'Users'));
  await ensureDir(path.join(projectDir, 'src', 'pages', 'About'));
  await ensureDir(path.join(projectDir, 'src', 'pages', 'Settings'));
  await ensureDir(path.join(projectDir, 'src', 'pages', 'NotFound'));

  // Nuclear for Synapse
  if (config.stateManager === 'synapse') {
    await ensureDir(path.join(projectDir, 'src', 'nuclear'));
    await ensureDir(path.join(projectDir, 'src', 'nuclear', 'config'));
    await ensureDir(path.join(projectDir, 'src', 'nuclear', 'slices'));
    await ensureDir(path.join(projectDir, 'src', 'nuclear', 'slices', 'app'));
    await ensureDir(path.join(projectDir, 'src', 'nuclear', 'slices', 'user'));
  }

  // Store for RTK
  if (config.stateManager === 'rtk') {
    await ensureDir(path.join(projectDir, 'src', 'store'));
    await ensureDir(path.join(projectDir, 'src', 'store', 'slices'));
    await ensureDir(path.join(projectDir, 'src', 'store', 'slices', 'app'));
    await ensureDir(path.join(projectDir, 'src', 'store', 'slices', 'user'));
  }

  // Scripts for generators
  await ensureDir(path.join(projectDir, 'scripts'));

  // Generate files
  await generatePackageJson(projectDir, config);
  await generateTsConfig(projectDir, config);
  await generateViteConfig(projectDir, config);
  await generateIndexHtml(projectDir, config);
  await generateMainTsx(projectDir, config);
  await generateAppTsx(projectDir, config);
  await generateIndexCss(projectDir, config);
  await generateConfigFiles(projectDir, config);
  await generateTypes(projectDir, config);
  await generateApiLayer(projectDir, config);
  await generateComponents(projectDir, config);
  await generatePages(projectDir, config);
  
  if (config.stateManager === 'synapse') {
    await generateNuclearState(projectDir, config);
  }

  if (config.stateManager === 'rtk') {
    await generateRTKState(projectDir, config);
  }

  if (config.includeBackend) {
    await generateBackendServer(projectDir, config);
  }
  
  if (config.includeDocker) {
    await generateDockerFiles(projectDir, config);
  }
  
  await generateGeneratorScripts(projectDir, config);
  await generatePublicAssets(projectDir, config);
  await generateGitIgnore(projectDir);
  await generateEnvFiles(projectDir, config);
  await generateReadme(projectDir, config);
};

// ============================================================================
// package.json - with latest versions from npm
// ============================================================================
async function generatePackageJson(projectDir: string, config: ProjectConfig) {
  // Fetch latest versions
  const versions = await getLatestVersions();
  
  const dependencies: Record<string, string> = {
    react: '^18.3.1',
    'react-dom': '^18.3.1',
  };

  const devDependencies: Record<string, string> = {
    '@types/react': '^18.3.18',
    '@types/react-dom': '^18.3.5',
    '@types/node': '^20.10.0',
    '@vitejs/plugin-react': '^4.3.4',
    typescript: '^5.7.3',
    vite: '^6.0.7',
    eslint: '^9.18.0',
    tsx: '^4.7.0',
    enquirer: '^2.4.1',
    chalk: '^5.3.0',
  };

  dependencies['@forgedevstack/anvil'] = versions.anvil;
  
  if (config.includeBear) {
    dependencies['@forgedevstack/bear'] = versions.bear;
  }

  if (config.cssFramework === 'aerocraft') {
    dependencies['@forgedevstack/aerocraft'] = versions.aerocraft;
  } else if (config.cssFramework === 'tailwind') {
    devDependencies['tailwindcss'] = '^3.4.17';
    devDependencies['autoprefixer'] = '^10.4.20';
    devDependencies['postcss'] = '^8.5.1';
  }
  
  if (config.includeGridTable) {
    dependencies['@forgedevstack/grid-table'] = versions.gridTable;
  }
  
  if (config.includeForgeQuery) {
    dependencies['@forgedevstack/forge-query'] = versions.forgeQuery;
  }
  
  if (config.includeForgeForm) {
    dependencies['@forgedevstack/forge-form'] = versions.forgeForm;
  }
  
  if (config.router === 'compass') {
    dependencies['@forgedevstack/forge-compass'] = versions.forgeCompass;
  } else if (config.router === 'react-router') {
    dependencies['react-router-dom'] = '^6.22.0';
  }
  
  if (config.stateManager === 'synapse') {
    dependencies['@forgedevstack/synapse'] = versions.synapse;
  }

  if (config.stateManager === 'rtk') {
    dependencies['@reduxjs/toolkit'] = '^2.5.0';
    dependencies['react-redux'] = '^9.2.0';
  }

  if (config.includeRelay) {
    dependencies['@forgedevstack/relay'] = versions.relay;
  }

  if (config.includeAuth) {
    dependencies['@forgedevstack/forge-auth'] = versions.forgeAuth;
  }

  if (config.includeLingo) {
    dependencies['@forgedevstack/lingo'] = versions.lingo;
  }

  if (config.includeRail) {
    dependencies['@forgedevstack/rail'] = versions.rail;
  }

  if (config.includeTorch) {
    dependencies['@forgedevstack/torch'] = versions.torch;
  }

  if (config.includeCrucible) {
    devDependencies['@forgedevstack/crucible'] = versions.crucible;
  }

  if (config.includeKiln) {
    devDependencies['@forgedevstack/kiln'] = versions.kiln;
  }

  const scripts: Record<string, string> = {
    dev: 'vite',
    build: 'tsc && vite build',
    preview: 'vite preview',
    lint: 'eslint . --ext ts,tsx',
    'generate:page': 'tsx scripts/generate-page.ts',
    'generate:component': 'tsx scripts/generate-component.ts',
  };

  if (config.stateManager === 'synapse' || config.stateManager === 'rtk') {
    scripts['generate:slice'] = 'tsx scripts/generate-slice.ts';
  }

  if (config.includeBackend) {
    scripts['server:dev'] = 'cd server && npm run dev';
  }

  if (config.includeDocker) {
    scripts['docker:build'] = 'docker build -t ' + config.name + ' .';
    scripts['docker:run'] = 'docker run -p 3000:80 ' + config.name;
    scripts['docker:compose'] = 'docker-compose up -d';
  }

  const packageJson = {
    name: config.name,
    version: '0.1.0',
    private: true,
    type: 'module',
    scripts,
    dependencies,
    devDependencies,
  };

  await writeFile(
    path.join(projectDir, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );
}

async function getLatestVersions(): Promise<Record<string, string>> {
  const packages = [
    { name: 'bear', pkg: '@forgedevstack/bear', fallback: '^1.2.2' },
    { name: 'aerocraft', pkg: '@forgedevstack/aerocraft', fallback: '^1.0.4' },
    { name: 'synapse', pkg: '@forgedevstack/synapse', fallback: '^1.0.2' },
    { name: 'forgeCompass', pkg: '@forgedevstack/forge-compass', fallback: '^1.0.2' },
    { name: 'forgeQuery', pkg: '@forgedevstack/forge-query', fallback: '^1.0.1' },
    { name: 'forgeForm', pkg: '@forgedevstack/forge-form', fallback: '^1.0.0' },
    { name: 'gridTable', pkg: '@forgedevstack/grid-table', fallback: '^1.0.8' },
    { name: 'anvil', pkg: '@forgedevstack/anvil', fallback: '^1.0.6' },
    { name: 'relay', pkg: '@forgedevstack/relay', fallback: '^1.0.0' },
    { name: 'forgeAuth', pkg: '@forgedevstack/forge-auth', fallback: '^1.0.0' },
    { name: 'lingo', pkg: '@forgedevstack/lingo', fallback: '^1.0.0' },
    { name: 'rail', pkg: '@forgedevstack/rail', fallback: '^1.0.0' },
    { name: 'torch', pkg: '@forgedevstack/torch', fallback: '^1.0.0' },
    { name: 'kiln', pkg: '@forgedevstack/kiln', fallback: '^1.0.5' },
    { name: 'crucible', pkg: '@forgedevstack/crucible', fallback: '^1.0.0' },
  ];

  const versions: Record<string, string> = {};

  await Promise.all(
    packages.map(async ({ name, pkg, fallback }) => {
      const version = await getLatestVersion(pkg);
      versions[name] = version || fallback;
    })
  );

  return versions;
}

// ============================================================================
// tsconfig.json
// ============================================================================
async function generateTsConfig(projectDir: string, config: ProjectConfig) {
  const paths: Record<string, string[]> = {
    '@/*': ['./src/*'],
    '@components/*': ['./src/components/*'],
    '@pages/*': ['./src/pages/*'],
    '@api/*': ['./src/api/*'],
    '@config/*': ['./src/config/*'],
    '@types/*': ['./src/types/*'],
    '@assets/*': ['./src/assets/*'],
  };

  if (config.stateManager === 'synapse') {
    paths['@nuclear/*'] = ['./src/nuclear/*'];
    paths['@slices/*'] = ['./src/nuclear/slices/*'];
  }

  if (config.stateManager === 'rtk') {
    paths['@store/*'] = ['./src/store/*'];
    paths['@slices/*'] = ['./src/store/slices/*'];
  }

  const tsconfig = {
    compilerOptions: {
      target: 'ES2020',
      useDefineForClassFields: true,
      lib: ['ES2020', 'DOM', 'DOM.Iterable'],
      module: 'ESNext',
      skipLibCheck: true,
      moduleResolution: 'bundler',
      allowImportingTsExtensions: true,
      resolveJsonModule: true,
      isolatedModules: true,
      noEmit: true,
      jsx: 'react-jsx',
      strict: true,
      noUnusedLocals: true,
      noUnusedParameters: true,
      noFallthroughCasesInSwitch: true,
      baseUrl: '.',
      paths,
    },
    include: ['src', 'scripts'],
    references: [{ path: './tsconfig.node.json' }],
  };

  await writeFile(path.join(projectDir, 'tsconfig.json'), JSON.stringify(tsconfig, null, 2));

  const tsconfigNode = {
    compilerOptions: {
      composite: true,
      skipLibCheck: true,
      module: 'ESNext',
      moduleResolution: 'bundler',
      allowSyntheticDefaultImports: true,
      strict: true,
    },
    include: ['vite.config.ts'],
  };

  await writeFile(path.join(projectDir, 'tsconfig.node.json'), JSON.stringify(tsconfigNode, null, 2));
}

// ============================================================================
// vite.config.ts
// ============================================================================
async function generateViteConfig(projectDir: string, config: ProjectConfig) {
  let stateAlias = '';
  if (config.stateManager === 'synapse') {
    stateAlias = `
      '@nuclear': path.resolve(__dirname, './src/nuclear'),
      '@slices': path.resolve(__dirname, './src/nuclear/slices'),`;
  } else if (config.stateManager === 'rtk') {
    stateAlias = `
      '@store': path.resolve(__dirname, './src/store'),
      '@slices': path.resolve(__dirname, './src/store/slices'),`;
  }

  const viteConfig = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@api': path.resolve(__dirname, './src/api'),
      '@config': path.resolve(__dirname, './src/config'),
      '@types': path.resolve(__dirname, './src/types'),
      '@assets': path.resolve(__dirname, './src/assets'),${stateAlias}
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
`;

  await writeFile(path.join(projectDir, 'vite.config.ts'), viteConfig);
}

// ============================================================================
// index.html
// ============================================================================
async function generateIndexHtml(projectDir: string, config: ProjectConfig) {
  const indexHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/forge.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${config.name}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;

  await writeFile(path.join(projectDir, 'index.html'), indexHtml);
}

// ============================================================================
// main.tsx
// ============================================================================
async function generateMainTsx(projectDir: string, config: ProjectConfig) {
  let imports = `import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './index.css';
`;

  if (config.includeBear) {
    imports += `import '@forgedevstack/bear/styles.css';
import { BearProvider, type BearTheme } from '@forgedevstack/bear';
`;
  }

  if (config.includeGridTable) {
    imports += `import '@forgedevstack/grid-table/grid-table.css';
`;
  }

  if (config.stateManager === 'rtk') {
    imports += `import { Provider } from 'react-redux';
import { store } from '@store/store';
`;
  }

  let themeConfig = '';
  let wrapperStart = '';
  let wrapperEnd = '';

  if (config.stateManager === 'rtk') {
    wrapperStart += `<Provider store={store}>
      `;
    wrapperEnd = `
    </Provider>` + wrapperEnd;
  }

  if (config.includeBear) {
    const primaryColor = config.bearPrimaryColor || '#ec4899';
    themeConfig = `
const theme: Partial<BearTheme> = {
  colors: {
    primary: '${primaryColor}',
  },
};
`;
    wrapperStart += `<BearProvider theme={theme}>
        `;
    wrapperEnd = `
      </BearProvider>` + wrapperEnd;
  }

  const mainTsx = `${imports}${themeConfig}
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    ${wrapperStart}<App />${wrapperEnd}
  </React.StrictMode>
);
`;

  await writeFile(path.join(projectDir, 'src', 'main.tsx'), mainTsx);
}

// ============================================================================
// App.tsx
// ============================================================================
async function generateAppTsx(projectDir: string, config: ProjectConfig) {
  let imports: string[] = [];
  let content = '';

  if (config.router === 'compass') {
    imports.push(`import { CompassProvider, Routes } from '@forgedevstack/forge-compass';`);
    imports.push(`import { routes } from '@config/routes';`);
    imports.push(`import { Layout } from '@components/Layout';`);
    
    content = `<CompassProvider routes={routes} devTools={import.meta.env.DEV}>
      <Layout>
        <Routes />
      </Layout>
    </CompassProvider>`;
  } else if (config.router === 'react-router') {
    imports.push(`import { BrowserRouter, Routes, Route } from 'react-router-dom';`);
    imports.push(`import { Layout } from '@components/Layout';`);
    imports.push(`import { HomePage } from '@pages/Home';`);
    imports.push(`import { DashboardPage } from '@pages/Dashboard';`);
    imports.push(`import { UsersPage } from '@pages/Users';`);
    imports.push(`import { AboutPage } from '@pages/About';`);
    imports.push(`import { SettingsPage } from '@pages/Settings';`);
    imports.push(`import { NotFoundPage } from '@pages/NotFound';`);
    
    content = `<BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>`;
  } else {
    imports.push(`import { Layout } from '@components/Layout';`);
    imports.push(`import { HomePage } from '@pages/Home';`);
    content = `<Layout>
      <HomePage />
    </Layout>`;
  }

  const appTsx = `${imports.join('\n')}

export const App = () => {
  return (
    ${content}
  );
};
`;

  await writeFile(path.join(projectDir, 'src', 'App.tsx'), appTsx);
}

// ============================================================================
// index.css
// ============================================================================
async function generateIndexCss(projectDir: string, config: ProjectConfig) {
  const primaryColor = config.bearPrimaryColor || '#ec4899';
  
  const indexCss = `:root {
  --primary: ${primaryColor};
  --bg: #09090b;
  --bg-secondary: #18181b;
  --text: #fafafa;
  --text-muted: #a1a1aa;
  --border: #27272a;
}

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: system-ui, sans-serif;
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
}

a { color: var(--primary); text-decoration: none; }
a:hover { text-decoration: underline; }

.app-layout { display: flex; flex-direction: column; min-height: 100vh; }
.app-header { position: sticky; top: 0; z-index: 100; background: var(--bg-secondary); border-bottom: 1px solid var(--border); }
.app-nav { display: flex; align-items: center; height: 64px; padding: 0 1.5rem; max-width: 1200px; margin: 0 auto; width: 100%; }
.app-nav-links { display: flex; gap: 1.5rem; margin-left: 2rem; }
.app-nav-link { color: var(--text-muted); font-weight: 500; }
.app-nav-link:hover, .app-nav-link[data-active="true"] { color: var(--text); text-decoration: none; }
.app-main { flex: 1; padding: 2rem 1.5rem; max-width: 1200px; margin: 0 auto; width: 100%; }

.page-header { margin-bottom: 2rem; }
.page-title { font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem; }
.page-subtitle { color: var(--text-muted); }
.card-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; margin-top: 2rem; }
`;

  await writeFile(path.join(projectDir, 'src', 'index.css'), indexCss);
}

// ============================================================================
// Config files
// ============================================================================
async function generateConfigFiles(projectDir: string, config: ProjectConfig) {
  // env.ts
  const envTs = `export const ENV = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  APP_NAME: import.meta.env.VITE_APP_NAME || '${config.name}',
  IS_DEV: import.meta.env.DEV,
} as const;
`;

  await writeFile(path.join(projectDir, 'src', 'config', 'env.ts'), envTs);

  // constants.ts
  const constantsTs = `export const APP = {
  NAME: '${config.name}',
  VERSION: '0.1.0',
} as const;
`;

  await writeFile(path.join(projectDir, 'src', 'config', 'constants.ts'), constantsTs);

  // routes.tsx
  if (config.router === 'compass') {
    const routesTsx = `import { lazy } from 'react';
import type { RouteConfig } from '@forgedevstack/forge-compass';

const HomePage = lazy(() => import('@pages/Home').then(m => ({ default: m.HomePage })));
const DashboardPage = lazy(() => import('@pages/Dashboard').then(m => ({ default: m.DashboardPage })));
const UsersPage = lazy(() => import('@pages/Users').then(m => ({ default: m.UsersPage })));
const AboutPage = lazy(() => import('@pages/About').then(m => ({ default: m.AboutPage })));
const SettingsPage = lazy(() => import('@pages/Settings').then(m => ({ default: m.SettingsPage })));
const NotFoundPage = lazy(() => import('@pages/NotFound').then(m => ({ default: m.NotFoundPage })));

export const routes: RouteConfig[] = [
  { path: '/', name: 'home', component: HomePage, meta: { title: 'Home' } },
  { path: '/dashboard', name: 'dashboard', component: DashboardPage, meta: { title: 'Dashboard' } },
  { path: '/users', name: 'users', component: UsersPage, meta: { title: 'Users' } },
  { path: '/about', name: 'about', component: AboutPage, meta: { title: 'About' } },
  { path: '/settings', name: 'settings', component: SettingsPage, meta: { title: 'Settings' } },
  { path: '*', name: 'not-found', component: NotFoundPage, meta: { title: 'Not Found' } },
];
`;
    await writeFile(path.join(projectDir, 'src', 'config', 'routes.tsx'), routesTsx);
  }

  // i18n.ts (Lingo translations — centralized)
  if (config.includeLingo) {
    const i18nTs = `export const translations = {
  en: {
    // ── Home ───────────────────────────────────
    home: {
      title: 'Welcome to ${config.name}',
      subtitle: 'Built with ForgeStack',
      getStarted: 'Get Started',
      viewUsers: 'View Users',
    },
    // ── Dashboard ──────────────────────────────
    dashboard: {
      title: 'Dashboard',
      subtitle: 'State management demo',
      counter: 'Counter',
      loadingState: 'Loading State',
      loading: 'Loading...',
      ready: 'Ready',
      simulate: 'Simulate',
    },
    // ── Users ──────────────────────────────────
    users: {
      title: 'Users',
      subtitle: 'Manage your users with Grid Table',
      name: 'Name',
      email: 'Email',
      role: 'Role',
      created: 'Created',
    },
    // ── About ──────────────────────────────────
    about: {
      title: 'About',
      techStack: 'Tech Stack',
    },
    // ── Settings ───────────────────────────────
    settings: {
      title: 'Settings',
      notifications: 'Notifications',
      receiveAlerts: 'Receive alerts',
      save: 'Save',
      cancel: 'Cancel',
    },
    // ── NotFound ───────────────────────────────
    notFound: {
      title: 'Page Not Found',
      goHome: 'Go Home',
    },
  },
} as const;

export type TranslationKeys = typeof translations.en;
`;
    await writeFile(path.join(projectDir, 'src', 'config', 'i18n.ts'), i18nTs);
  }

  // index.ts
  await writeFile(path.join(projectDir, 'src', 'config', 'index.ts'), `export * from './env';
export * from './constants';
${config.router === 'compass' ? "export * from './routes';" : ''}
${config.includeLingo ? "export { translations } from './i18n';" : ''}
`);
}

// ============================================================================
// Types
// ============================================================================
async function generateTypes(projectDir: string, _config: ProjectConfig) {
  const commonTypes = `export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  avatar?: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}
`;

  await writeFile(path.join(projectDir, 'src', 'types', 'common.types.ts'), commonTypes);
  await writeFile(path.join(projectDir, 'src', 'types', 'index.ts'), `export * from './common.types';
`);

  const envDts = `/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_APP_NAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
`;

  await writeFile(path.join(projectDir, 'src', 'vite-env.d.ts'), envDts);
}

// ============================================================================
// API Layer - Using Synapse useQuery/useMutation
// ============================================================================
async function generateApiLayer(projectDir: string, config: ProjectConfig) {
  const useSynapse = config.stateManager === 'synapse';
  
  // api/client.ts
  const apiClient = `import { ENV } from '@config/env';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getHeaders(): Headers {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const token = localStorage.getItem('token');
    if (token) headers.set('Authorization', \`Bearer \${token}\`);
    return headers;
  }

  async get<T>(endpoint: string): Promise<T> {
    const res = await fetch(\`\${this.baseUrl}\${endpoint}\`, { headers: this.getHeaders() });
    if (!res.ok) throw new Error(res.statusText);
    return res.json();
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    const res = await fetch(\`\${this.baseUrl}\${endpoint}\`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });
    if (!res.ok) throw new Error(res.statusText);
    return res.json();
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    const res = await fetch(\`\${this.baseUrl}\${endpoint}\`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });
    if (!res.ok) throw new Error(res.statusText);
    return res.json();
  }

  async delete<T>(endpoint: string): Promise<T> {
    const res = await fetch(\`\${this.baseUrl}\${endpoint}\`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error(res.statusText);
    return res.json();
  }
}

export const api = new ApiClient(ENV.API_URL);
`;

  await writeFile(path.join(projectDir, 'src', 'api', 'client.ts'), apiClient);

  // api/users.ts - Using Synapse hooks
  if (useSynapse) {
    const usersApi = `/**
 * Users API - Using Synapse useQuery/useMutation
 */

import { useQuery, useMutation } from '@forgedevstack/synapse';
import { api } from './client';
import type { User } from '@types/index';

// Fetch all users
export const useUsers = () => {
  return useQuery<User[]>(
    () => api.get('/users'),
    { refetchOnFocus: true }
  );
};

// Fetch single user
export const useUser = (id: string) => {
  return useQuery<User>(
    () => api.get(\`/users/\${id}\`),
    { skip: !id }
  );
};

// Create user
export const useCreateUser = (options?: { onSuccess?: (user: User) => void }) => {
  return useMutation<User, Partial<User>>(
    (data) => api.post('/users', data),
    options
  );
};

// Update user
export const useUpdateUser = (id: string, options?: { onSuccess?: (user: User) => void }) => {
  return useMutation<User, Partial<User>>(
    (data) => api.put(\`/users/\${id}\`, data),
    options
  );
};

// Delete user
export const useDeleteUser = (options?: { onSuccess?: () => void }) => {
  return useMutation<void, string>(
    (id) => api.delete(\`/users/\${id}\`),
    options
  );
};
`;

    await writeFile(path.join(projectDir, 'src', 'api', 'users.ts'), usersApi);
  }

  await writeFile(path.join(projectDir, 'src', 'api', 'index.ts'), `export { api } from './client';
${useSynapse ? "export * from './users';" : ''}
`);
}

// ============================================================================
// Components — Structure: Name/ > index.ts, Name.tsx, Name.types.ts
// ============================================================================
async function generateComponents(projectDir: string, config: ProjectConfig) {
  const useBear = config.includeBear;
  
  // ── Layout ─────────────────────────────────────────────────────────────
  // Layout.types.ts
  await writeFile(path.join(projectDir, 'src', 'components', 'Layout', 'Layout.types.ts'),
`import { ReactNode } from 'react';

export interface LayoutProps {
  children: ReactNode;
}
`);

  let layoutImports = `import { Suspense } from 'react';
import type { LayoutProps } from './Layout.types';`;
  let navLink = '';
  
  if (config.router === 'compass') {
    layoutImports += `\nimport { NavLink } from '@forgedevstack/forge-compass';`;
    navLink = `<NavLink to="$PATH" className="app-nav-link">$TEXT</NavLink>`;
  } else if (config.router === 'react-router') {
    layoutImports += `\nimport { NavLink } from 'react-router-dom';`;
    navLink = `<NavLink to="$PATH" className={({ isActive }) => \`app-nav-link\${isActive ? ' active' : ''}\`}>$TEXT</NavLink>`;
  }
  
  if (useBear) {
    layoutImports += `\nimport { Typography, Skeleton, Flex } from '@forgedevstack/bear';`;
  }

  const navLinks = config.router !== 'none' ? `
          <div className="app-nav-links">
            ${navLink.replace('$PATH', '/').replace('$TEXT', 'Home')}
            ${navLink.replace('$PATH', '/dashboard').replace('$TEXT', 'Dashboard')}
            ${navLink.replace('$PATH', '/users').replace('$TEXT', 'Users')}
            ${navLink.replace('$PATH', '/about').replace('$TEXT', 'About')}
          </div>` : '';

  const loadingFallback = useBear 
    ? `<Flex direction="column" gap={16}><Skeleton height={40} width="60%" /><Skeleton height={24} width="40%" /></Flex>`
    : `<div>Loading...</div>`;

  const layoutTsx = `${layoutImports}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="app-layout">
      <header className="app-header">
        <nav className="app-nav">
          ${useBear ? `<Typography variant="h4" style={{ fontWeight: 700 }}>${config.name}</Typography>` : `<h2 style={{ fontWeight: 700 }}>${config.name}</h2>`}${navLinks}
        </nav>
      </header>
      <main className="app-main">
        <Suspense fallback={${loadingFallback}}>
          {children}
        </Suspense>
      </main>
    </div>
  );
};
`;

  await writeFile(path.join(projectDir, 'src', 'components', 'Layout', 'Layout.tsx'), layoutTsx);
  await writeFile(path.join(projectDir, 'src', 'components', 'Layout', 'index.ts'), `export { Layout } from './Layout';
export type { LayoutProps } from './Layout.types';
`);

  // ── FeatureCard ────────────────────────────────────────────────────────
  await ensureDir(path.join(projectDir, 'src', 'components', 'common', 'FeatureCard'));

  // FeatureCard.types.ts
  await writeFile(path.join(projectDir, 'src', 'components', 'common', 'FeatureCard', 'FeatureCard.types.ts'),
`export interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}
`);

  const featureCardTsx = useBear ? `import { Card, CardBody, Typography, Flex } from '@forgedevstack/bear';
import type { FeatureCardProps } from './FeatureCard.types';

export const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <Card hoverable>
    <CardBody>
      <Flex direction="column" gap={12}>
        <span style={{ fontSize: '2rem' }}>{icon}</span>
        <Typography variant="h5" style={{ fontWeight: 600 }}>{title}</Typography>
        <Typography variant="body2" color="muted">{description}</Typography>
      </Flex>
    </CardBody>
  </Card>
);
` : `import type { FeatureCardProps } from './FeatureCard.types';

export const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 12, padding: 24 }}>
    <span style={{ fontSize: '2rem' }}>{icon}</span>
    <h3 style={{ fontWeight: 600, marginTop: 12 }}>{title}</h3>
    <p style={{ color: 'var(--text-muted)', marginTop: 8 }}>{description}</p>
  </div>
);
`;

  await writeFile(path.join(projectDir, 'src', 'components', 'common', 'FeatureCard', 'FeatureCard.tsx'), featureCardTsx);
  await writeFile(path.join(projectDir, 'src', 'components', 'common', 'FeatureCard', 'index.ts'), `export { FeatureCard } from './FeatureCard';
export type { FeatureCardProps } from './FeatureCard.types';
`);

  await writeFile(path.join(projectDir, 'src', 'components', 'common', 'index.ts'), `export * from './FeatureCard';
`);

  await writeFile(path.join(projectDir, 'src', 'components', 'index.ts'), `export * from './Layout';
export * from './common';
`);
}

// ============================================================================
// Pages — Structure: Name/ > index.ts, Name.tsx, Name.types.ts, Name.const.ts
//         Lingo translations are centralized in config/i18n.ts
// ============================================================================
async function generatePages(projectDir: string, config: ProjectConfig) {
  const useBear = config.includeBear;
  const useGridTable = config.includeGridTable;
  const useSynapse = config.stateManager === 'synapse';
  const useRTK = config.stateManager === 'rtk';
  const useLingo = config.includeLingo;

  // ── Home Page ──────────────────────────────────────────────────────────
  // Home.types.ts
  await writeFile(path.join(projectDir, 'src', 'pages', 'Home', 'Home.types.ts'),
`export interface Feature {
  icon: string;
  title: string;
  description: string;
}
`);

  // Home.const.ts
  await writeFile(path.join(projectDir, 'src', 'pages', 'Home', 'Home.const.ts'),
`import type { Feature } from './Home.types';

export const FEATURES: Feature[] = [
  { icon: '⚡', title: 'Lightning Fast', description: 'Built with Vite for instant HMR.' },
  { icon: '🎨', title: 'Beautiful UI', description: 'Powered by Bear UI.' },
  { icon: '🔒', title: 'Type Safe', description: 'Full TypeScript support.' },
  { icon: '📦', title: 'Modular', description: 'Clean architecture.' },
];
`);

  // Home.tsx
  const homeImports: string[] = [];
  if (useBear) homeImports.push(`import { Typography, Button, Flex } from '@forgedevstack/bear';`);
  if (config.router === 'compass') homeImports.push(`import { useNavigate } from '@forgedevstack/forge-compass';`);
  homeImports.push(`import { FeatureCard } from '@components/common';`);
  homeImports.push(`import { FEATURES } from './Home.const';`);
  if (useLingo) homeImports.push(`import { translations } from '@config/i18n';`);

  const homeTitleText = useLingo ? `translations.en.home.title` : `'Welcome to ${config.name}'`;
  const homeSubText = useLingo ? `translations.en.home.subtitle` : `'Built with ForgeStack'`;
  const homeGetStartedText = useLingo ? `{translations.en.home.getStarted}` : 'Get Started';
  const homeViewUsersText = useLingo ? `{translations.en.home.viewUsers}` : 'View Users';

  const homePage = useBear ? `${homeImports.join('\n')}

export const HomePage = () => {
  ${config.router === 'compass' ? `const navigate = useNavigate();\n` : ''}
  return (
    <>
      <div className="page-header">
        <Typography variant="h1" className="page-title">{${homeTitleText}}</Typography>
        <Typography variant="body1" className="page-subtitle">{${homeSubText}}</Typography>
      </div>
      <Flex gap={16} style={{ marginTop: 24 }}>
        <Button variant="primary"${config.router === 'compass' ? ` onClick={() => navigate('/dashboard')}` : ''}>${homeGetStartedText}</Button>
        <Button variant="outline"${config.router === 'compass' ? ` onClick={() => navigate('/users')}` : ''}>${homeViewUsersText}</Button>
      </Flex>
      <div className="card-grid">
        {FEATURES.map((f) => <FeatureCard key={f.title} {...f} />)}
      </div>
    </>
  );
};
` : `${homeImports.join('\n')}

export const HomePage = () => (
  <>
    <div className="page-header">
      <h1 className="page-title">{${homeTitleText}}</h1>
      <p className="page-subtitle">{${homeSubText}}</p>
    </div>
    <div className="card-grid">
      {FEATURES.map((f) => <FeatureCard key={f.title} {...f} />)}
    </div>
  </>
);
`;

  await writeFile(path.join(projectDir, 'src', 'pages', 'Home', 'Home.tsx'), homePage);
  await writeFile(path.join(projectDir, 'src', 'pages', 'Home', 'index.ts'), `export { HomePage } from './Home';
export type { Feature } from './Home.types';
`);

  // ── Dashboard Page ─────────────────────────────────────────────────────

  // Dashboard.types.ts
  await writeFile(path.join(projectDir, 'src', 'pages', 'Dashboard', 'Dashboard.types.ts'),
`export interface DashboardProps {}
`);

  // Dashboard.const.ts
  await writeFile(path.join(projectDir, 'src', 'pages', 'Dashboard', 'Dashboard.const.ts'),
`export const SIMULATE_DELAY = 2000;
`);

  let dashboardPage: string;

  if (useBear && (useSynapse || useRTK)) {
    const stateImport = useSynapse
      ? `import { useAppNucleus } from '@slices/app';`
      : `import { useAppSelector, useAppDispatch } from '@store/store';
import { selectCount, selectIsLoading, increment, decrement, reset, setLoading } from '@slices/app';`;

    const stateLabel = useSynapse ? 'Synapse' : 'Redux Toolkit';
    const lingoImport = useLingo ? `\nimport { translations } from '@config/i18n';` : '';
    const t = (key: string, fallback: string) => useLingo ? `{translations.en.dashboard.${key}}` : fallback;
    const tExpr = (key: string, fallback: string) => useLingo ? `translations.en.dashboard.${key}` : `'${fallback}'`;

    if (useSynapse) {
      dashboardPage = `import { Typography, Card, CardBody, Button, Flex, Badge } from '@forgedevstack/bear';
${stateImport}
import { SIMULATE_DELAY } from './Dashboard.const';${lingoImport}

export const DashboardPage = () => {
  const { count, increment, decrement, reset, isLoading, setLoading } = useAppNucleus();

  return (
    <>
      <div className="page-header">
        <Flex align="center" gap={12}>
          <Typography variant="h1" className="page-title">${t('title', 'Dashboard')}</Typography>
          <Badge variant="success">${stateLabel}</Badge>
        </Flex>
        <Typography variant="body1" className="page-subtitle">${t('subtitle', 'State management demo')}</Typography>
      </div>

      <div className="card-grid">
        <Card>
          <CardBody>
            <Typography variant="h4" style={{ marginBottom: 16 }}>${t('counter', 'Counter')}</Typography>
            <Typography variant="h2" style={{ textAlign: 'center', marginBottom: 16 }}>{count}</Typography>
            <Flex gap={8} justify="center">
              <Button onClick={decrement} variant="outline">-</Button>
              <Button onClick={increment} variant="primary">+</Button>
              <Button onClick={reset} variant="ghost">Reset</Button>
            </Flex>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Typography variant="h4" style={{ marginBottom: 16 }}>${t('loadingState', 'Loading State')}</Typography>
            <Badge variant={isLoading ? 'warning' : 'success'}>{isLoading ? ${tExpr('loading', 'Loading...')} : ${tExpr('ready', 'Ready')}}</Badge>
            <Button 
              onClick={() => { setLoading(true); setTimeout(() => setLoading(false), SIMULATE_DELAY); }}
              variant="outline"
              style={{ marginTop: 16 }}
            >
              ${t('simulate', 'Simulate')}
            </Button>
          </CardBody>
        </Card>
      </div>
    </>
  );
};
`;
    } else {
      dashboardPage = `import { Typography, Card, CardBody, Button, Flex, Badge } from '@forgedevstack/bear';
${stateImport}
import { SIMULATE_DELAY } from './Dashboard.const';${lingoImport}

export const DashboardPage = () => {
  const dispatch = useAppDispatch();
  const count = useAppSelector(selectCount);
  const isLoading = useAppSelector(selectIsLoading);

  return (
    <>
      <div className="page-header">
        <Flex align="center" gap={12}>
          <Typography variant="h1" className="page-title">${t('title', 'Dashboard')}</Typography>
          <Badge variant="success">${stateLabel}</Badge>
        </Flex>
        <Typography variant="body1" className="page-subtitle">${t('subtitle', 'State management demo')}</Typography>
      </div>

      <div className="card-grid">
        <Card>
          <CardBody>
            <Typography variant="h4" style={{ marginBottom: 16 }}>${t('counter', 'Counter')}</Typography>
            <Typography variant="h2" style={{ textAlign: 'center', marginBottom: 16 }}>{count}</Typography>
            <Flex gap={8} justify="center">
              <Button onClick={() => dispatch(decrement())} variant="outline">-</Button>
              <Button onClick={() => dispatch(increment())} variant="primary">+</Button>
              <Button onClick={() => dispatch(reset())} variant="ghost">Reset</Button>
            </Flex>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Typography variant="h4" style={{ marginBottom: 16 }}>${t('loadingState', 'Loading State')}</Typography>
            <Badge variant={isLoading ? 'warning' : 'success'}>{isLoading ? ${tExpr('loading', 'Loading...')} : ${tExpr('ready', 'Ready')}}</Badge>
            <Button 
              onClick={() => { dispatch(setLoading(true)); setTimeout(() => dispatch(setLoading(false)), SIMULATE_DELAY); }}
              variant="outline"
              style={{ marginTop: 16 }}
            >
              ${t('simulate', 'Simulate')}
            </Button>
          </CardBody>
        </Card>
      </div>
    </>
  );
};
`;
    }
  } else {
    dashboardPage = `import { useState } from 'react';

export const DashboardPage = () => {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
      </div>
      <div style={{ background: 'var(--bg-secondary)', padding: 24, borderRadius: 12, textAlign: 'center' }}>
        <h2 style={{ fontSize: '3rem', marginBottom: 16 }}>{count}</h2>
        <button onClick={() => setCount(c => c - 1)}>-</button>
        <button onClick={() => setCount(c => c + 1)}>+</button>
        <button onClick={() => setCount(0)}>Reset</button>
      </div>
    </>
  );
};
`;
  }

  await writeFile(path.join(projectDir, 'src', 'pages', 'Dashboard', 'Dashboard.tsx'), dashboardPage);
  await writeFile(path.join(projectDir, 'src', 'pages', 'Dashboard', 'index.ts'), `export { DashboardPage } from './Dashboard';
`);

  // ── Users Page ─────────────────────────────────────────────────────────
  // Users.types.ts
  await writeFile(path.join(projectDir, 'src', 'pages', 'Users', 'Users.types.ts'),
`export interface UsersPageProps {}
`);

  // Users.const.ts
  await writeFile(path.join(projectDir, 'src', 'pages', 'Users', 'Users.const.ts'),
`import type { User } from '@types/index';

export const MOCK_USERS: User[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'admin', createdAt: '2024-01-15' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'user', createdAt: '2024-02-20' },
  { id: '3', name: 'Bob Wilson', email: 'bob@example.com', role: 'user', createdAt: '2024-03-10' },
  { id: '4', name: 'Alice Brown', email: 'alice@example.com', role: 'admin', createdAt: '2024-04-05' },
  { id: '5', name: 'Charlie Davis', email: 'charlie@example.com', role: 'user', createdAt: '2024-05-12' },
];
`);

  let usersPage = '';
  
  if (useGridTable) {
    usersPage = `import { GridTable, type ColumnDefinition } from '@forgedevstack/grid-table';
${useBear ? `import { Typography, Card, CardBody, Badge } from '@forgedevstack/bear';` : ''}
import type { User } from '@types/index';
import { MOCK_USERS } from './Users.const';
${useLingo ? `import { translations } from '@config/i18n';\n` : ''}
const columns: ColumnDefinition<User>[] = [
  { id: 'name', accessor: 'name', header: 'Name', sortable: true, filterable: true },
  { id: 'email', accessor: 'email', header: 'Email', sortable: true },
  {
    id: 'role', accessor: 'role', header: 'Role',
    filterType: 'select',
    filterOptions: [{ value: 'admin', label: 'Admin' }, { value: 'user', label: 'User' }],
    ${useBear ? `cell: ({ value }) => <Badge variant={value === 'admin' ? 'primary' : 'secondary'}>{value}</Badge>,` : ''}
  },
  { id: 'createdAt', accessor: 'createdAt', header: 'Created', cell: ({ value }) => new Date(value).toLocaleDateString() },
];

export const UsersPage = () => (
  <>
    <div className="page-header">
      ${useBear ? `<Typography variant="h1" className="page-title">${useLingo ? '{translations.en.users.title}' : 'Users'}</Typography>
      <Typography variant="body1" className="page-subtitle">${useLingo ? '{translations.en.users.subtitle}' : 'Manage your users with Grid Table'}</Typography>` : `<h1 className="page-title">Users</h1>`}
    </div>
    ${useBear ? `<Card style={{ marginTop: 24 }}>
      <CardBody style={{ padding: 0, overflow: 'hidden' }}>
        <GridTable data={MOCK_USERS} columns={columns} enableRowSelection showPagination showFilter pageSize={10} />
      </CardBody>
    </Card>` : `<GridTable data={MOCK_USERS} columns={columns} showPagination />`}
  </>
);
`;
  } else {
    usersPage = useBear ? `import { Typography, Card, CardBody } from '@forgedevstack/bear';

export const UsersPage = () => (
  <>
    <div className="page-header">
      <Typography variant="h1" className="page-title">Users</Typography>
      <Typography variant="body1" className="page-subtitle">User management</Typography>
    </div>
    <Card>
      <CardBody>
        <Typography variant="body1">Add @forgedevstack/grid-table for a powerful data grid!</Typography>
      </CardBody>
    </Card>
  </>
);
` : `export const UsersPage = () => (
  <>
    <div className="page-header"><h1 className="page-title">Users</h1></div>
    <p>Add grid-table for data management</p>
  </>
);
`;
  }

  await writeFile(path.join(projectDir, 'src', 'pages', 'Users', 'Users.tsx'), usersPage);
  await writeFile(path.join(projectDir, 'src', 'pages', 'Users', 'index.ts'), `export { UsersPage } from './Users';
`);

  // ── About Page ─────────────────────────────────────────────────────────
  // About.types.ts
  await writeFile(path.join(projectDir, 'src', 'pages', 'About', 'About.types.ts'),
`export interface AboutPageProps {}
`);

  // About.const.ts
  const techStack = ['React 18 + TypeScript', 'Vite'];
  if (config.includeBear) techStack.push('Bear UI');
  if (config.router === 'compass') techStack.push('Forge Compass');
  if (useSynapse) techStack.push('Synapse');
  if (useRTK) techStack.push('Redux Toolkit');
  if (useGridTable) techStack.push('Grid Table');
  techStack.push('Anvil Utils');

  await writeFile(path.join(projectDir, 'src', 'pages', 'About', 'About.const.ts'),
`export const TECH_STACK = ${JSON.stringify(techStack, null, 2)};
`);

  const aboutPage = useBear ? `import { Typography, Card, CardBody } from '@forgedevstack/bear';
import { TECH_STACK } from './About.const';
${useLingo ? `import { translations } from '@config/i18n';\n` : ''}
export const AboutPage = () => (
  <>
    <div className="page-header">
      <Typography variant="h1" className="page-title">${useLingo ? '{translations.en.about.title}' : 'About'}</Typography>
    </div>
    <Card>
      <CardBody>
        <Typography variant="h4" style={{ marginBottom: 16 }}>${useLingo ? '{translations.en.about.techStack}' : 'Tech Stack'}</Typography>
        <ul style={{ listStyle: 'none' }}>
          {TECH_STACK.map(t => <li key={t} style={{ padding: '8px 0', color: 'var(--text-muted)' }}>✓ {t}</li>)}
        </ul>
      </CardBody>
    </Card>
  </>
);
` : `import { TECH_STACK } from './About.const';

export const AboutPage = () => (
  <>
    <div className="page-header"><h1 className="page-title">About</h1></div>
    <ul style={{ listStyle: 'none' }}>
      {TECH_STACK.map(t => <li key={t} style={{ padding: '8px 0' }}>✓ {t}</li>)}
    </ul>
  </>
);
`;

  await writeFile(path.join(projectDir, 'src', 'pages', 'About', 'About.tsx'), aboutPage);
  await writeFile(path.join(projectDir, 'src', 'pages', 'About', 'index.ts'), `export { AboutPage } from './About';
`);

  // ── Settings Page ──────────────────────────────────────────────────────
  await writeFile(path.join(projectDir, 'src', 'pages', 'Settings', 'Settings.types.ts'),
`export interface SettingsPageProps {}
`);

  await writeFile(path.join(projectDir, 'src', 'pages', 'Settings', 'Settings.const.ts'),
`export const DEFAULT_NOTIFICATIONS = true;
`);

  const settingsPage = useBear ? `import { useState } from 'react';
import { Typography, Card, CardBody, Button, Flex, Switch } from '@forgedevstack/bear';
import { DEFAULT_NOTIFICATIONS } from './Settings.const';
${useLingo ? `import { translations } from '@config/i18n';\n` : ''}
export const SettingsPage = () => {
  const [notifications, setNotifications] = useState(DEFAULT_NOTIFICATIONS);

  return (
    <>
      <div className="page-header">
        <Typography variant="h1" className="page-title">${useLingo ? '{translations.en.settings.title}' : 'Settings'}</Typography>
      </div>
      <Card>
        <CardBody>
          <Flex justify="space-between" align="center">
            <div>
              <Typography variant="body1">${useLingo ? '{translations.en.settings.notifications}' : 'Notifications'}</Typography>
              <Typography variant="body2" color="muted">${useLingo ? '{translations.en.settings.receiveAlerts}' : 'Receive alerts'}</Typography>
            </div>
            <Switch checked={notifications} onChange={(e) => setNotifications(e.target.checked)} />
          </Flex>
        </CardBody>
      </Card>
      <Flex gap={12} style={{ marginTop: 24 }}>
        <Button variant="primary">${useLingo ? '{translations.en.settings.save}' : 'Save'}</Button>
        <Button variant="outline">${useLingo ? '{translations.en.settings.cancel}' : 'Cancel'}</Button>
      </Flex>
    </>
  );
};
` : `export const SettingsPage = () => (
  <>
    <div className="page-header"><h1 className="page-title">Settings</h1></div>
  </>
);
`;

  await writeFile(path.join(projectDir, 'src', 'pages', 'Settings', 'Settings.tsx'), settingsPage);
  await writeFile(path.join(projectDir, 'src', 'pages', 'Settings', 'index.ts'), `export { SettingsPage } from './Settings';
`);

  // ── NotFound Page ──────────────────────────────────────────────────────
  await writeFile(path.join(projectDir, 'src', 'pages', 'NotFound', 'NotFound.types.ts'),
`export interface NotFoundPageProps {}
`);

  await writeFile(path.join(projectDir, 'src', 'pages', 'NotFound', 'NotFound.const.ts'),
`export const ERROR_CODE = '404';
`);

  const notFoundPage = useBear ? `import { Typography, Button, Flex } from '@forgedevstack/bear';
${config.router === 'compass' ? `import { useNavigate } from '@forgedevstack/forge-compass';\n` : ''}import { ERROR_CODE } from './NotFound.const';
${useLingo ? `import { translations } from '@config/i18n';\n` : ''}
export const NotFoundPage = () => {
  ${config.router === 'compass' ? `const navigate = useNavigate();\n` : ''}
  return (
    <Flex direction="column" align="center" justify="center" style={{ minHeight: '60vh', textAlign: 'center' }}>
      <Typography variant="h1" style={{ fontSize: '6rem' }}>{ERROR_CODE}</Typography>
      <Typography variant="h3">${useLingo ? '{translations.en.notFound.title}' : 'Page Not Found'}</Typography>
      <Button variant="primary" style={{ marginTop: 32 }}${config.router === 'compass' ? ` onClick={() => navigate('/')}` : ''}>${useLingo ? '{translations.en.notFound.goHome}' : 'Go Home'}</Button>
    </Flex>
  );
};
` : `import { ERROR_CODE } from './NotFound.const';

export const NotFoundPage = () => (
  <div style={{ textAlign: 'center', paddingTop: '20vh' }}>
    <h1 style={{ fontSize: '6rem' }}>{ERROR_CODE}</h1>
    <a href="/">Go Home</a>
  </div>
);
`;

  await writeFile(path.join(projectDir, 'src', 'pages', 'NotFound', 'NotFound.tsx'), notFoundPage);
  await writeFile(path.join(projectDir, 'src', 'pages', 'NotFound', 'index.ts'), `export { NotFoundPage } from './NotFound';
`);

  // Pages barrel index
  await writeFile(path.join(projectDir, 'src', 'pages', 'index.ts'), `export * from './Home';
export * from './Dashboard';
export * from './Users';
export * from './About';
export * from './Settings';
export * from './NotFound';
`);
}

// ============================================================================
// Nuclear State (Synapse)
// ============================================================================
async function generateNuclearState(projectDir: string, _config: ProjectConfig) {
  // config/nuclear.config.ts
  const nuclearConfig = `import type { SynapseConfig } from '@forgedevstack/synapse';

export const nuclearConfig: SynapseConfig = {
  devtools: import.meta.env.DEV,
  devtoolsName: 'Nuclear',
  logging: import.meta.env.DEV,
};
`;

  await writeFile(path.join(projectDir, 'src', 'nuclear', 'config', 'nuclear.config.ts'), nuclearConfig);
  await writeFile(path.join(projectDir, 'src', 'nuclear', 'config', 'index.ts'), `export * from './nuclear.config';
`);

  // slices/app
  const appNucleus = `import { createNucleus } from '@forgedevstack/synapse';
import { nuclearConfig } from '@nuclear/config';

interface AppState {
  count: number;
  isLoading: boolean;
  error: string | null;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const appNucleus = createNucleus<AppState>(
  (set) => ({
    count: 0,
    isLoading: false,
    error: null,
    increment: () => set((s) => ({ count: s.count + 1 })),
    decrement: () => set((s) => ({ count: s.count - 1 })),
    reset: () => set({ count: 0 }),
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),
  }),
  nuclearConfig
);
`;

  await writeFile(path.join(projectDir, 'src', 'nuclear', 'slices', 'app', 'app.nucleus.ts'), appNucleus);

  const appHooks = `import { useNucleus, usePick } from '@forgedevstack/synapse';
import { appNucleus } from './app.nucleus';

export const useAppNucleus = () => useNucleus(appNucleus);
export const useAppCount = () => usePick(appNucleus, (s) => s.count);
export const useAppLoading = () => usePick(appNucleus, (s) => s.isLoading);
`;

  await writeFile(path.join(projectDir, 'src', 'nuclear', 'slices', 'app', 'app.hooks.ts'), appHooks);
  await writeFile(path.join(projectDir, 'src', 'nuclear', 'slices', 'app', 'index.ts'), `export * from './app.nucleus';
export * from './app.hooks';
`);

  // slices/user
  const userNucleus = `import { createNucleus } from '@forgedevstack/synapse';
import { nuclearConfig } from '@nuclear/config';
import type { User } from '@types/index';

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}

export const userNucleus = createNucleus<UserState>(
  (set) => ({
    user: null,
    isAuthenticated: false,
    login: (user) => set({ user, isAuthenticated: true }),
    logout: () => set({ user: null, isAuthenticated: false }),
  }),
  nuclearConfig
);
`;

  await writeFile(path.join(projectDir, 'src', 'nuclear', 'slices', 'user', 'user.nucleus.ts'), userNucleus);

  const userHooks = `import { useNucleus, usePick } from '@forgedevstack/synapse';
import { userNucleus } from './user.nucleus';

export const useUserNucleus = () => useNucleus(userNucleus);
export const useUser = () => usePick(userNucleus, (s) => s.user);
export const useIsAuthenticated = () => usePick(userNucleus, (s) => s.isAuthenticated);
`;

  await writeFile(path.join(projectDir, 'src', 'nuclear', 'slices', 'user', 'user.hooks.ts'), userHooks);
  await writeFile(path.join(projectDir, 'src', 'nuclear', 'slices', 'user', 'index.ts'), `export * from './user.nucleus';
export * from './user.hooks';
`);

  await writeFile(path.join(projectDir, 'src', 'nuclear', 'slices', 'index.ts'), `export * from './app';
export * from './user';
`);

  await writeFile(path.join(projectDir, 'src', 'nuclear', 'index.ts'), `export * from './config';
export * from './slices';
`);
}

// ============================================================================
// RTK State — SDK Pattern: store/ > slices/ > Name/ >
//   Name.api.ts, Name.reducers.ts, Name.manager.ts, Name.selectors.ts, index.ts
// ============================================================================
async function generateRTKState(projectDir: string, _config: ProjectConfig) {
  // store/store.ts
  await writeFile(path.join(projectDir, 'src', 'store', 'store.ts'),
`import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import { appReducer } from '@slices/app';
import { userReducer } from '@slices/user';

export const store = configureStore({
  reducer: {
    app: appReducer,
    user: userReducer,
  },
  devTools: import.meta.env.DEV,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
`);

  await writeFile(path.join(projectDir, 'src', 'store', 'index.ts'),
`export { store, useAppDispatch, useAppSelector } from './store';
export type { RootState, AppDispatch } from './store';
`);

  // ── slices/app ─────────────────────────────────────────────────────────
  // app.api.ts
  await writeFile(path.join(projectDir, 'src', 'store', 'slices', 'app', 'app.api.ts'),
`import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchAppConfig = createAsyncThunk(
  'app/fetchConfig',
  async () => {
    const res = await fetch('/api/config');
    return res.json();
  }
);
`);

  // app.reducers.ts
  await writeFile(path.join(projectDir, 'src', 'store', 'slices', 'app', 'app.reducers.ts'),
`import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface AppState {
  count: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: AppState = {
  count: 0,
  isLoading: false,
  error: null,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    increment: (state) => { state.count += 1; },
    decrement: (state) => { state.count -= 1; },
    reset: (state) => { state.count = 0; },
    setLoading: (state, action: PayloadAction<boolean>) => { state.isLoading = action.payload; },
    setError: (state, action: PayloadAction<string | null>) => { state.error = action.payload; },
  },
});

export const { increment, decrement, reset, setLoading, setError } = appSlice.actions;
export const appReducer = appSlice.reducer;
`);

  // app.manager.ts
  await writeFile(path.join(projectDir, 'src', 'store', 'slices', 'app', 'app.manager.ts'),
`import { useAppDispatch, useAppSelector } from '@store/store';
import { increment, decrement, reset, setLoading, setError } from './app.reducers';
import { selectCount, selectIsLoading, selectError } from './app.selectors';

export const useAppManager = () => {
  const dispatch = useAppDispatch();
  const count = useAppSelector(selectCount);
  const isLoading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectError);

  return {
    count,
    isLoading,
    error,
    increment: () => dispatch(increment()),
    decrement: () => dispatch(decrement()),
    reset: () => dispatch(reset()),
    setLoading: (val: boolean) => dispatch(setLoading(val)),
    setError: (val: string | null) => dispatch(setError(val)),
  };
};
`);

  // app.selectors.ts
  await writeFile(path.join(projectDir, 'src', 'store', 'slices', 'app', 'app.selectors.ts'),
`import type { RootState } from '@store/store';

export const selectCount = (state: RootState) => state.app.count;
export const selectIsLoading = (state: RootState) => state.app.isLoading;
export const selectError = (state: RootState) => state.app.error;
`);

  // app/index.ts
  await writeFile(path.join(projectDir, 'src', 'store', 'slices', 'app', 'index.ts'),
`export { appReducer, increment, decrement, reset, setLoading, setError } from './app.reducers';
export { selectCount, selectIsLoading, selectError } from './app.selectors';
export { useAppManager } from './app.manager';
export { fetchAppConfig } from './app.api';
`);

  // ── slices/user ────────────────────────────────────────────────────────
  // user.api.ts
  await writeFile(path.join(projectDir, 'src', 'store', 'slices', 'user', 'user.api.ts'),
`import { createAsyncThunk } from '@reduxjs/toolkit';
import type { User } from '@types/index';

export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async (id: string) => {
    const res = await fetch(\`/api/users/\${id}\`);
    return res.json() as Promise<User>;
  }
);
`);

  // user.reducers.ts
  await writeFile(path.join(projectDir, 'src', 'store', 'slices', 'user', 'user.reducers.ts'),
`import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@types/index';

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { login, logout } = userSlice.actions;
export const userReducer = userSlice.reducer;
`);

  // user.manager.ts
  await writeFile(path.join(projectDir, 'src', 'store', 'slices', 'user', 'user.manager.ts'),
`import { useAppDispatch, useAppSelector } from '@store/store';
import { login, logout } from './user.reducers';
import { selectUser, selectIsAuthenticated } from './user.selectors';
import type { User } from '@types/index';

export const useUserManager = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  return {
    user,
    isAuthenticated,
    login: (u: User) => dispatch(login(u)),
    logout: () => dispatch(logout()),
  };
};
`);

  // user.selectors.ts
  await writeFile(path.join(projectDir, 'src', 'store', 'slices', 'user', 'user.selectors.ts'),
`import type { RootState } from '@store/store';

export const selectUser = (state: RootState) => state.user.user;
export const selectIsAuthenticated = (state: RootState) => state.user.isAuthenticated;
`);

  // user/index.ts
  await writeFile(path.join(projectDir, 'src', 'store', 'slices', 'user', 'index.ts'),
`export { userReducer, login, logout } from './user.reducers';
export { selectUser, selectIsAuthenticated } from './user.selectors';
export { useUserManager } from './user.manager';
export { fetchUser } from './user.api';
`);

  // slices/index.ts
  await writeFile(path.join(projectDir, 'src', 'store', 'slices', 'index.ts'),
`export * from './app';
export * from './user';
`);
}

// ============================================================================
// Backend Server — server/ > src/ > App.ts, routes/, controllers/, services/,
//   middleware/ (logger, httpLogger, auth), WebSocket support
// ============================================================================
async function generateBackendServer(projectDir: string, config: ProjectConfig) {
  const serverDir = path.join(projectDir, 'server');
  await ensureDir(serverDir);
  await ensureDir(path.join(serverDir, 'src'));
  await ensureDir(path.join(serverDir, 'src', 'routes'));
  await ensureDir(path.join(serverDir, 'src', 'controllers'));
  await ensureDir(path.join(serverDir, 'src', 'services'));
  await ensureDir(path.join(serverDir, 'src', 'middleware'));

  const isHarbor = config.serverFramework === 'harbor';

  // ── package.json ─────────────────────────────────────────────────────
  const serverDeps: Record<string, string> = {};
  const serverDevDeps: Record<string, string> = {
    '@types/node': '^20.10.0',
    typescript: '^5.7.3',
    tsx: '^4.7.0',
  };

  if (isHarbor) {
    serverDeps['@forgedevstack/harbor'] = '^1.6.2';
  } else {
    serverDeps['express'] = '^4.21.0';
    serverDeps['cors'] = '^2.8.5';
    serverDeps['dotenv'] = '^16.4.0';
    serverDeps['ws'] = '^8.16.0';
    serverDevDeps['@types/express'] = '^4.17.21';
    serverDevDeps['@types/cors'] = '^2.8.17';
    serverDevDeps['@types/ws'] = '^8.5.10';
  }

  const serverPkgJson = {
    name: `${config.name}-server`,
    version: '0.1.0',
    private: true,
    type: 'module',
    scripts: {
      dev: 'tsx watch src/index.ts',
      build: 'tsc',
      start: 'node dist/index.js',
    },
    dependencies: serverDeps,
    devDependencies: serverDevDeps,
  };

  await writeFile(path.join(serverDir, 'package.json'), JSON.stringify(serverPkgJson, null, 2));

  // ── tsconfig.json ────────────────────────────────────────────────────
  const serverTsConfig = {
    compilerOptions: {
      target: 'ES2020',
      module: 'ESNext',
      moduleResolution: 'bundler',
      outDir: './dist',
      rootDir: './src',
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
    },
    include: ['src'],
  };

  await writeFile(path.join(serverDir, 'tsconfig.json'), JSON.stringify(serverTsConfig, null, 2));

  // ── middleware/logger.ts ─────────────────────────────────────────────
  await writeFile(path.join(serverDir, 'src', 'middleware', 'logger.ts'),
`const colors = {
  reset: '\\x1b[0m',
  dim: '\\x1b[2m',
  green: '\\x1b[32m',
  yellow: '\\x1b[33m',
  cyan: '\\x1b[36m',
  red: '\\x1b[31m',
};

export const logger = {
  info: (message: string, ...args: unknown[]) => {
    console.log(\`\${colors.cyan}[INFO]\${colors.reset} \${colors.dim}\${new Date().toISOString()}\${colors.reset} \${message}\`, ...args);
  },
  warn: (message: string, ...args: unknown[]) => {
    console.warn(\`\${colors.yellow}[WARN]\${colors.reset} \${colors.dim}\${new Date().toISOString()}\${colors.reset} \${message}\`, ...args);
  },
  error: (message: string, ...args: unknown[]) => {
    console.error(\`\${colors.red}[ERROR]\${colors.reset} \${colors.dim}\${new Date().toISOString()}\${colors.reset} \${message}\`, ...args);
  },
  success: (message: string, ...args: unknown[]) => {
    console.log(\`\${colors.green}[OK]\${colors.reset} \${colors.dim}\${new Date().toISOString()}\${colors.reset} \${message}\`, ...args);
  },
};
`);

  // ── middleware/httpLogger.ts ──────────────────────────────────────────
  await writeFile(path.join(serverDir, 'src', 'middleware', 'httpLogger.ts'),
`import type { Request, Response, NextFunction } from '${isHarbor ? '@forgedevstack/harbor' : 'express'}';
import { logger } from './logger';

export const httpLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    const color = status >= 400 ? 'error' : status >= 300 ? 'warn' : 'info';
    logger[color](\`\${req.method} \${req.originalUrl} \${status} \${duration}ms\`);
  });

  next();
};
`);

  // ── middleware/auth.ts ───────────────────────────────────────────────
  await writeFile(path.join(serverDir, 'src', 'middleware', 'auth.ts'),
`import type { Request, Response, NextFunction } from '${isHarbor ? '@forgedevstack/harbor' : 'express'}';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};
`);

  // ── middleware/index.ts ──────────────────────────────────────────────
  await writeFile(path.join(serverDir, 'src', 'middleware', 'index.ts'),
`export { logger } from './logger';
export { httpLogger } from './httpLogger';
export { authMiddleware } from './auth';
`);

  // ── services/user.service.ts ─────────────────────────────────────────
  await writeFile(path.join(serverDir, 'src', 'services', 'user.service.ts'),
`interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const USERS: User[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'admin' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'user' },
  { id: '3', name: 'Bob Wilson', email: 'bob@example.com', role: 'user' },
];

export const userService = {
  getAll: (): User[] => USERS,

  getById: (id: string): User | undefined => USERS.find(u => u.id === id),

  create: (data: Omit<User, 'id'>): User => {
    const user = { ...data, id: String(USERS.length + 1) };
    USERS.push(user);
    return user;
  },

  update: (id: string, data: Partial<User>): User | undefined => {
    const index = USERS.findIndex(u => u.id === id);
    if (index === -1) return undefined;
    USERS[index] = { ...USERS[index], ...data };
    return USERS[index];
  },

  delete: (id: string): boolean => {
    const index = USERS.findIndex(u => u.id === id);
    if (index === -1) return false;
    USERS.splice(index, 1);
    return true;
  },
};
`);

  // ── services/index.ts ────────────────────────────────────────────────
  await writeFile(path.join(serverDir, 'src', 'services', 'index.ts'),
`export { userService } from './user.service';
`);

  // ── controllers/user.controller.ts ───────────────────────────────────
  await writeFile(path.join(serverDir, 'src', 'controllers', 'user.controller.ts'),
`import type { Request, Response } from '${isHarbor ? '@forgedevstack/harbor' : 'express'}';
import { userService } from '../services';

export const userController = {
  getAll: (_req: Request, res: Response) => {
    res.json(userService.getAll());
  },

  getById: (req: Request, res: Response) => {
    const user = userService.getById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  },

  create: (req: Request, res: Response) => {
    const user = userService.create(req.body);
    res.status(201).json(user);
  },

  update: (req: Request, res: Response) => {
    const user = userService.update(req.params.id, req.body);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  },

  delete: (req: Request, res: Response) => {
    const deleted = userService.delete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'User not found' });
    res.status(204).send();
  },
};
`);

  // ── controllers/index.ts ─────────────────────────────────────────────
  await writeFile(path.join(serverDir, 'src', 'controllers', 'index.ts'),
`export { userController } from './user.controller';
`);

  // ── routes/users.ts (uses controller) ────────────────────────────────
  if (isHarbor) {
    await writeFile(path.join(serverDir, 'src', 'routes', 'users.ts'),
`import { createRouter } from '@forgedevstack/harbor';
import { userController } from '../controllers';

export const userRoutes = createRouter();

userRoutes.get('/', userController.getAll);
userRoutes.get('/:id', userController.getById);
userRoutes.post('/', userController.create);
userRoutes.put('/:id', userController.update);
userRoutes.delete('/:id', userController.delete);
`);
  } else {
    await writeFile(path.join(serverDir, 'src', 'routes', 'users.ts'),
`import { Router } from 'express';
import { userController } from '../controllers';

export const userRoutes = Router();

userRoutes.get('/', userController.getAll);
userRoutes.get('/:id', userController.getById);
userRoutes.post('/', userController.create);
userRoutes.put('/:id', userController.update);
userRoutes.delete('/:id', userController.delete);
`);
  }

  // ── routes/index.ts ──────────────────────────────────────────────────
  await writeFile(path.join(serverDir, 'src', 'routes', 'index.ts'),
`export { userRoutes } from './users';
`);

  // ── App.ts (main server with logger, httpLogger, socket) ─────────────
  if (isHarbor) {
    await writeFile(path.join(serverDir, 'src', 'App.ts'),
`import { createServer } from '@forgedevstack/harbor';
import { userRoutes } from './routes';
import { httpLogger, logger } from './middleware';

const app = createServer({
  port: Number(process.env.PORT) || 8080,
  cors: true,
  logging: true,
});

app.use(httpLogger);

app.use('/api/users', userRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen();
logger.success(\`Server started on port \${Number(process.env.PORT) || 8080}\`);
`);
  } else {
    await writeFile(path.join(serverDir, 'src', 'App.ts'),
`import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { userRoutes } from './routes';
import { httpLogger, logger } from './middleware';

const app = express();
const PORT = Number(process.env.PORT) || 8080;

app.use(cors());
app.use(express.json());
app.use(httpLogger);

app.use('/api/users', userRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const server = createServer(app);

const wss = new WebSocketServer({ server, path: '/ws' });

wss.on('connection', (ws) => {
  logger.info('WebSocket client connected');

  ws.on('message', (data) => {
    logger.info(\`WS message: \${data}\`);
    wss.clients.forEach((client) => {
      if (client.readyState === ws.OPEN) {
        client.send(String(data));
      }
    });
  });

  ws.on('close', () => {
    logger.info('WebSocket client disconnected');
  });
});

export { app, server, wss, PORT };
`);
  }

  // ── index.ts (entry point — imports App and starts) ──────────────────
  if (isHarbor) {
    await writeFile(path.join(serverDir, 'src', 'index.ts'),
`import './App';
`);
  } else {
    await writeFile(path.join(serverDir, 'src', 'index.ts'),
`import { server, PORT } from './App';
import { logger } from './middleware';

server.listen(PORT, () => {
  logger.success(\`Server running on http://localhost:\${PORT}\`);
  logger.info(\`WebSocket available at ws://localhost:\${PORT}/ws\`);
});
`);
  }

  // ── .env ─────────────────────────────────────────────────────────────
  await writeFile(path.join(serverDir, '.env'),
`PORT=8080
NODE_ENV=development
`);

  // ── .gitignore ───────────────────────────────────────────────────────
  await writeFile(path.join(serverDir, '.gitignore'),
`node_modules
dist
.env
`);
}

// ============================================================================
// Docker Files
// ============================================================================
async function generateDockerFiles(projectDir: string, config: ProjectConfig) {
  const dockerfile = `FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
`;

  await writeFile(path.join(projectDir, 'Dockerfile'), dockerfile);

  const dockerCompose = `version: '3.8'
services:
  ${config.name}:
    build: .
    ports:
      - "3000:80"
    restart: unless-stopped
`;

  await writeFile(path.join(projectDir, 'docker-compose.yml'), dockerCompose);

  const nginxConf = `server {
  listen 80;
  root /usr/share/nginx/html;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }

  location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }
}
`;

  await writeFile(path.join(projectDir, 'nginx.conf'), nginxConf);
  await writeFile(path.join(projectDir, '.dockerignore'), `node_modules
dist
.git
.env*
`);
}

// ============================================================================
// Generator Scripts
// ============================================================================
async function generateGeneratorScripts(projectDir: string, config: ProjectConfig) {
  const generatePage = `#!/usr/bin/env tsx
import enquirer from 'enquirer';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

const { prompt } = enquirer;

async function main() {
  const { name } = await prompt<{ name: string }>({
    type: 'input',
    name: 'name',
    message: 'Page name (PascalCase):',
  });

  const dir = path.join(process.cwd(), 'src', 'pages', name);
  if (fs.existsSync(dir)) {
    console.log(chalk.red(\`Page \${name} exists!\`));
    process.exit(1);
  }

  fs.mkdirSync(dir, { recursive: true });

  fs.writeFileSync(path.join(dir, \`\${name}.types.ts\`), \`export interface \${name}PageProps {}
\`);

  fs.writeFileSync(path.join(dir, \`\${name}.const.ts\`), \`// Constants for \${name} page
\`);

  fs.writeFileSync(path.join(dir, \`\${name}.tsx\`), \`export const \${name}Page = () => (
  <div className="page-header">
    <h1 className="page-title">\${name}</h1>
  </div>
);
\`);

  fs.writeFileSync(path.join(dir, 'index.ts'), \`export { \${name}Page } from './\${name}';
export type { \${name}PageProps } from './\${name}.types';
\`);

  console.log(chalk.green(\`✓ Page \${name} created with types, const, and component!\`));
}

main().catch(console.error);
`;

  await writeFile(path.join(projectDir, 'scripts', 'generate-page.ts'), generatePage);

  const generateComponent = `#!/usr/bin/env tsx
import enquirer from 'enquirer';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

const { prompt } = enquirer;

async function main() {
  const { name } = await prompt<{ name: string }>({
    type: 'input',
    name: 'name',
    message: 'Component name (PascalCase):',
  });

  const dir = path.join(process.cwd(), 'src', 'components', 'common', name);
  if (fs.existsSync(dir)) {
    console.log(chalk.red(\`Component \${name} exists!\`));
    process.exit(1);
  }

  fs.mkdirSync(dir, { recursive: true });

  fs.writeFileSync(path.join(dir, \`\${name}.types.ts\`), \`export interface \${name}Props {}
\`);

  fs.writeFileSync(path.join(dir, \`\${name}.tsx\`), \`import type { \${name}Props } from './\${name}.types';

export const \${name} = ({}: \${name}Props) => <div>\${name}</div>;
\`);

  fs.writeFileSync(path.join(dir, 'index.ts'), \`export { \${name} } from './\${name}';
export type { \${name}Props } from './\${name}.types';
\`);

  console.log(chalk.green(\`✓ Component \${name} created with types!\`));
}

main().catch(console.error);
`;

  await writeFile(path.join(projectDir, 'scripts', 'generate-component.ts'), generateComponent);

  if (config.stateManager === 'synapse') {
    const generateSlice = `#!/usr/bin/env tsx
import enquirer from 'enquirer';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

const { prompt } = enquirer;

async function main() {
  const { name } = await prompt<{ name: string }>({
    type: 'input',
    name: 'name',
    message: 'Slice name (camelCase):',
  });

  const dir = path.join(process.cwd(), 'src', 'nuclear', 'slices', name);
  const pascal = name.charAt(0).toUpperCase() + name.slice(1);

  if (fs.existsSync(dir)) {
    console.log(chalk.red(\`Slice \${name} exists!\`));
    process.exit(1);
  }

  fs.mkdirSync(dir, { recursive: true });

  fs.writeFileSync(path.join(dir, \`\${name}.nucleus.ts\`), \`import { createNucleus } from '@forgedevstack/synapse';
import { nuclearConfig } from '@nuclear/config';

interface \${pascal}State {
  items: unknown[];
  isLoading: boolean;
  setItems: (items: unknown[]) => void;
  setLoading: (loading: boolean) => void;
}

export const \${name}Nucleus = createNucleus<\${pascal}State>(
  (set) => ({
    items: [],
    isLoading: false,
    setItems: (items) => set({ items }),
    setLoading: (isLoading) => set({ isLoading }),
  }),
  nuclearConfig
);
\`);

  fs.writeFileSync(path.join(dir, \`\${name}.hooks.ts\`), \`import { useNucleus, usePick } from '@forgedevstack/synapse';
import { \${name}Nucleus } from './\${name}.nucleus';

export const use\${pascal}Nucleus = () => useNucleus(\${name}Nucleus);
export const use\${pascal}Items = () => usePick(\${name}Nucleus, (s) => s.items);
\`);

  fs.writeFileSync(path.join(dir, 'index.ts'), \`export * from './\${name}.nucleus';
export * from './\${name}.hooks';
\`);

  console.log(chalk.green(\`✓ Slice \${name} created!\`));
}

main().catch(console.error);
`;

    await writeFile(path.join(projectDir, 'scripts', 'generate-slice.ts'), generateSlice);
  }

  if (config.stateManager === 'rtk') {
    const generateRTKSlice = `#!/usr/bin/env tsx
import enquirer from 'enquirer';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

const { prompt } = enquirer;

async function main() {
  const { name } = await prompt<{ name: string }>({
    type: 'input',
    name: 'name',
    message: 'Slice name (camelCase):',
  });

  const dir = path.join(process.cwd(), 'src', 'store', 'slices', name);
  const pascal = name.charAt(0).toUpperCase() + name.slice(1);

  if (fs.existsSync(dir)) {
    console.log(chalk.red(\`Slice \${name} exists!\`));
    process.exit(1);
  }

  fs.mkdirSync(dir, { recursive: true });

  fs.writeFileSync(path.join(dir, \`\${name}.api.ts\`), \`import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetch\${pascal} = createAsyncThunk(
  '\${name}/fetch',
  async () => {
    const res = await fetch('/api/\${name}');
    return res.json();
  }
);
\`);

  fs.writeFileSync(path.join(dir, \`\${name}.reducers.ts\`), \`import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface \${pascal}State {
  items: unknown[];
  isLoading: boolean;
  error: string | null;
}

const initialState: \${pascal}State = {
  items: [],
  isLoading: false,
  error: null,
};

const \${name}Slice = createSlice({
  name: '\${name}',
  initialState,
  reducers: {
    setItems: (state, action: PayloadAction<unknown[]>) => { state.items = action.payload; },
    setLoading: (state, action: PayloadAction<boolean>) => { state.isLoading = action.payload; },
    setError: (state, action: PayloadAction<string | null>) => { state.error = action.payload; },
  },
});

export const { setItems, setLoading, setError } = \${name}Slice.actions;
export const \${name}Reducer = \${name}Slice.reducer;
\`);

  fs.writeFileSync(path.join(dir, \`\${name}.selectors.ts\`), \`import type { RootState } from '@store/store';

export const select\${pascal}Items = (state: RootState) => state.\${name}?.items ?? [];
export const select\${pascal}Loading = (state: RootState) => state.\${name}?.isLoading ?? false;
\`);

  fs.writeFileSync(path.join(dir, \`\${name}.manager.ts\`), \`import { useAppDispatch, useAppSelector } from '@store/store';
import { setItems, setLoading, setError } from './\${name}.reducers';
import { select\${pascal}Items, select\${pascal}Loading } from './\${name}.selectors';

export const use\${pascal}Manager = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector(select\${pascal}Items);
  const isLoading = useAppSelector(select\${pascal}Loading);

  return {
    items,
    isLoading,
    setItems: (val: unknown[]) => dispatch(setItems(val)),
    setLoading: (val: boolean) => dispatch(setLoading(val)),
    setError: (val: string | null) => dispatch(setError(val)),
  };
};
\`);

  fs.writeFileSync(path.join(dir, 'index.ts'), \`export { \${name}Reducer, setItems, setLoading, setError } from './\${name}.reducers';
export { select\${pascal}Items, select\${pascal}Loading } from './\${name}.selectors';
export { use\${pascal}Manager } from './\${name}.manager';
export { fetch\${pascal} } from './\${name}.api';
\`);

  console.log(chalk.green(\`✓ RTK Slice \${name} created with api, reducers, selectors, manager!\`));
}

main().catch(console.error);
`;

    await writeFile(path.join(projectDir, 'scripts', 'generate-slice.ts'), generateRTKSlice);
  }
}

// ============================================================================
// Other files
// ============================================================================
async function generatePublicAssets(projectDir: string, config: ProjectConfig) {
  const primaryColor = config.bearPrimaryColor || '#ec4899';
  const forgeSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" style="stop-color:${primaryColor}"/>
    <stop offset="100%" style="stop-color:#8b5cf6"/>
  </linearGradient></defs>
  <rect x="10" y="10" width="80" height="80" rx="16" fill="url(#g)"/>
  <path d="M30 35h40M30 50h30M30 65h20" stroke="#fff" stroke-width="6" stroke-linecap="round"/>
</svg>`;

  await writeFile(path.join(projectDir, 'public', 'forge.svg'), forgeSvg);
}

async function generateGitIgnore(projectDir: string) {
  await writeFile(path.join(projectDir, '.gitignore'), `node_modules
dist
.env
.env.local
.DS_Store
*.log
`);
}

async function generateEnvFiles(projectDir: string, config: ProjectConfig) {
  const env = `VITE_API_URL=http://localhost:8080/api
VITE_APP_NAME=${config.name}
`;
  await writeFile(path.join(projectDir, '.env.example'), env);
  await writeFile(path.join(projectDir, '.env'), env);
}

async function generateReadme(projectDir: string, config: ProjectConfig) {
  await writeFile(path.join(projectDir, 'README.md'), `# ${config.name}

Built with [ForgeStack](https://forgedevstack.com)

## Quick Start

\`\`\`bash
${config.packageManager}${config.packageManager === 'yarn' ? '' : ' run'} dev
\`\`\`

## Scripts

- \`dev\` - Start dev server
- \`build\` - Build for production
- \`generate:page\` - Create new page
- \`generate:component\` - Create new component
${config.stateManager === 'synapse' ? '- `generate:slice` - Create Synapse slice\n' : ''}${config.stateManager === 'rtk' ? '- `generate:slice` - Create RTK slice (api, reducers, manager, selectors)\n' : ''}${config.includeBackend ? '- `server:dev` - Start backend dev server\n' : ''}
`);
}
