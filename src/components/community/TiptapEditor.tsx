'use client';

import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, Italic, List, ListOrdered, Quote, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TiptapEditorProps {
  content: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
}

export function TiptapEditor({
  content,
  onChange,
  placeholder = 'Draft your inquiry or legal analysis here...',
  className,
  minHeight = '140px',
}: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc pl-5 my-2 space-y-1',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal pl-5 my-2 space-y-1',
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: 'border-l-2 border-slate-400 dark:border-slate-600 pl-3 italic text-muted-foreground my-2',
          },
        },
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'is-editor-empty before:text-muted-foreground/60 before:content-[attr(data-placeholder)] before:float-left before:pointer-events-none',
      }),
    ],
    content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: cn(
          'prose dark:prose-invert prose-sm max-w-none focus:outline-none text-foreground text-sm p-3.5',
          'min-h-[' + minHeight + ']'
        ),
        style: `min-height: ${minHeight};`,
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Keep editor content synchronized if parent clears or changes it
  useEffect(() => {
    if (editor && content !== editor.getHTML() && content === '') {
      editor.commands.setContent('');
    }
  }, [content, editor]);

  if (!editor) {
    return (
      <div
        className={cn(
          'w-full rounded-md border border-border bg-secondary/30 p-3 text-xs text-muted-foreground animate-pulse',
          className
        )}
        style={{ minHeight }}
      >
        Loading legal editor...
      </div>
    );
  }

  const insertSectionSymbol = () => {
    editor.chain().focus().insertContent('§ ').run();
  };

  return (
    <div
      className={cn(
        'w-full rounded-md border border-border bg-card overflow-hidden focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all',
        className
      )}
    >
      {/* Editor Formatting Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b border-border bg-secondary/40 px-2 py-1.5 text-muted-foreground">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn(
            'p-1.5 rounded hover:bg-secondary hover:text-foreground transition-colors',
            editor.isActive('bold') && 'bg-secondary text-foreground font-bold'
          )}
          title="Bold (⌘B)"
        >
          <Bold className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn(
            'p-1.5 rounded hover:bg-secondary hover:text-foreground transition-colors',
            editor.isActive('italic') && 'bg-secondary text-foreground italic'
          )}
          title="Italic (⌘I)"
        >
          <Italic className="w-3.5 h-3.5" />
        </button>

        <div className="w-[1px] h-4 bg-border mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn(
            'p-1.5 rounded hover:bg-secondary hover:text-foreground transition-colors',
            editor.isActive('bulletList') && 'bg-secondary text-foreground'
          )}
          title="Bullet List"
        >
          <List className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn(
            'p-1.5 rounded hover:bg-secondary hover:text-foreground transition-colors',
            editor.isActive('orderedList') && 'bg-secondary text-foreground'
          )}
          title="Numbered List"
        >
          <ListOrdered className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={cn(
            'p-1.5 rounded hover:bg-secondary hover:text-foreground transition-colors',
            editor.isActive('blockquote') && 'bg-secondary text-foreground font-semibold'
          )}
          title="Statutory Blockquote"
        >
          <Quote className="w-3.5 h-3.5" />
        </button>

        <div className="w-[1px] h-4 bg-border mx-1" />

        {/* Legal Shortcut: Section Symbol */}
        <button
          type="button"
          onClick={insertSectionSymbol}
          className="px-2 py-1 rounded text-xs font-serif font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
          title="Insert Section Symbol (§)"
        >
          § Sec
        </button>

        <div className="ml-auto flex items-center">
          <button
            type="button"
            onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
            className="p-1 rounded text-[11px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            title="Clear formatting"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Editable Canvas */}
      <EditorContent editor={editor} />
    </div>
  );
}
