import path from 'path';
import { writeFile, ensureDir } from '../utils/index.js';
import type { ProjectConfig } from '../ui/prompts.js';
import { generateReactTemplate } from './react.js';
import { generateServerTemplate } from './server.js';

export const generateFullStackTemplate = async (
  projectDir: string,
  config: ProjectConfig
): Promise<void> => {
  // Create monorepo structure
  await ensureDir(path.join(projectDir, 'packages', 'client'));
  await ensureDir(path.join(projectDir, 'packages', 'server'));
  await ensureDir(path.join(projectDir, 'packages', 'shared'));

  // Root package.json (workspaces)
  const rootPackageJson = {
    name: config.name,
    version: '0.1.0',
    private: true,
    workspaces: ['packages/*'],
    scripts: {
      dev: 'npm run dev:client & npm run dev:server',
      'dev:client': 'npm run dev --workspace=packages/client',
      'dev:server': 'npm run dev --workspace=packages/server',
      build: 'npm run build --workspaces',
      lint: 'npm run lint --workspaces',
    },
  };

  await writeFile(
    path.join(projectDir, 'package.json'),
    JSON.stringify(rootPackageJson, null, 2)
  );

  // Generate client (React)
  await generateReactTemplate(
    path.join(projectDir, 'packages', 'client'),
    { ...config, name: `${config.name}-client` }
  );

  // Generate server
  await generateServerTemplate(
    path.join(projectDir, 'packages', 'server'),
    { ...config, name: `${config.name}-server` }
  );

  // Shared types package
  const sharedPackageJson = {
    name: `${config.name}-shared`,
    version: '0.1.0',
    private: true,
    type: 'module',
    main: './dist/index.js',
    types: './dist/index.d.ts',
    scripts: {
      build: 'tsc',
    },
    devDependencies: {
      typescript: '^5.7.3',
    },
  };

  await writeFile(
    path.join(projectDir, 'packages', 'shared', 'package.json'),
    JSON.stringify(sharedPackageJson, null, 2)
  );

  const sharedTsconfig = {
    compilerOptions: {
      target: 'ES2022',
      module: 'ESNext',
      moduleResolution: 'bundler',
      declaration: true,
      outDir: './dist',
      rootDir: './src',
      strict: true,
      skipLibCheck: true,
    },
    include: ['src'],
  };

  await writeFile(
    path.join(projectDir, 'packages', 'shared', 'tsconfig.json'),
    JSON.stringify(sharedTsconfig, null, 2)
  );

  await ensureDir(path.join(projectDir, 'packages', 'shared', 'src'));

  const sharedIndex = `// Shared types between client and server
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
`;

  await writeFile(
    path.join(projectDir, 'packages', 'shared', 'src', 'index.ts'),
    sharedIndex
  );

  // Root README
  const readme = `# ${config.name}

Full-stack monorepo built with [ForgeStack](https://forgedevstack.com).

## Structure

\`\`\`
packages/
  ├── client/    # React frontend
  ├── server/    # Express API
  └── shared/    # Shared types
\`\`\`

## Getting Started

\`\`\`bash
# Install dependencies
${config.packageManager} install

# Run development (client + server)
${config.packageManager}${config.packageManager === 'yarn' ? '' : ' run'} dev

# Run only client
${config.packageManager}${config.packageManager === 'yarn' ? '' : ' run'} dev:client

# Run only server
${config.packageManager}${config.packageManager === 'yarn' ? '' : ' run'} dev:server
\`\`\`

## Ports

- Client: http://localhost:5173
- Server: http://localhost:3001
`;

  await writeFile(path.join(projectDir, 'README.md'), readme);

  // Root .gitignore
  const gitignore = `node_modules
dist
build
.env
.env.local
.DS_Store
*.log
`;

  await writeFile(path.join(projectDir, '.gitignore'), gitignore);
};
