'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Toolbar from './Toolbar'

interface EditorProps {
  initialContent: string
  editable: boolean
  onChange?: (html: string) => void
}

export default function Editor({ initialContent, editable, onChange }: EditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent,
    editable,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          'prose max-w-none min-h-[500px] p-6 focus:outline-none text-gray-900',
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
  })

  return (
    <div className="border rounded-lg bg-white shadow-sm overflow-hidden">
      {editable && <Toolbar editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  )
}