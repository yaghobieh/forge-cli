# Changelog

## 1.0.1 (2026-02-16)

### New Features

- **Relay Support** - Added `@forgedevstack/relay` (HTTP client & WebSockets) to create and add commands
- **Forge Auth Support** - Added `@forgedevstack/forge-auth` (Authentication & OAuth) to create and add commands
- **Crucible Testing** - Added `@forgedevstack/crucible` (testing framework) with scope selection (client, server, both)
- **Crucible as DevDependency** - Crucible is automatically installed as a devDependency when selected
- **Crucible Scope Prompt** - Interactive prompt to choose testing scope: Frontend, Backend, or Both
- **Auto-generated Test Setup** - `crucible.setup.ts` and `example.test.ts` generated based on chosen scope

### Improvements

- Package selection prompt now includes 8 ForgeStack packages (up from 5)
- `--yes` flag now includes all new packages by default
- Updated packages table to show Relay, Forge Auth, and Crucible
- Added `--scope` option to `forge add crucible` for non-interactive usage

---

## 1.0.0-rc.2 (2026-02-08)

### Fixes

- Fixed multi-select packages using `enquirer.MultiSelect` directly for better control
- Updated ForgeStack portal with improved mobile responsive design
- Added more comprehensive CLI documentation to portal

---

## 1.0.0-rc.1 (2026-02-08)

### New Features

- **Select All Packages** - One-click option to include all ForgeStack packages
- **Multi-select Packages** - Choose multiple packages with space key
- **Harbor Server Template** - Complete backend framework for server projects
- **Server Framework Choice** - Choose between **Harbor** or Express for server templates
- **Forge Query Integration** - Data fetching option for frontend projects
- **Packages Table** - Shows all ForgeStack dependencies with versions after project creation

### Improvements

- Better package selection UI with "ALL" option at top
- Hint text shows how to select multiple packages
- ForgeStack packages table displayed in "Next steps" section
- Harbor template includes MongoDB, JWT, validation out of the box
- Server template generates Harbor's clean router API
- Updated documentation with Harbor examples

---

## 1.0.0-beta (2026-02-08)

### New Features

- **Output Directory** - `--out-dir` option to specify output path
- **Docker Support** - Dockerfile, docker-compose, nginx.conf included
- **Code Generators** - Built-in scripts for pages, components, slices
- **Latest Versions** - Fetches latest package versions from npm
- **Anvil Integration** - Utilities included by default
- **Grid Table Page** - Users page with data grid example
- **Synapse API Hooks** - useQuery/useMutation examples
- **Proper Folder Structure** - PageName/PageName.tsx pattern

### Improvements

- Removed custom hooks (use from packages)
- Install prompt now uses select instead of confirm
- Better project structure with alias paths
- Bear ThemeProvider example in main.tsx

---

## 1.0.0-alpha (2026-02-08)

### Initial Release

First alpha release of Forge CLI.

#### Commands

- **`forge create`** - Create new ForgeStack projects
- **`forge add`** - Add ForgeStack packages
- **`forge nuclear`** - Generate Synapse slices

#### Features

- Bear UI Integration with custom colors
- Synapse Nuclear folder structure
- Multi-PM Support (npm, pnpm, yarn, bun)
- Quick mode with `--yes` flag

#### Templates

| Template | Description |
|----------|-------------|
| `react` | Vite + React 18 + TypeScript |
| `server` | Express.js API |
| `fullstack` | Monorepo |

---

## Future Plans

- [ ] Component library preview
- [ ] Database integration templates (Prisma, Drizzle)
- [ ] CI/CD pipeline templates (GitHub Actions, GitLab CI)
- [ ] Plugin system for custom templates
- [ ] Project upgrade command
- [ ] Workspace/Monorepo support
- [x] Test setup (Crucible)
- [ ] i18n integration
- [ ] PWA support
- [ ] SSR/SSG templates
