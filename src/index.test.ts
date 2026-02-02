import { describe, it, expect } from 'vitest';
import { add, isEven, toSlug } from './index';

describe('add', () => {
  it('should add two numbers correctly', () => {
    expect(add(1, 2)).toBe(3);
  });
});

describe('isEven', () => {
  it('should return true for even numbers', () => {
    expect(isEven(2)).toBe(true);
  });

  it('should return false for odd numbers', () => {
    expect(isEven(3)).toBe(false);
  });
});

describe('toSlug', () => {
  it('should convert string to slug', () => {
    expect(toSlug('Hello World')).toBe('hello-world');
    expect(toSlug('Hello World! 123')).toBe('hello-world-123');
  });
});
