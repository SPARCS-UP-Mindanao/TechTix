import { describe, it, expect } from 'vitest';
import { cn } from '../classes';

// Basic merging

describe('cn', () => {
  it('merges multiple class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('deduplicates class names', () => {
    expect(cn('text-sm', 'text-sm', 'bar')).toBe('text-sm bar');
  });

  it('handles falsy values', () => {
    expect(cn('foo', false, null, undefined, '', 'bar')).toBe('foo bar');
  });

  it('merges tailwind classes and resolves conflicts', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4'); // tailwind-merge keeps the last
    expect(cn('text-sm', 'text-lg')).toBe('text-lg');
  });

  it('handles conditional classes (clsx object syntax)', () => {
    expect(cn('foo', { bar: true, baz: false })).toBe('foo bar');
  });

  it('returns an empty string if no classes are provided', () => {
    expect(cn()).toBe('');
  });
});
