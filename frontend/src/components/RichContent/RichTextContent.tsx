import { cn } from '@/utils/classes';
import './RichContent.css';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import { Content, EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

interface RichTextContentProps {
  content: Content;
  className?: string;
}

function RichTextContent({ content, className }: RichTextContentProps) {
  const editor = useEditor({
    editable: false,
    content,
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
      editor.commands.setContent(content);
    },
    onUpdate: ({ editor }) => {
      editor.commands.setContent(content);
    }
  });

  return <EditorContent editor={editor} />;
}

export default RichTextContent;
