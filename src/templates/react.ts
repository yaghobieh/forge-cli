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

  // Add ForgeStack packages with latest versions
  dependencies['@forgedevstack/anvil'] = versions.anvil;
  
  if (config.includeBear) {
    dependencies['@forgedevstack/bear'] = versions.bear;
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

  const scripts: Record<string, string> = {
    dev: 'vite',
    build: 'tsc && vite build',
    preview: 'vite preview',
    lint: 'eslint . --ext ts,tsx',
    'generate:page': 'tsx scripts/generate-page.ts',
    'generate:component': 'tsx scripts/generate-component.ts',
  };

  if (config.stateManager === 'synapse') {
    scripts['generate:slice'] = 'tsx scripts/generate-slice.ts';
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
  // Try to fetch latest versions, fallback to known versions
  const packages = [
    { name: 'bear', pkg: '@forgedevstack/bear', fallback: '^1.0.7' },
    { name: 'synapse', pkg: '@forgedevstack/synapse', fallback: '^1.0.0' },
    { name: 'forgeCompass', pkg: '@forgedevstack/forge-compass', fallback: '^1.2.1' },
    { name: 'forgeQuery', pkg: '@forgedevstack/forge-query', fallback: '^1.0.0' },
    { name: 'forgeForm', pkg: '@forgedevstack/forge-form', fallback: '^1.0.0' },
    { name: 'gridTable', pkg: '@forgedevstack/grid-table', fallback: '^1.0.0' },
    { name: 'anvil', pkg: '@forgedevstack/anvil', fallback: '^1.0.0' },
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
  const nuclearAlias = config.stateManager === 'synapse' ? `
      '@nuclear': path.resolve(__dirname, './src/nuclear'),
      '@slices': path.resolve(__dirname, './src/nuclear/slices'),` : '';

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
      '@assets': path.resolve(__dirname, './src/assets'),${nuclearAlias}
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

  let themeConfig = '';
  let wrapperStart = '';
  let wrapperEnd = '';

  if (config.includeBear) {
    const primaryColor = config.bearPrimaryColor || '#ec4899';
    themeConfig = `
// Customize Bear theme
const theme: Partial<BearTheme> = {
  colors: {
    primary: '${primaryColor}',
    // secondary: '#8b5cf6',
  },
};
`;
    wrapperStart = `<BearProvider theme={theme}>
        `;
    wrapperEnd = `
      </BearProvider>`;
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

  // index.ts
  await writeFile(path.join(projectDir, 'src', 'config', 'index.ts'), `export * from './env';
export * from './constants';
${config.router === 'compass' ? "export * from './routes';" : ''}
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
// Components
// ============================================================================
async function generateComponents(projectDir: string, config: ProjectConfig) {
  const useBear = config.includeBear;
  
  // Layout
  let layoutImports = `import { ReactNode, Suspense } from 'react';`;
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

interface LayoutProps {
  children: ReactNode;
}

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
  await writeFile(path.join(projectDir, 'src', 'components', 'Layout', 'index.ts'), `export * from './Layout';
`);

  // FeatureCard
  await ensureDir(path.join(projectDir, 'src', 'components', 'common', 'FeatureCard'));

  const featureCardTsx = useBear ? `import { Card, CardBody, Typography, Flex } from '@forgedevstack/bear';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

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
` : `interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

export const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 12, padding: 24 }}>
    <span style={{ fontSize: '2rem' }}>{icon}</span>
    <h3 style={{ fontWeight: 600, marginTop: 12 }}>{title}</h3>
    <p style={{ color: 'var(--text-muted)', marginTop: 8 }}>{description}</p>
  </div>
);
`;

  await writeFile(path.join(projectDir, 'src', 'components', 'common', 'FeatureCard', 'FeatureCard.tsx'), featureCardTsx);
  await writeFile(path.join(projectDir, 'src', 'components', 'common', 'FeatureCard', 'index.ts'), `export * from './FeatureCard';
`);

  await writeFile(path.join(projectDir, 'src', 'components', 'common', 'index.ts'), `export * from './FeatureCard';
`);

  await writeFile(path.join(projectDir, 'src', 'components', 'index.ts'), `export * from './Layout';
export * from './common';
`);
}

// ============================================================================
// Pages
// ============================================================================
async function generatePages(projectDir: string, config: ProjectConfig) {
  const useBear = config.includeBear;
  const useGridTable = config.includeGridTable;
  const useSynapse = config.stateManager === 'synapse';

  // Home Page
  const homePage = useBear ? `import { Typography, Button, Flex } from '@forgedevstack/bear';
${config.router === 'compass' ? `import { useNavigate } from '@forgedevstack/forge-compass';` : ''}
import { FeatureCard } from '@components/common';

const FEATURES = [
  { icon: '⚡', title: 'Lightning Fast', description: 'Built with Vite for instant HMR.' },
  { icon: '🎨', title: 'Beautiful UI', description: 'Powered by Bear UI.' },
  { icon: '🔒', title: 'Type Safe', description: 'Full TypeScript support.' },
  { icon: '📦', title: 'Modular', description: 'Clean architecture.' },
];

export const HomePage = () => {
  ${config.router === 'compass' ? `const navigate = useNavigate();` : ''}

  return (
    <>
      <div className="page-header">
        <Typography variant="h1" className="page-title">Welcome to ${config.name}</Typography>
        <Typography variant="body1" className="page-subtitle">Built with ForgeStack</Typography>
      </div>
      <Flex gap={16} style={{ marginTop: 24 }}>
        <Button variant="primary"${config.router === 'compass' ? ` onClick={() => navigate('/dashboard')}` : ''}>Get Started</Button>
        <Button variant="outline"${config.router === 'compass' ? ` onClick={() => navigate('/users')}` : ''}>View Users</Button>
      </Flex>
      <div className="card-grid">
        {FEATURES.map((f) => <FeatureCard key={f.title} {...f} />)}
      </div>
    </>
  );
};
` : `import { FeatureCard } from '@components/common';

const FEATURES = [
  { icon: '⚡', title: 'Lightning Fast', description: 'Built with Vite.' },
  { icon: '🔒', title: 'Type Safe', description: 'TypeScript support.' },
];

export const HomePage = () => (
  <>
    <div className="page-header">
      <h1 className="page-title">Welcome to ${config.name}</h1>
      <p className="page-subtitle">Built with ForgeStack</p>
    </div>
    <div className="card-grid">
      {FEATURES.map((f) => <FeatureCard key={f.title} {...f} />)}
    </div>
  </>
);
`;

  await writeFile(path.join(projectDir, 'src', 'pages', 'Home', 'Home.tsx'), homePage);
  await writeFile(path.join(projectDir, 'src', 'pages', 'Home', 'index.ts'), `export * from './Home';
`);

  // Dashboard Page
  const dashboardPage = useBear && useSynapse ? `import { Typography, Card, CardBody, Button, Flex, Badge } from '@forgedevstack/bear';
import { useAppNucleus } from '@slices/app';

export const DashboardPage = () => {
  const { count, increment, decrement, reset, isLoading, setLoading } = useAppNucleus();

  return (
    <>
      <div className="page-header">
        <Flex align="center" gap={12}>
          <Typography variant="h1" className="page-title">Dashboard</Typography>
          <Badge variant="success">Synapse</Badge>
        </Flex>
        <Typography variant="body1" className="page-subtitle">State management demo</Typography>
      </div>

      <div className="card-grid">
        <Card>
          <CardBody>
            <Typography variant="h4" style={{ marginBottom: 16 }}>Counter</Typography>
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
            <Typography variant="h4" style={{ marginBottom: 16 }}>Loading State</Typography>
            <Badge variant={isLoading ? 'warning' : 'success'}>{isLoading ? 'Loading...' : 'Ready'}</Badge>
            <Button 
              onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 2000); }}
              variant="outline"
              style={{ marginTop: 16 }}
            >
              Simulate
            </Button>
          </CardBody>
        </Card>
      </div>
    </>
  );
};
` : `import { useState } from 'react';

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

  await writeFile(path.join(projectDir, 'src', 'pages', 'Dashboard', 'Dashboard.tsx'), dashboardPage);
  await writeFile(path.join(projectDir, 'src', 'pages', 'Dashboard', 'index.ts'), `export * from './Dashboard';
`);

  // Users Page with Grid Table
  let usersPage = '';
  
  if (useGridTable && useSynapse) {
    usersPage = `import { useMemo } from 'react';
import { GridTable, type ColumnDefinition } from '@forgedevstack/grid-table';
${useBear ? `import { Typography, Card, CardBody, Badge, Skeleton } from '@forgedevstack/bear';` : ''}
import { useUsers } from '@api/users';
import type { User } from '@types/index';

const columns: ColumnDefinition<User>[] = [
  {
    id: 'name',
    accessor: 'name',
    header: 'Name',
    sortable: true,
    filterable: true,
  },
  {
    id: 'email',
    accessor: 'email',
    header: 'Email',
    sortable: true,
  },
  {
    id: 'role',
    accessor: 'role',
    header: 'Role',
    filterType: 'select',
    filterOptions: [
      { value: 'admin', label: 'Admin' },
      { value: 'user', label: 'User' },
    ],
    cell: ({ value }) => (
      <Badge variant={value === 'admin' ? 'primary' : 'secondary'}>{value}</Badge>
    ),
  },
  {
    id: 'createdAt',
    accessor: 'createdAt',
    header: 'Created',
    cell: ({ value }) => new Date(value).toLocaleDateString(),
  },
];

// Mock data for demo
const MOCK_USERS: User[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'admin', createdAt: '2024-01-15' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'user', createdAt: '2024-02-20' },
  { id: '3', name: 'Bob Wilson', email: 'bob@example.com', role: 'user', createdAt: '2024-03-10' },
  { id: '4', name: 'Alice Brown', email: 'alice@example.com', role: 'admin', createdAt: '2024-04-05' },
  { id: '5', name: 'Charlie Davis', email: 'charlie@example.com', role: 'user', createdAt: '2024-05-12' },
];

export const UsersPage = () => {
  // Use mock data for demo, replace with: const { data, loading, error } = useUsers();
  const data = MOCK_USERS;
  const loading = false;

  if (loading) {
    return (
      <>
        <div className="page-header">
          <Typography variant="h1" className="page-title">Users</Typography>
        </div>
        <Skeleton height={400} />
      </>
    );
  }

  return (
    <>
      <div className="page-header">
        <Typography variant="h1" className="page-title">Users</Typography>
        <Typography variant="body1" className="page-subtitle">Manage your users with Grid Table</Typography>
      </div>

      <Card style={{ marginTop: 24 }}>
        <CardBody style={{ padding: 0, overflow: 'hidden' }}>
          <GridTable
            data={data || []}
            columns={columns}
            enableRowSelection
            showPagination
            showFilter
            pageSize={10}
          />
        </CardBody>
      </Card>
    </>
  );
};
`;
  } else if (useGridTable) {
    usersPage = `import { GridTable, type ColumnDefinition } from '@forgedevstack/grid-table';
import type { User } from '@types/index';

const columns: ColumnDefinition<User>[] = [
  { id: 'name', accessor: 'name', header: 'Name', sortable: true },
  { id: 'email', accessor: 'email', header: 'Email' },
  { id: 'role', accessor: 'role', header: 'Role' },
];

const MOCK_USERS: User[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'admin', createdAt: '2024-01-15' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'user', createdAt: '2024-02-20' },
];

export const UsersPage = () => (
  <>
    <div className="page-header">
      <h1 className="page-title">Users</h1>
    </div>
    <GridTable data={MOCK_USERS} columns={columns} showPagination />
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
    <div className="page-header">
      <h1 className="page-title">Users</h1>
    </div>
    <p>Add grid-table for data management</p>
  </>
);
`;
  }

  await writeFile(path.join(projectDir, 'src', 'pages', 'Users', 'Users.tsx'), usersPage);
  await writeFile(path.join(projectDir, 'src', 'pages', 'Users', 'index.ts'), `export * from './Users';
`);

  // About, Settings, NotFound pages (simplified)
  const aboutPage = useBear ? `import { Typography, Card, CardBody } from '@forgedevstack/bear';

const TECH = ['React 18 + TypeScript', 'Vite', ${config.includeBear ? "'Bear UI', " : ''}${config.router === 'compass' ? "'Forge Compass', " : ''}${useSynapse ? "'Synapse', " : ''}${useGridTable ? "'Grid Table', " : ''}'Anvil Utils'];

export const AboutPage = () => (
  <>
    <div className="page-header">
      <Typography variant="h1" className="page-title">About</Typography>
    </div>
    <Card>
      <CardBody>
        <Typography variant="h4" style={{ marginBottom: 16 }}>Tech Stack</Typography>
        <ul style={{ listStyle: 'none' }}>
          {TECH.map(t => <li key={t} style={{ padding: '8px 0', color: 'var(--text-muted)' }}>✓ {t}</li>)}
        </ul>
      </CardBody>
    </Card>
  </>
);
` : `export const AboutPage = () => (
  <>
    <div className="page-header"><h1 className="page-title">About</h1></div>
    <p>Built with ForgeStack</p>
  </>
);
`;

  await writeFile(path.join(projectDir, 'src', 'pages', 'About', 'About.tsx'), aboutPage);
  await writeFile(path.join(projectDir, 'src', 'pages', 'About', 'index.ts'), `export * from './About';
`);

  const settingsPage = useBear ? `import { useState } from 'react';
import { Typography, Card, CardBody, Button, Flex, Switch } from '@forgedevstack/bear';

export const SettingsPage = () => {
  const [notifications, setNotifications] = useState(true);

  return (
    <>
      <div className="page-header">
        <Typography variant="h1" className="page-title">Settings</Typography>
      </div>
      <Card>
        <CardBody>
          <Flex justify="space-between" align="center">
            <div>
              <Typography variant="body1">Notifications</Typography>
              <Typography variant="body2" color="muted">Receive alerts</Typography>
            </div>
            <Switch checked={notifications} onChange={(e) => setNotifications(e.target.checked)} />
          </Flex>
        </CardBody>
      </Card>
      <Flex gap={12} style={{ marginTop: 24 }}>
        <Button variant="primary">Save</Button>
        <Button variant="outline">Cancel</Button>
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
  await writeFile(path.join(projectDir, 'src', 'pages', 'Settings', 'index.ts'), `export * from './Settings';
