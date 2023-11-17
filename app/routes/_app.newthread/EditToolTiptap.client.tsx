import Button from '@components/Button';
import {
  useEditor,
  EditorContent,
  Editor,
  type EditorContentProps,
  type JSONContent,
  type HTMLContent,
} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import clsx from 'clsx';
import { useEffect } from 'react';

const extensions = [StarterKit];

const baseClass = 'border border-primary-300 rounded';
const baseClass1 =
  'bg-primary-50 min-h-[15rem]  border-t border-primary-300 max-h-[15rem] overflow-y-auto transition-[background-color_outline] ease-in-out outline-none';

interface EditProps extends EditorContentProps {
  editor: Editor | null;
}
type props = {
  content: HTMLContent | JSONContent | JSONContent[] | null;
  setContent: any;
};
const ListButton = ({ editor }: EditProps) => {
  return (
    <div className="p-2 flex gap-5">
      <Button
        type="button"
        variant="primary"
        onPress={() => editor?.chain().focus().toggleBold().run()}
        isDisabled={!editor?.can().chain().focus().toggleBold().run()}
        className={clsx(
          'bg-transparent border border-solid border-primary-950 text-primary-950',
          {
            'is-active': editor?.isActive('bold'),
          }
        )}
      >
        B
      </Button>
      <Button
        type="button"
        variant="primary"
        onPress={() => editor?.chain().focus().toggleBold().run()}
        isDisabled={!editor?.can().chain().focus().toggleBold().run()}
        className={clsx(
          'bg-transparent border border-solid border-primary-950 text-primary-950',
          {
            'is-active': editor?.isActive('bold'),
          }
        )}
      >
        I
      </Button>
      <Button
        type="button"
        variant="primary"
        onPress={() => editor?.chain().focus().toggleBold().run()}
        isDisabled={!editor?.can().chain().focus().toggleBold().run()}
        className={clsx(
          'bg-transparent border border-solid border-primary-950 text-primary-950',
          {
            'is-active': editor?.isActive('bold'),
          }
        )}
      >
        B
      </Button>
      <Button
        type="button"
        variant="primary"
        onPress={() => editor?.chain().focus().toggleBold().run()}
        isDisabled={!editor?.can().chain().focus().toggleBold().run()}
        className={clsx(
          'bg-transparent border border-solid border-primary-950 text-primary-950 p-1',
          {
            'is-active': editor?.isActive('bold'),
          }
        )}
      >
        B
      </Button>
      <Button
        type="button"
        variant="primary"
        onPress={() => editor?.chain().focus().toggleBold().run()}
        isDisabled={!editor?.can().chain().focus().toggleBold().run()}
        className={clsx(
          'bg-transparent border border-solid border-primary-950 text-primary-950',
          {
            'is-active': editor?.isActive('bold'),
          }
        )}
      >
        B
      </Button>
    </div>
  );
};
const Tiptap = ({ content, setContent }: props) => {
  const editor = useEditor({
    extensions,
    content: content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: baseClass1,
      },
    },
  });
  useEffect(() => {
    if (editor?.isEmpty && content !== '<p></p>') {
      editor.commands.setContent(content);
    }
  }, [content]);
  return (
    <>
      <div className={baseClass}>
        <ListButton editor={editor} />
        <EditorContent editor={editor} />
      </div>
    </>
  );
};

export default Tiptap;
