"use client";

import { Editor } from "@/components/editor/Editor";
import { AuthProvider } from "@/store/auth-store";
import { BlogStore } from "@/store/blog-store";

export default function Home() {
  return (
    <AuthProvider>
      <BlogStore.Provider
        initialValue={{
          isSearching: false,
          blogs: [],
        }}
      >
        <div className="w-screen max-h-screen h-screen bg-background overflow-hidden select-none">
          <Editor />
        </div>
      </BlogStore.Provider>
    </AuthProvider>
  );
}
