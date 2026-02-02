/**
 * Adds two numbers together.
 * @param a - The first number.
 * @param b - The second number.
 * @returns The sum of a and b.
 */
export const add = (a: number, b: number): number => {
  return a + b;
};

/**
 * Checks if a number is even.
 * @param n - The number to check.
 * @returns True if the number is even, false otherwise.
 */
export const isEven = (n: number): boolean => {
  return n % 2 === 0;
};

/**
 * Converts a string to a slug.
 * @param str - The string to convert.
 * @returns The slugified string.
 */
export const toSlug = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};
