# Changelog

## 1.0.5 (2026-04-13)

### New Packages

- **AeroCraft** - CSS utility framework choice: AeroCraft vs Tailwind prompt with comparison table showing advantages (component recipes, runtime theming, model API, custom prefix, smaller bundle)
- **Lingo** - Translation & localization with AI-powered translations, React hooks. Replaces i18n libs (i18next, react-intl)
- **Rail** - Modular carousel & slider engine. Touch-ready, accessible, infinite scroll. Replaces Swiper/Embla
- **Torch** - Media player (video, audio, reels, ads) with tracking & analytics. Replaces Video.js/Plyr
- **Kiln** - Component docs & showcase. Lightweight Storybook alternative with live preview

### New Features

- **CSS Framework Choice** - Interactive prompt: AeroCraft vs Tailwind vs None, with side-by-side comparison table
- **Comparison Tables** - Beautiful terminal tables showing ForgeStack advantages vs alternatives:
  - Compass vs React Router (type safety, guards, bundle size, middleware)
  - ForgeStack packages vs alternatives (Grid Table, Lingo, Torch, Rail, Forge Query, Synapse)
- **`forge add aerocraft`** - Install AeroCraft standalone to any project

### Dependency Updates (All Versions Corrected)

| Package | Version | Previous |
|---------|---------|----------|
| Bear UI | `^1.2.2` | `^1.0.7` |
| AeroCraft | `^1.0.4` | — (new) |
| Grid Table | `^1.0.8` | `^1.0.0` |
| Anvil | `^1.0.6` | `^1.0.0` |
| Forge Compass | `^1.0.2` | `^1.2.1` |
| Synapse | `^1.0.2` | `^1.0.0` |
| Forge Query | `^1.0.1` | `^1.0.0` |
| Harbor | `^1.6.2` | `^1.6.0` |
| Kiln | `^1.0.5` | — (new) |

### Improvements

- Package selection prompt expanded to 12 ForgeStack packages with "replaces X" descriptions
- `forge add` interactive menu includes 16 packages (added AeroCraft, Lingo, Rail, Torch)
- `--yes` quick mode defaults to AeroCraft + all packages
- Kiln and Crucible grouped as devDependencies in a single install step
- `react.ts` template generates `package.json` with all new packages (lingo, rail, torch, kiln, aerocraft)
- CLI version synchronized across `package.json` (`1.2.0`), Commander, and welcome banner

### Future Plans Updated

- [x] i18n integration (shipped as **Lingo**)
- [x] CSS utility framework (shipped as **AeroCraft**)

---

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

- [x] Component library preview (shipped as **Kiln**)
- [ ] Database integration templates (Prisma, Drizzle)
- [ ] CI/CD pipeline templates (GitHub Actions, GitLab CI)
- [ ] Plugin system for custom templates
- [ ] Project upgrade command
- [ ] Workspace/Monorepo support
- [x] Test setup (shipped as **Crucible**)
- [x] i18n integration (shipped as **Lingo**)
- [x] Media player (shipped as **Torch**)
- [x] Carousel / slider (shipped as **Rail**)
- [ ] PWA support
- [ ] SSR/SSG templates
