import { useEffect } from 'react';
import Placeholder from '@tiptap/extension-placeholder';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

interface RichTextEditorProps {
  description: string;
  setDescription: (value: string) => void;
}

const RichTextEditor = ({ description, setDescription }: RichTextEditorProps) => {
  const sampleDesc = `Describe your event...`;

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: sampleDesc
      })
    ],
    content: `${description}` || sampleDesc,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setDescription(html);
    },
    editorProps: {
      attributes: {
        class:
          'min-h-[100px] w-full rounded-md border border-border bg-input px-3 py-1 shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-5'
      }
    }
  });

  useEffect(() => {
    if (editor?.getText() == sampleDesc) {
      editor?.commands.setContent(description);
    }
  }, [description]);

  return <EditorContent editor={editor} />;
};

export default RichTextEditor;
