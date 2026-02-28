import { cn } from '@/utils/classes';
import './RichContent.css';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import { Content, EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import DOMPurify from 'dompurify';

interface RichTextContentProps {
  content: Content;
  className?: string;
}

export const sanitizeRichHtmlContent = (value: string): string =>
  DOMPurify.sanitize(value, {
    USE_PROFILES: { html: true }
  });

export const sanitizeRichContent = (value: Content): Content => {
  if (typeof value !== 'string') {
    return value;
  }
  return sanitizeRichHtmlContent(value);
};

/**
 * Security notes:
 * - Event descriptions / FAQs that arrive as HTML strings are sanitized with DOMPurify before TipTap renders them.
 * - JSON content is rendered via TipTap's node schema and is not injected as raw HTML.
 * - If JSON content is converted to HTML for rendering elsewhere, sanitize that HTML with
 *   `sanitizeRichHtmlContent` before using it (for example with `dangerouslySetInnerHTML`).
 * - Unit test is RichTextContent.test.ts, invoke using npm --prefix frontend run test:unit -- src/components/RichContent/RichTextContent.test.ts
 */

function RichTextContent({ content, className }: RichTextContentProps) {
  const sanitizedContent = sanitizeRichContent(content);

  const editor = useEditor({
    editable: false,
    content: sanitizedContent,
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['heading', 'paragraph']
      }),
      Placeholder
    ],
    editorProps: {
      attributes: {
        class: cn(className)
      }
    },
    onCreate: ({ editor }) => {
      editor.commands.setContent(sanitizedContent);
    },
    onUpdate: ({ editor }) => {
      editor.commands.setContent(sanitizedContent);
    }
  });

  return <EditorContent editor={editor} />;
}

export default RichTextContent;
