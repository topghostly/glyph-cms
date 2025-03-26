"use client";

import { Separator } from "../ui/separator";
import { Topbar } from "./components/top-bar";
import { AuthProvider } from "@/store/auth-store";
import { BlogStore } from "@/store/blog-store";
import { ArticleLayers } from "./components/subject-layers";
import { ListLayers } from "./components/list-layers";
import { ActiveTask } from "./components/active-task";
import { Session } from "next-auth";

export interface EditorInterface {
  session: Session;
}

export const Editor: React.FC<EditorInterface> = ({ session }) => {
  return (
    <AuthProvider>
      <BlogStore.Provider
        initialValue={{
          isSearching: false,
          blogs: [],
        }}
      >
        <main className="h-screen w-full relative grid grid-rows-[3.75rem_0.5px_1fr]">
          <Topbar />
          <Separator className="h-[0.2px] bg-accent" />
          <div className="flex w-full min-h-full relative px-3 max-w-[1440px] mx-auto overflow-x-hidden">
            <Separator orientation="vertical" />
            <ArticleLayers />
            <Separator orientation="vertical" />
            <ListLayers />
            <Separator orientation="vertical" />
            <ActiveTask session={session} />
            <Separator orientation="vertical" />
            {/* <Toolbar /> */}
          </div>
        </main>
      </BlogStore.Provider>
    </AuthProvider>
  );
};
