import type { Content } from '@tiptap/react';
import { describe, expect, it } from 'vitest';
import { sanitizeRichContent, sanitizeRichHtmlContent } from './RichTextContent';

describe('RichTextContent XSS protections', () => {
  it('sanitizes malicious HTML strings', () => {
    const maliciousHtml =
      '<p>Safe text</p><img src="x" onerror="alert(1)" /><script>alert("xss")</script><a href="javascript:alert(1)">click</a>';

    const sanitizedHtml = sanitizeRichHtmlContent(maliciousHtml).toLowerCase();

    expect(sanitizedHtml).toContain('<p>safe text</p>');
    expect(sanitizedHtml).not.toContain('<script');
    expect(sanitizedHtml).not.toContain('onerror');
    expect(sanitizedHtml).not.toContain('javascript:');
  });

  it('sanitizes HTML when content is a string', () => {
    const maliciousContent = '<div><svg onload="alert(1)"></svg></div>';
    const sanitizedContent = sanitizeRichContent(maliciousContent);

    expect(typeof sanitizedContent).toBe('string');
    expect((sanitizedContent as string).toLowerCase()).not.toContain('onload');
  });

  it('keeps JSON content as-is (no HTML injection path)', () => {
    const jsonContent: Content = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'FAQ content from editor JSON' }]
        }
      ]
    };

    const sanitizedContent = sanitizeRichContent(jsonContent);

    expect(sanitizedContent).toBe(jsonContent);
  });
});
