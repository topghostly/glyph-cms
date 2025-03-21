'use client'

import { useEditorContext } from '@/store/editor'
import { EditorContent } from '@tiptap/react'

export const TextEditor = () => {
    const editor = useEditorContext();

    return <EditorContent editor={editor} />
}