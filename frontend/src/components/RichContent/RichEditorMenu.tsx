import { FC, useCallback, useEffect, useMemo } from 'react';
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  Link,
  List,
  ListOrdered,
  Strikethrough,
  Underline
} from 'lucide-react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import { cn } from '@/utils/classes';
import Button from '../Button';
import { FormDescription, FormError, FormItem, FormLabel } from '../Form';
import { IconComponentAttributes } from '../Icon';
import Input from '../Input';
import { Popover, PopoverContent, PopoverTrigger } from '../Popover';
import Toggle from '../Toggle';
import { zodResolver } from '@hookform/resolvers/zod';
import { Editor } from '@tiptap/react';

interface EditorMenuOptionProps {
  editor: Editor;
  id: any;
  title: string;
  Icon: FC<IconComponentAttributes>;
  onClick: () => void;
}

const EditorMenuOption = ({ editor, id: option, title, Icon, onClick }: EditorMenuOptionProps) => {
  const optionId: [string, object | undefined] = useMemo(() => {
    if (typeof option !== 'string') {
      const { id, ...rest } = option;
      if (!id) {
        return ['', rest];
      }
      return [id, rest];
    } else {
      return [option, undefined];
    }
  }, [option]);

  return (
    <Toggle pressed={editor.isActive(...optionId)} className="p-3" title={title} onPressedChange={onClick}>
      <Icon className={cn('w-5 h-5', editor.isActive(...optionId) && 'text-primary-400')} />
    </Toggle>
  );
};

interface LinkOptionProps {
  editor: Editor;
}

const LinkSchema = z.object({
  text: z.string().optional(),
  link: z
    .string()
    .min(1, {
      message: 'Link is required'
    })
    .refine((value) => /^https?:\/\//.test(value), { message: 'Invalid link format' })
});

const LinkOption = ({ editor }: LinkOptionProps) => {
  const getCurrentContent = useCallback(() => {
    const pos = editor.state.selection.$from.pos;
    const node = editor.state.doc.nodeAt(pos);
    const nodeContent = node?.textContent;

    return nodeContent;
  }, [editor]);

  const linkElementClass = 'underline underline-offset-4 text-primary-400';

  const currentLink: string = editor.getAttributes('link').href;
  const form = useForm<z.infer<typeof LinkSchema>>({
    mode: 'onChange',
    resolver: zodResolver(LinkSchema),
    defaultValues: {
      text: '',
      link: currentLink
    }
  });

  const attachLink = form.handleSubmit(({ text, link }) => {
    if (!text) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: link, target: '_blank', class: linkElementClass }).run();
    } else {
      const textWithLink = `<p><a href="${link}" target="_blank" rel="noopener noreferrer nofollow" class="${linkElementClass}">${text}</a></p>`;
      editor.chain().focus().insertContent(textWithLink).run();
    }
    form.reset(() => ({ text: '', link: '' }));
  });

  const removeLink = useCallback(() => {
    editor.chain().focus().unsetLink().run();
  }, [editor]);

  const clearLink = useCallback(() => form.setValue('link', ''), [form]);

  useEffect(() => {
    if (currentLink) {
      form.setValue('link', currentLink);
      form.setValue('text', getCurrentContent());
    } else {
      clearLink();
      form.setValue('text', '');
    }
  }, [currentLink, editor, form, clearLink, getCurrentContent]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Toggle title="Attach link" pressed={!!currentLink} className="p-3">
          <Link className={cn('w-5 h-5', editor.isActive('link') && 'text-primary-400')} />
        </Toggle>
      </PopoverTrigger>
      <PopoverContent onInteractOutside={clearLink} className="p-4 space-y-2">
        <FormProvider {...form}>
          <p className="font-bold">Attach a link to the selected text or insert a text with a link.</p>
          <FormItem name="text">
            {({ field }) => (
              <div className="flex flex-col">
                <FormLabel optional>Text</FormLabel>
                <Input {...field} />
              </div>
            )}
          </FormItem>
          <FormItem name="link">
            {({ field }) => (
              <div className="flex flex-col">
                <FormLabel>Link</FormLabel>
                <Input {...field} />
                <FormDescription>Link must start with http://www or https://www</FormDescription>
                <FormError />
              </div>
            )}
          </FormItem>
          <div className="flex justify-end space-x-2">
            <Button className="" variant="ghost" onClick={removeLink}>
              Unlink
            </Button>
            <Button className="" onClick={attachLink}>
              Attach
            </Button>
          </div>
        </FormProvider>
      </PopoverContent>
    </Popover>
  );
};

interface RichEditorMenuProps {
  editor: Editor;
}

const RichEditorMenu = ({ editor }: RichEditorMenuProps) => {
  return (
    <menu className="flex flex-wrap gap-x-8">
      <div>
        <EditorMenuOption editor={editor} id="bold" title="Bold" Icon={Bold} onClick={() => editor.chain().focus().toggleBold().run()} />
        <EditorMenuOption editor={editor} id="italic" title="Italic" Icon={Italic} onClick={() => editor.chain().focus().toggleItalic().run()} />
        <EditorMenuOption editor={editor} id="underline" title="Underline" Icon={Underline} onClick={() => editor.chain().focus().toggleUnderline().run()} />
        <EditorMenuOption editor={editor} id="strike" title="Strikeout" Icon={Strikethrough} onClick={() => editor.chain().focus().toggleStrike().run()} />
      </div>

      <div>
        <EditorMenuOption
          editor={editor}
          id={{ id: 'heading', level: 1 }}
          title="Heading 1"
          Icon={Heading1}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        />

        <EditorMenuOption
          editor={editor}
          id={{ id: 'heading', level: 2 }}
          title="Heading 2"
          Icon={Heading2}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        />

        <EditorMenuOption
          editor={editor}
          id={{ id: 'heading', level: 3 }}
          title="Heading 3"
          Icon={Heading3}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        />
      </div>

      <div>
        <EditorMenuOption
          editor={editor}
          id={{ textAlign: 'left' }}
          title="Align left"
          Icon={AlignLeft}
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
        />

        <EditorMenuOption
          editor={editor}
          id={{ textAlign: 'center' }}
          title="Align center"
          Icon={AlignCenter}
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
        />

        <EditorMenuOption
          editor={editor}
          id={{ textAlign: 'right' }}
          title="Align right"
          Icon={AlignRight}
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
        />

        <EditorMenuOption
          editor={editor}
          id={{ textAlign: 'justify' }}
          title="Align justify"
          Icon={AlignJustify}
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        />
      </div>

      <div>
        <EditorMenuOption editor={editor} id="bulletList" title="Bulleted list" Icon={List} onClick={() => editor.chain().focus().toggleBulletList().run()} />
        <EditorMenuOption
          editor={editor}
          id="orderedList"
          title="Ordered List"
          Icon={ListOrdered}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        />
      </div>

      <LinkOption editor={editor} />
    </menu>
  );
};

export default RichEditorMenu;
