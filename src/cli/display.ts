import chalk from 'chalk';
import boxen from 'boxen';

/**
 * Display error message with emoji and formatting
 */
export function displayError(message: string): void {
  console.error(chalk.red(`\n❌ ${message}`));
}

/**
 * Display success message with emoji and formatting
 */
export function displaySuccess(message: string): void {
  console.log(chalk.green(`\n✅ ${message}`));
}

/**
 * Display info message
 */
export function displayInfo(message: string): void {
  console.log(chalk.blue(`\nℹ️  ${message}`));
}

/**
 * Display warning message
 */
export function displayWarning(message: string): void {
  console.log(chalk.yellow(`\n⚠️  ${message}`));
}

/**
 * Display image details in a nice boxed format
 */
export function displayImageInfo(image: {
  url: string;
  width: number;
  height: number;
  author: string;
  authorUrl?: string;
  originalUrl: string;
}, providerName: string): void {
  const content = [
    `${chalk.bold('🎨 Provider:')} ${chalk.cyan(providerName)}`,
    `${chalk.bold('📐 Size:')} ${chalk.yellow(`${image.width}x${image.height}`)}`,
    `${chalk.bold('👤 Author:')} ${chalk.magenta(image.author)}`,
    image.authorUrl ? `${chalk.bold('🔗 Author URL:')} ${chalk.gray(image.authorUrl)}` : '',
    `${chalk.bold('🌐 Original:')} ${chalk.gray(image.originalUrl)}`,
    `${chalk.bold('📷 Image URL:')} ${chalk.gray(image.url)}`,
  ].filter(Boolean).join('\n');

  console.log('\n' + boxen(content, {
    padding: 1,
    margin: 1,
    borderStyle: 'round',
    borderColor: 'green',
    title: '🖼️  Image Details',
    titleAlignment: 'center',
  }));
}

/**
 * Display download success info
 */
export function displayDownloadSuccess(filePath: string): void {
  const content = `${chalk.bold('📁 Saved to:')} ${chalk.cyan(filePath)}`;
  
  console.log('\n' + boxen(content, {
    padding: 1,
    margin: 1,
    borderStyle: 'round',
    borderColor: 'blue',
    title: '💾 Download Complete',
    titleAlignment: 'center',
  }));
}

/**
 * Display available providers
 */
export function displayAvailableProviders(providers: string[]): void {
  console.log(chalk.bold('\n📌 Available providers:'));
  providers.forEach(p => console.log(chalk.cyan(`   • ${p}`)));
}
