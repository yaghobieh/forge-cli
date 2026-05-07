import path from 'path';
import { writeFile, ensureDir } from '../utils/index.js';
import type { ProjectConfig } from '../ui/prompts.js';

/**
 * Generate Express.js server template
 */
const generateExpressTemplate = async (
  projectDir: string,
  config: ProjectConfig
): Promise<void> => {
  // Create directory structure
  await ensureDir(path.join(projectDir, 'src'));
  await ensureDir(path.join(projectDir, 'src', 'routes'));
  await ensureDir(path.join(projectDir, 'src', 'controllers'));
  await ensureDir(path.join(projectDir, 'src', 'services'));
  await ensureDir(path.join(projectDir, 'src', 'middleware'));
  await ensureDir(path.join(projectDir, 'src', 'utils'));
  await ensureDir(path.join(projectDir, 'src', 'types'));

  // package.json
  const packageJson = {
    name: config.name,
    version: '0.1.0',
    private: true,
    type: 'module',
    scripts: {
      dev: 'tsx watch src/index.ts',
      build: 'tsc',
      start: 'node dist/index.js',
      lint: 'eslint . --ext ts --report-unused-disable-directives --max-warnings 0',
    },
    dependencies: {
      express: '^4.21.2',
      cors: '^2.8.5',
      helmet: '^8.0.0',
      dotenv: '^16.4.7',
    },
    devDependencies: {
      '@types/express': '^5.0.0',
      '@types/cors': '^2.8.17',
      '@types/node': '^22.10.5',
      tsx: '^4.19.2',
      typescript: '^5.7.3',
      eslint: '^9.18.0',
    },
  };

  await writeFile(
    path.join(projectDir, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );

  // tsconfig.json
  const tsconfig = {
    compilerOptions: {
      target: 'ES2022',
      module: 'ESNext',
      moduleResolution: 'bundler',
      lib: ['ES2022'],
      outDir: './dist',
      rootDir: './src',
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
      resolveJsonModule: true,
      declaration: true,
      noUnusedLocals: true,
      noUnusedParameters: true,
      paths: {
        '@/*': ['./src/*'],
        '@routes/*': ['./src/routes/*'],
        '@controllers/*': ['./src/controllers/*'],
        '@services/*': ['./src/services/*'],
        '@middleware/*': ['./src/middleware/*'],
      },
    },
    include: ['src/**/*'],
    exclude: ['node_modules', 'dist'],
  };

  await writeFile(
    path.join(projectDir, 'tsconfig.json'),
    JSON.stringify(tsconfig, null, 2)
  );

  // src/index.ts
  const indexTs = `import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { apiRouter } from './routes/api.js';
import { errorHandler } from './middleware/error.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', apiRouter);

// Health check
app.get('/health', (_, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(\`🚀 Server running on http://localhost:\${PORT}\`);
  console.log(\`📡 API available at http://localhost:\${PORT}/api\`);
});

export default app;
`;

  await writeFile(path.join(projectDir, 'src', 'index.ts'), indexTs);

  // src/routes/api.ts
  const apiRouter = `import { Router } from 'express';
import { getUsers, getUserById, createUser } from '../controllers/user.js';

export const apiRouter = Router();

// User routes
apiRouter.get('/users', getUsers);
apiRouter.get('/users/:id', getUserById);
apiRouter.post('/users', createUser);

// Add more routes here
`;

  await writeFile(path.join(projectDir, 'src', 'routes', 'api.ts'), apiRouter);

  // src/controllers/user.ts
  const userController = `import type { Request, Response, NextFunction } from 'express';
import { userService } from '../services/user.js';

export const getUsers = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await userService.findAll();
    res.json({ data: users });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await userService.findById(req.params.id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json({ data: user });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await userService.create(req.body);
    res.status(201).json({ data: user });
  } catch (error) {
    next(error);
  }
};
`;

  await writeFile(path.join(projectDir, 'src', 'controllers', 'user.ts'), userController);

  // src/services/user.ts
  const userService = `import type { User } from '../types/user.js';

// Mock data - replace with database
const users: User[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
];

export const userService = {
  async findAll(): Promise<User[]> {
    return users;
  },

  async findById(id: string): Promise<User | undefined> {
    return users.find((u) => u.id === id);
  },

  async create(data: Omit<User, 'id'>): Promise<User> {
    const user: User = {
      id: String(users.length + 1),
      ...data,
    };
    users.push(user);
    return user;
  },
};
`;

  await writeFile(path.join(projectDir, 'src', 'services', 'user.ts'), userService);

  // src/types/user.ts
  const userType = `export interface User {
  id: string;
  name: string;
  email: string;
}
`;

  await writeFile(path.join(projectDir, 'src', 'types', 'user.ts'), userType);

  // src/middleware/error.ts
  const errorMiddleware = `import type { Request, Response, NextFunction } from 'express';

export interface ApiError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  err: ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('Error:', err.message);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
`;

  await writeFile(path.join(projectDir, 'src', 'middleware', 'error.ts'), errorMiddleware);

  // Common files
  await generateServerCommonFiles(projectDir, config, 'express');
};

/**
 * Generate Harbor server template
 */
const generateHarborTemplate = async (
  projectDir: string,
  config: ProjectConfig
): Promise<void> => {
  // Create directory structure
  await ensureDir(path.join(projectDir, 'src'));
  await ensureDir(path.join(projectDir, 'src', 'routes'));
  await ensureDir(path.join(projectDir, 'src', 'controllers'));
  await ensureDir(path.join(projectDir, 'src', 'services'));
  await ensureDir(path.join(projectDir, 'src', 'models'));
  await ensureDir(path.join(projectDir, 'src', 'middleware'));
  await ensureDir(path.join(projectDir, 'src', 'constants'));
  await ensureDir(path.join(projectDir, 'src', 'types'));

  // package.json
  const serverDevDeps: Record<string, string> = {
    '@types/node': '^22.10.5',
    tsx: '^4.19.2',
    typescript: '^5.7.3',
    eslint: '^9.18.0',
  };

  if (config.includeCrucible) {
    serverDevDeps['@forgedevstack/crucible'] = '^1.0.0';
  }

  const packageJson = {
    name: config.name,
    version: '0.1.0',
    private: true,
    type: 'module',
    scripts: {
      dev: 'tsx watch src/index.ts',
      build: 'tsc',
      start: 'node dist/index.js',
      lint: 'eslint . --ext ts --report-unused-disable-directives --max-warnings 0',
      'generate:model': 'npx @forgedevstack/harbor generate model',
      'generate:controller': 'npx @forgedevstack/harbor generate controller',
      'generate:route': 'npx @forgedevstack/harbor generate route',
    },
    dependencies: {
      '@forgedevstack/harbor': '^1.6.2',
      dotenv: '^16.4.7',
    },
    devDependencies: serverDevDeps,
  };

  await writeFile(
    path.join(projectDir, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );

  // tsconfig.json
  const tsconfig = {
    compilerOptions: {
      target: 'ES2022',
      module: 'ESNext',
      moduleResolution: 'bundler',
      lib: ['ES2022'],
      outDir: './dist',
      rootDir: './src',
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
      resolveJsonModule: true,
      declaration: true,
      noUnusedLocals: true,
      noUnusedParameters: true,
      paths: {
        '@/*': ['./src/*'],
        '@routes/*': ['./src/routes/*'],
        '@controllers/*': ['./src/controllers/*'],
        '@services/*': ['./src/services/*'],
        '@models/*': ['./src/models/*'],
        '@middleware/*': ['./src/middleware/*'],
        '@constants/*': ['./src/constants/*'],
      },
    },
    include: ['src/**/*'],
    exclude: ['node_modules', 'dist'],
  };

  await writeFile(
    path.join(projectDir, 'tsconfig.json'),
    JSON.stringify(tsconfig, null, 2)
  );

  // harbor.config.json
  const harborConfig = {
    server: {
      port: 3001,
      host: 'localhost',
      cors: {
        enabled: true,
        origin: '*',
      },
    },
    database: {
      uri: '${MONGODB_URI}',
    },
    logger: {
      level: 'info',
    },
    errors: {
      showStack: true,
    },
  };

  await writeFile(
    path.join(projectDir, 'harbor.config.json'),
    JSON.stringify(harborConfig, null, 2)
  );

  // src/index.ts
  const indexTs = `import { createServer, connect, httpLogger } from '@forgedevstack/harbor';
import { userRoutes } from './routes/index.js';
import { config } from './constants/config.js';

async function bootstrap() {
  // Connect to MongoDB (optional - comment out if not using)
  if (config.MONGODB_URI) {
    await connect(config.MONGODB_URI);
    console.log('⚡ Connected to MongoDB');
  }

  // Create server with Harbor
  const server = createServer({
    port: config.PORT,
    cors: true,
    bodyParser: true,
  });

  // Add HTTP request logger
  server.use(httpLogger());

  // Register routes
  server.use(userRoutes);

  // Health check endpoint
  server.get('/health', () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '0.1.0',
  }));

  console.log(\`🚀 Server running on http://localhost:\${config.PORT}\`);
  console.log(\`📡 API available at http://localhost:\${config.PORT}/api\`);
}

bootstrap().catch(console.error);
`;

  await writeFile(path.join(projectDir, 'src', 'index.ts'), indexTs);

  // src/constants/config.ts
  const configTs = `import 'dotenv/config';

export const config = {
  // Server
  PORT: parseInt(process.env.PORT || '3001', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Database
  MONGODB_URI: process.env.MONGODB_URI || '',
  DB_NAME: process.env.DB_NAME || '${config.name.replace(/-/g, '_')}',
  
  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  
  // CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  
  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  
  // Rate Limiting
  RATE_LIMIT_WINDOW: parseInt(process.env.RATE_LIMIT_WINDOW || '900000', 10),
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
} as const;
`;

  await writeFile(path.join(projectDir, 'src', 'constants', 'config.ts'), configTs);

  // src/constants/index.ts
  await writeFile(
    path.join(projectDir, 'src', 'constants', 'index.ts'),
    `export * from './config.js';\n`
  );

  // src/routes/user.routes.ts
  const userRoutes = `import { router, GET, POST, PUT, DELETE } from '@forgedevstack/harbor';
import { UserController } from '../controllers/index.js';

// Create user routes with Harbor's clean API
export const userRoutes = router('/api/users', [
  // GET /api/users - List all users
  GET('/', UserController.getAll),
  
  // GET /api/users/:id - Get user by ID
  GET('/:id', UserController.getById),
  
  // POST /api/users - Create new user
  POST('/', UserController.create, {
    validation: {
      body: {
        email: { type: 'email', required: true },
        name: { type: 'string', required: true, min: 2, max: 100 },
      },
    },
  }),
  
  // PUT /api/users/:id - Update user
  PUT('/:id', UserController.update),
  
  // DELETE /api/users/:id - Delete user
  DELETE('/:id', UserController.delete),
]);
`;

  await writeFile(path.join(projectDir, 'src', 'routes', 'user.routes.ts'), userRoutes);

  // src/routes/index.ts
  await writeFile(
    path.join(projectDir, 'src', 'routes', 'index.ts'),
    `export * from './user.routes.js';\n`
  );

  // src/controllers/user.controller.ts
  const userController = `import type { HarborRequest } from '@forgedevstack/harbor';
import { UserService } from '../services/index.js';

export const UserController = {
  async getAll() {
    const users = await UserService.findAll();
    return { users };
  },

  async getById(req: HarborRequest) {
    const user = await UserService.findById(req.params.id);
    if (!user) {
      throw new Error('User not found');
    }
    return { user };
  },

  async create(req: HarborRequest) {
    const { email, name } = req.body;
    const user = await UserService.create({ email, name });
    return { user };
  },

  async update(req: HarborRequest) {
    const user = await UserService.update(req.params.id, req.body);
    if (!user) {
      throw new Error('User not found');
    }
    return { user };
  },

  async delete(req: HarborRequest) {
    const success = await UserService.delete(req.params.id);
    if (!success) {
      throw new Error('User not found');
    }
    return { deleted: true };
  },
};
`;

  await writeFile(path.join(projectDir, 'src', 'controllers', 'user.controller.ts'), userController);

  // src/controllers/index.ts
  await writeFile(
    path.join(projectDir, 'src', 'controllers', 'index.ts'),
    `export * from './user.controller.js';\n`
  );

  // src/services/user.service.ts
  const userService = `import type { User, CreateUserDto, UpdateUserDto } from '../types/index.js';

// In-memory store (replace with Harbor's MongoDB ODM in production)
const users: User[] = [
  { id: '1', email: 'john@example.com', name: 'John Doe', createdAt: new Date() },
  { id: '2', email: 'jane@example.com', name: 'Jane Smith', createdAt: new Date() },
];

export class UserService {
  static async findAll(): Promise<User[]> {
    return users;
  }

  static async findById(id: string): Promise<User | undefined> {
    return users.find((u) => u.id === id);
  }

  static async findByEmail(email: string): Promise<User | undefined> {
    return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  static async create(data: CreateUserDto): Promise<User> {
    const user: User = {
      id: String(users.length + 1),
      ...data,
      createdAt: new Date(),
    };
    users.push(user);
    return user;
  }

  static async update(id: string, data: UpdateUserDto): Promise<User | undefined> {
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) return undefined;
    
    users[index] = { ...users[index], ...data };
    return users[index];
  }

  static async delete(id: string): Promise<boolean> {
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) return false;
    
    users.splice(index, 1);
    return true;
  }
}
`;

  await writeFile(path.join(projectDir, 'src', 'services', 'user.service.ts'), userService);

  // src/services/index.ts
  await writeFile(
    path.join(projectDir, 'src', 'services', 'index.ts'),
    `export * from './user.service.js';\n`
  );

  // src/types/user.types.ts
  const userTypes = `export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface CreateUserDto {
  email: string;
  name: string;
}

export interface UpdateUserDto {
  email?: string;
  name?: string;
}
`;

  await writeFile(path.join(projectDir, 'src', 'types', 'user.types.ts'), userTypes);

  // src/types/index.ts
  await writeFile(
    path.join(projectDir, 'src', 'types', 'index.ts'),
    `export * from './user.types.js';\n`
  );

  // Common files
  await generateServerCommonFiles(projectDir, config, 'harbor');
};

/**
 * Generate common server files
 */
const generateServerCommonFiles = async (
  projectDir: string,
  config: ProjectConfig,
  framework: 'express' | 'harbor'
): Promise<void> => {
  // .env
  const envFile = framework === 'harbor' 
    ? `PORT=3001
NODE_ENV=development
MONGODB_URI=
DB_NAME=${config.name.replace(/-/g, '_')}
JWT_SECRET=your-secret-key-change-in-production
CORS_ORIGIN=*
LOG_LEVEL=info
`
    : `PORT=3001
NODE_ENV=development
`;

  await writeFile(path.join(projectDir, '.env'), envFile);

  // .env.example
  const envExample = framework === 'harbor'
    ? `PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/myapp
DB_NAME=${config.name.replace(/-/g, '_')}
JWT_SECRET=your-secret-key-change-in-production
CORS_ORIGIN=*
LOG_LEVEL=info
`
    : `PORT=3001
NODE_ENV=development
DATABASE_URL=
`;

  await writeFile(path.join(projectDir, '.env.example'), envExample);

  // .gitignore
  const gitignore = `node_modules
dist
.env
.env.local
.DS_Store
*.log
`;

  await writeFile(path.join(projectDir, '.gitignore'), gitignore);

  // Docker files if requested
  if (config.includeDocker) {
    // Dockerfile
    const dockerfile = `FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev

ENV NODE_ENV=production
EXPOSE 3001

CMD ["node", "dist/index.js"]
`;

    await writeFile(path.join(projectDir, 'Dockerfile'), dockerfile);

    // docker-compose.yml
    const dockerCompose = framework === 'harbor'
      ? `version: '3.8'

services:
  api:
    build: .
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - PORT=3001
      - MONGODB_URI=mongodb://mongo:27017/${config.name.replace(/-/g, '_')}
    depends_on:
      - mongo
    restart: unless-stopped

  mongo:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    restart: unless-stopped

volumes:
  mongo_data:
`
      : `version: '3.8'

services:
  api:
    build: .
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - PORT=3001
    restart: unless-stopped
`;

    await writeFile(path.join(projectDir, 'docker-compose.yml'), dockerCompose);
  }

  // README.md
  const readme = framework === 'harbor'
    ? `# ${config.name}

API server built with [**Harbor**](https://forgedevstack.com/harbor) - ForgeStack's complete backend framework.

## Features

- Zero-config server with Express under the hood
- MongoDB ODM (optional)
- Built-in validation
- JWT authentication ready
- Rate limiting
- CORS configured
- Health checks

## Getting Started

\`\`\`bash
# Development
${config.packageManager}${config.packageManager === 'yarn' ? '' : ' run'} dev

# Production
${config.packageManager}${config.packageManager === 'yarn' ? '' : ' run'} build
${config.packageManager}${config.packageManager === 'yarn' ? '' : ' run'} start
\`\`\`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /health | Health check |
| GET | /api/users | Get all users |
| GET | /api/users/:id | Get user by ID |
| POST | /api/users | Create user |
| PUT | /api/users/:id | Update user |
| DELETE | /api/users/:id | Delete user |

## Generate Code

\`\`\`bash
# Generate a new model
${config.packageManager}${config.packageManager === 'yarn' ? '' : ' run'} generate:model Product

# Generate a new controller
${config.packageManager}${config.packageManager === 'yarn' ? '' : ' run'} generate:controller Product

# Generate a new route
${config.packageManager}${config.packageManager === 'yarn' ? '' : ' run'} generate:route products
\`\`\`

## MongoDB Setup (Optional)

1. Copy \`.env.example\` to \`.env\`
2. Set \`MONGODB_URI\` to your MongoDB connection string
3. Harbor will automatically connect on startup

## Docker

\`\`\`bash
# Build and run with Docker Compose
docker-compose up -d
\`\`\`

## Documentation

- [Harbor Docs](https://forgedevstack.com/harbor)
- [ForgeStack](https://forgedevstack.com)
`
    : `# ${config.name}

Express.js API server built with [ForgeStack](https://forgedevstack.com).

## Getting Started

\`\`\`bash
# Development
${config.packageManager}${config.packageManager === 'yarn' ? '' : ' run'} dev

# Production
${config.packageManager}${config.packageManager === 'yarn' ? '' : ' run'} build
${config.packageManager}${config.packageManager === 'yarn' ? '' : ' run'} start
\`\`\`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /health | Health check |
| GET | /api/users | Get all users |
| GET | /api/users/:id | Get user by ID |
| POST | /api/users | Create user |

## Environment Variables

Copy \`.env.example\` to \`.env\` and configure:

- \`PORT\` - Server port (default: 3001)
- \`NODE_ENV\` - Environment (development/production)
`;

  await writeFile(path.join(projectDir, 'README.md'), readme);
};

/**
 * Main export - generates server template based on framework choice
 */
export const generateServerTemplate = async (
  projectDir: string,
  config: ProjectConfig
): Promise<void> => {
  if (config.serverFramework === 'harbor') {
    await generateHarborTemplate(projectDir, config);
  } else {
    await generateExpressTemplate(projectDir, config);
  }
};
