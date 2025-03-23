"use client"

import { Editor } from "@/components/editor/Editor";
import { BlogStore } from "@/store/blog-store";


export default function Home() {
  return (
    <BlogStore.Provider initialValue={{
      isSearching: false,
      blogs: []
    }}>
      <div className="w-screen max-h-screen h-screen bg-background overflow-hidden select-none">
        <Editor />
      </div>
    </BlogStore.Provider>
  );
}
