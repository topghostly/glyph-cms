"use client"

import { createContext, useContext } from "react"
import { useEditor, Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'


const EditorContext = createContext<Editor | null>(null)

export const EditorProvider = ({ children }: { children: React.ReactNode }) => {
    const editor = useEditor({
        extensions: [StarterKit],
        content: "<p>Hello World! 🌎️</p>",
        editorProps: {
            attributes: {
                class: "w-full max-h-[80vh] min-h-[300px] overflow-y-scroll scrollbar-h pt-3 px-2 pb-3 border border-accent rounded outline-accent font-medium",
            },
        },
    });

    return (
        <EditorContext.Provider value={editor}>{children}</EditorContext.Provider>
    )
}


export const useEditorContext = () => {
    return useContext(EditorContext)
}