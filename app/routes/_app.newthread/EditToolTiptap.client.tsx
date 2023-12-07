import Button from '@components/Button';
import { ListBulletIcon, PencilSquareIcon } from '@heroicons/react/20/solid';
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
import Blockquote from '@tiptap/extension-blockquote';
import ListItem from '@tiptap/extension-list-item';

const extensions = [StarterKit, Blockquote, ListItem];

const baseClass = 'border border-primary-300 rounded';
const baseClass1 =
  'bg-primary-50 min-h-[15rem] px-4 py-2 border-t border-primary-300 max-h-[15rem] overflow-y-auto transition-[background-color_outline] ease-in-out outline-none';

interface EditProps extends EditorContentProps {
  editor: Editor | null;
}
type props = {
  content: HTMLContent | JSONContent | JSONContent[] | null;
  setContent: any;
};
const ListButton = ({ editor }: EditProps) => {
  return (
    <div className="px-4 py-2 flex gap-6">
      <div className="flex gap-3">
        <Button
          type="button"
          variant="primary"
          onPress={() => editor?.chain().focus().toggleBold().run()}
          isDisabled={!editor?.can().chain().focus().toggleBold().run()}
          className={clsx(
            'bg-transparent border border-solid border-primary-950 text-primary-950 font-bold p-0 w-8',
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
          onPress={() => editor?.chain().focus().toggleItalic().run()}
          isDisabled={!editor?.can().chain().focus().toggleItalic().run()}
          className={clsx(
            'bg-transparent border border-solid border-primary-950 text-primary-950 font-bold p-0 w-8',
            {
              'is-active': editor?.isActive('bold'),
            }
          )}
        >
          I
        </Button>
      </div>
      <div className="flex gap-3">
        <Button
          type="button"
          variant="primary"
          onPress={() =>
            editor?.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={clsx(
            'bg-transparent border border-solid border-primary-950 text-primary-950 font-bold p-0 w-8',
            {
              'is-active': editor?.isActive('heading', { level: 1 }),
            }
          )}
        >
          h1
        </Button>
        <Button
          type="button"
          variant="primary"
          onPress={() =>
            editor?.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={clsx(
            'bg-transparent border border-solid border-primary-950 text-primary-950 font-bold p-0 w-8',
            {
              'is-active': editor?.isActive('heading', { level: 2 }),
            }
          )}
        >
          h2
        </Button>
        <Button
          type="button"
          variant="primary"
          onPress={() =>
            editor?.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={clsx(
            'bg-transparent border border-solid border-primary-950 text-primary-950 font-bold p-0 w-8',
            {
              'is-active': editor?.isActive('heading', { level: 3 }),
            }
          )}
        >
          h3
        </Button>
      </div>
      <div className="flex gap-3">
        <Button
          type="button"
          variant="primary"
          onPress={() => editor?.chain().focus().toggleBlockquote().run()}
          className={clsx(
            'bg-transparent border border-solid border-primary-950 text-primary-950 font-bold px-[0.4rem]',
            {
              'is-active': editor?.isActive('blockquote'),
            }
          )}
        >
          <PencilSquareIcon className="h-5 aspect-square" />
        </Button>
        <Button
          type="button"
          variant="primary"
          onPress={() => editor?.chain().focus().toggleBulletList().run()}
          className={clsx(
            'bg-transparent border border-solid border-primary-950 text-primary-950 font-bold px-[0.4rem]',
            {
              'is-active': editor?.isActive('bulletList'),
            }
          )}
        >
          <ListBulletIcon className="h-5 aspect-square" />
        </Button>
      </div>
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
