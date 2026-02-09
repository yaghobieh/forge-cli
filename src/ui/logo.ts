import gradient from 'gradient-string';
import { GRADIENT_COLORS } from './colors.js';

const FORGE_LOGO = `
    ███████╗ ██████╗ ██████╗  ██████╗ ███████╗
    ██╔════╝██╔═══██╗██╔══██╗██╔════╝ ██╔════╝
    █████╗  ██║   ██║██████╔╝██║  ███╗█████╗  
    ██╔══╝  ██║   ██║██╔══██╗██║   ██║██╔══╝  
    ██║     ╚██████╔╝██║  ██║╚██████╔╝███████╗
    ╚═╝      ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚══════╝
`;

const FORGE_SMALL = `
  ⚒️  FORGE CLI
`;

const forgeGradient = gradient(GRADIENT_COLORS);

export const printLogo = (): void => {
  console.log(forgeGradient.multiline(FORGE_LOGO));
  console.log();
};

export const printSmallLogo = (): void => {
  console.log(forgeGradient(FORGE_SMALL));
};

export const printWelcome = (version: string): void => {
  printLogo();
  console.log(forgeGradient(`  Create powerful React apps with ForgeStack`));
  console.log(`  ${gradient(['#71717a', '#a1a1aa'])(`v${version}`)}`);
  console.log();
};

export const printSuccess = (message: string): void => {
  console.log(forgeGradient(`  ✨ ${message}`));
};

export const printGradient = (text: string): string => {
  return forgeGradient(text);
};
