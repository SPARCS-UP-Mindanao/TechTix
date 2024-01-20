import { useEffect } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

interface RichTextContentProps {
  content: string;
}

function RichTextContent({ content }: RichTextContentProps) {
  const editor = useEditor({
    editable: false,
    content: `${content}`,
    extensions: [StarterKit]
  });

  useEffect(() => {
    editor?.commands.setContent(`${content}`);
  }, [content]);

  return <EditorContent editor={editor} />;
}

export default RichTextContent;
