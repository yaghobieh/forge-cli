import fs from 'fs-extra';
import path from 'path';
import { execa } from 'execa';
import type { PackageManager } from '../ui/prompts.js';

export const getPackageManagerCommand = (pm: PackageManager) => {
  const commands = {
    npm: { install: 'npm install', add: 'npm install', exec: 'npx' },
    pnpm: { install: 'pnpm install', add: 'pnpm add', exec: 'pnpm dlx' },
    yarn: { install: 'yarn', add: 'yarn add', exec: 'yarn dlx' },
    bun: { install: 'bun install', add: 'bun add', exec: 'bunx' },
  };
  return commands[pm];
};

export const runCommand = async (
  command: string,
  args: string[],
  cwd: string
): Promise<void> => {
  await execa(command, args, { cwd, stdio: 'inherit' });
};

export const installDependencies = async (
  pm: PackageManager,
  cwd: string
): Promise<void> => {
  const commands: Record<PackageManager, { cmd: string; args: string[] }> = {
    npm: { cmd: 'npm', args: ['install'] },
    pnpm: { cmd: 'pnpm', args: ['install'] },
    yarn: { cmd: 'yarn', args: [] },
    bun: { cmd: 'bun', args: ['install'] },
  };
  
  const { cmd, args } = commands[pm];
  await execa(cmd, args, { cwd, stdio: 'pipe' });
};

export const addPackages = async (
  pm: PackageManager,
  packages: string[],
  cwd: string,
  dev = false
): Promise<void> => {
  if (packages.length === 0) return;
  
  const commands: Record<PackageManager, { cmd: string; args: string[] }> = {
    npm: { cmd: 'npm', args: ['install', ...(dev ? ['-D'] : []), ...packages] },
    pnpm: { cmd: 'pnpm', args: ['add', ...(dev ? ['-D'] : []), ...packages] },
    yarn: { cmd: 'yarn', args: ['add', ...(dev ? ['-D'] : []), ...packages] },
    bun: { cmd: 'bun', args: ['add', ...(dev ? ['-d'] : []), ...packages] },
  };
  
  const { cmd, args } = commands[pm];
  await execa(cmd, args, { cwd, stdio: 'pipe' });
};

export const copyTemplate = async (
  templateDir: string,
  targetDir: string
): Promise<void> => {
  await fs.copy(templateDir, targetDir);
};

export const ensureDir = async (dir: string): Promise<void> => {
  await fs.ensureDir(dir);
};

export const writeFile = async (
  filePath: string,
  content: string
): Promise<void> => {
  await fs.writeFile(filePath, content, 'utf-8');
};

export const readFile = async (filePath: string): Promise<string> => {
  return fs.readFile(filePath, 'utf-8');
};

export const pathExists = async (filePath: string): Promise<boolean> => {
  return fs.pathExists(filePath);
};

export const updatePackageJson = async (
  projectDir: string,
  updates: Record<string, unknown>
): Promise<void> => {
  const pkgPath = path.join(projectDir, 'package.json');
  const pkg = await fs.readJson(pkgPath);
  const updated = { ...pkg, ...updates };
  await fs.writeJson(pkgPath, updated, { spaces: 2 });
};

export const getTemplateDir = (): string => {
  return path.join(import.meta.dirname, '..', 'templates');
};

/**
 * Fetch latest version of a package from npm
 */
export const getLatestVersion = async (packageName: string): Promise<string | null> => {
  try {
    const response = await fetch(`https://registry.npmjs.org/${packageName}/latest`);
    if (!response.ok) return null;
    const data = await response.json() as { version: string };
    return `^${data.version}`;
  } catch {
    return null;
  }
};
