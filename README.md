# Forge CLI

<p align="center">
  <img src="docs/assets/logo.svg" alt="Forge CLI" width="200" />
</p>

<p align="center">
  <strong>Create and manage ForgeStack projects with ease</strong>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/create-forge"><img src="https://img.shields.io/npm/v/create-forge.svg?style=flat-square&color=ec4899" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/create-forge"><img src="https://img.shields.io/npm/dm/create-forge.svg?style=flat-square&color=8b5cf6" alt="npm downloads" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/npm/l/create-forge.svg?style=flat-square" alt="license" /></a>
</p>

---

## Quick Start

```bash
# With npx
npx create-forge my-app

# With pnpm
pnpm create forge my-app

# With yarn
yarn create forge my-app

# With bun
bunx create-forge my-app
```

## Features

- **Multiple Templates** - React, Server, Full-Stack monorepo
- **Select All Packages** - One-click to include all ForgeStack packages
- **Bear UI Integration** - Beautiful component library with customizable themes
- **Synapse State** - Powerful state management with "nuclear" folder structure
- **Forge Compass** - Type-safe routing with guards
- **Forge Form** - Advanced form management
- **Forge Query** - Data fetching with caching
- **Grid Table** - Powerful data grid component
- **Anvil Utils** - Common utilities and hooks
- **Harbor Backend** - Complete Node.js framework (MongoDB, JWT, WebSocket, Scheduling)
- **Multiple Package Managers** - npm, pnpm, yarn, bun
- **Docker Support** - Production-ready Dockerfile and docker-compose
- **Code Generators** - Generate pages, components, and slices

## Commands

### Create a New Project

```bash
forge create [project-name]

# Options:
#   -t, --template <template>       Project template (react, server, fullstack)
#   -p, --package-manager <pm>      Package manager (npm, pnpm, yarn, bun)
#   -o, --out-dir <path>            Output directory
#   -y, --yes                       Skip prompts and use defaults
```

### Add ForgeStack Packages

```bash
forge add [package]

# Available packages:
#   bear          - UI Component Library
#   grid-table    - Data Grid
#   forge-query   - Data Fetching
#   forge-form    - Form Management
#   forge-compass - Routing
#   synapse       - State Management
#   anvil         - Utilities & Hooks
#   harbor        - Backend Framework

# Options:
#   -c, --color <hex>               Bear UI primary color
```

### Generate Synapse Nuclear Slice

```bash
forge nuclear [slice-name]

# Options:
#   -p, --path <path>               Base path (default: src)
```

## Templates

### React (`react`)
- Vite + React 18 + TypeScript
- Bear UI with theme customization
- Forge Compass routing
- Synapse state with nuclear structure
- Anvil utilities
- Grid Table for data display
- API layer with Synapse hooks

### Server Only (`server`)

Choose between two server frameworks:

| Framework | Description |
|-----------|-------------|
| **Harbor** | ForgeStack's complete backend framework (recommended) |
| Express | Standard Express.js setup |

**Harbor includes:**
- Zero-config server (Express under the hood)
- MongoDB ODM (optional)
- JWT authentication ready
- Built-in validation
- Rate limiting & caching
- Health checks & metrics

### Full-Stack Monorepo (`fullstack`)
- Workspace-based monorepo
- Client with React + Vite
- Server with **Harbor** or Express

## Project Structure

```
src/
├── api/                # API client & hooks
├── components/         # UI components
│   ├── Layout/
│   └── common/
├── config/             # App configuration
├── pages/              # Page components
│   └── Home/
│       ├── Home.tsx
│       ├── Home.types.ts
│       └── index.ts
├── types/              # TypeScript types
└── nuclear/            # Synapse state (if enabled)
    ├── config/
    └── slices/
        └── app/
            ├── app.nucleus.ts
            ├── app.hooks.ts
            └── index.ts
```

## Generated Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Generate new page
npm run generate:page

# Generate new component
npm run generate:component

# Generate Synapse slice
npm run generate:slice

# Docker
npm run docker:build
npm run docker:compose
```

## Examples

### Create with All Options

```bash
npx create-forge my-app --template react --package-manager pnpm --yes
```

### Custom Output Directory

```bash
npx create-forge my-app --out-dir ./projects/my-app
```

### Add Packages to Existing Project

```bash
cd my-project
npx forge add bear --color "#3b82f6"
npx forge add synapse
npx forge nuclear user
npx forge nuclear cart
```

## ForgeStack Packages

| Package | Version | Description |
|---------|---------|-------------|
| `@forgedevstack/bear` | ![npm](https://img.shields.io/npm/v/@forgedevstack/bear?style=flat-square&label=) | UI Component Library |
| `@forgedevstack/synapse` | ![npm](https://img.shields.io/npm/v/@forgedevstack/synapse?style=flat-square&label=) | State Management |
| `@forgedevstack/forge-compass` | ![npm](https://img.shields.io/npm/v/@forgedevstack/forge-compass?style=flat-square&label=) | Routing |
| `@forgedevstack/forge-form` | ![npm](https://img.shields.io/npm/v/@forgedevstack/forge-form?style=flat-square&label=) | Form Management |
| `@forgedevstack/forge-query` | ![npm](https://img.shields.io/npm/v/@forgedevstack/forge-query?style=flat-square&label=) | Data Fetching |
| `@forgedevstack/grid-table` | ![npm](https://img.shields.io/npm/v/@forgedevstack/grid-table?style=flat-square&label=) | Data Grid |
| `@forgedevstack/anvil` | ![npm](https://img.shields.io/npm/v/@forgedevstack/anvil?style=flat-square&label=) | Utilities |
| `@forgedevstack/harbor` | ![npm](https://img.shields.io/npm/v/@forgedevstack/harbor?style=flat-square&label=) | Backend Framework |

## Documentation

- [ForgeStack](https://forgedevstack.com)
- [Bear UI](https://forgedevstack.com/bear)
- [Synapse](https://forgedevstack.com/synapse)
- [Forge Compass](https://forgedevstack.com/compass)
- [Grid Table](https://forgedevstack.com/table)
- [**Harbor**](https://forgedevstack.com/harbor)

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for release history.

## License

MIT © [ForgeStack](https://forgedevstack.com)
