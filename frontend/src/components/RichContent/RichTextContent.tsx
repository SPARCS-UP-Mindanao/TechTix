import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { Content, EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

interface RichTextContentProps {
  content: Content;
}

function RichTextContent({ content }: RichTextContentProps) {
  const editor = useEditor({
    editable: false,
    content: content,
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['heading', 'paragraph']
      }),
      Underline,
      Link,
      Placeholder
    ],
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
