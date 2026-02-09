import ora, { Ora } from 'ora';
import chalk from 'chalk';
import { COLORS } from './colors.js';

const pink = chalk.hex(COLORS.primary);
const success = chalk.hex(COLORS.success);
const error = chalk.hex(COLORS.error);

export const createSpinner = (text: string): Ora => {
  return ora({
    text: pink(text),
    color: 'magenta',
    spinner: 'dots12',
  });
};

export const spinnerSuccess = (spinner: Ora, text: string): void => {
  spinner.succeed(success(text));
};

export const spinnerError = (spinner: Ora, text: string): void => {
  spinner.fail(error(text));
};

export const spinnerInfo = (spinner: Ora, text: string): void => {
  spinner.info(chalk.hex(COLORS.info)(text));
};
