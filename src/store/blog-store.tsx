"use client";

import React from "react";
import { createStore } from "zustand/vanilla";
import { persist, createJSONStorage } from "zustand/middleware";
import { useStore } from "zustand";
import { BlogState, Blog } from "@/type/blog";
import { createZustandContext } from "@/lib/zustand-context";

const getStore = (initialState: { blogs: Blog[]; isSearching: false }) => {
  return createStore<BlogState>()(
    persist(
      (set) => ({
        blogs: initialState.blogs,
        addBlog: (blog: Blog) => {
          set((state) => ({ blogs: [...state.blogs, { ...blog }] }));
        },
        deleteBlog: (id: string) => {
          set((state) => ({
            blogs: state.blogs.filter((blog) => blog._localID !== id),
          }));
        },
        updateBlog: (blog: Blog) => {
          set((state) => {
            const updatedBlogs = state.blogs.map((b) =>
              b._localID === blog._localID ? blog : b
            );

            return {
              blogs: updatedBlogs,
              activeBlog:
                state.activeBlog?._localID === blog._localID
                  ? blog
                  : state.activeBlog,
            };
          });
        },
        activeBlog: null,
        setActiveBlog: (id: string | null) => {
          set((state) => ({
            activeBlog: state.blogs.find((b) => b._localID === id) || null,
          }));
        },
        activeTask: null,
        setActiveTask: (task: "structure" | "preview" | "code" | null) => {
          set((state) => ({ activeTask: task }));
        },
        isSearching: false,
        setIsSearcing: (mode: boolean) => {
          set((state) => ({ isSearching: mode }));
        },
        listMode: "all",
        setListMode: (mode: "all" | "category") => {
          set((state) => ({ listMode: mode }));
        },
      }),
      { name: "local-blogs", storage: createJSONStorage(() => localStorage) }
    )
  );
};

export const BlogStore = createZustandContext(getStore);

export function useBlogStore<T>(selector: (state: BlogState) => T) {
  const store = React.useContext(BlogStore.Context);

  if (!store)
    throw new Error(
      "useBlogStore must be used within a BlogStoreProvider OR Missing BlogStore provider"
    );

  return useStore(store, selector);
}