`);

  const notFoundPage = useBear ? `import { Typography, Button, Flex } from '@forgedevstack/bear';
${config.router === 'compass' ? `import { useNavigate } from '@forgedevstack/forge-compass';` : ''}

export const NotFoundPage = () => {
  ${config.router === 'compass' ? `const navigate = useNavigate();` : ''}

  return (
    <Flex direction="column" align="center" justify="center" style={{ minHeight: '60vh', textAlign: 'center' }}>
      <Typography variant="h1" style={{ fontSize: '6rem' }}>404</Typography>
      <Typography variant="h3">Page Not Found</Typography>
      <Button variant="primary" style={{ marginTop: 32 }}${config.router === 'compass' ? ` onClick={() => navigate('/')}` : ''}>Go Home</Button>
    </Flex>
  );
};
` : `export const NotFoundPage = () => (
  <div style={{ textAlign: 'center', paddingTop: '20vh' }}>
    <h1 style={{ fontSize: '6rem' }}>404</h1>
    <a href="/">Go Home</a>
  </div>
);
`;

  await writeFile(path.join(projectDir, 'src', 'pages', 'NotFound', 'NotFound.tsx'), notFoundPage);
  await writeFile(path.join(projectDir, 'src', 'pages', 'NotFound', 'index.ts'), `export * from './NotFound';
`);

  // Pages index
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

  fs.writeFileSync(path.join(dir, \`\${name}.tsx\`), \`export const \${name}Page = () => (
  <div className="page-header">
    <h1 className="page-title">\${name}</h1>
  </div>
);
\`);

  fs.writeFileSync(path.join(dir, 'index.ts'), \`export * from './\${name}';
\`);

  console.log(chalk.green(\`✓ Page \${name} created!\`));
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

  fs.writeFileSync(path.join(dir, \`\${name}.tsx\`), \`interface \${name}Props {}

export const \${name} = ({}: \${name}Props) => <div>\${name}</div>;
\`);

  fs.writeFileSync(path.join(dir, 'index.ts'), \`export * from './\${name}';
\`);

  console.log(chalk.green(\`✓ Component \${name} created!\`));
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
${config.stateManager === 'synapse' ? '- `generate:slice` - Create Synapse slice\n' : ''}
`);
}
