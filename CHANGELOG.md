# Changelog

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
- [ ] Test setup (Vitest, Playwright)
- [ ] i18n integration
- [ ] PWA support
- [ ] SSR/SSG templates
