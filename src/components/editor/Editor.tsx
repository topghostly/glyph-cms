"use client";

import { Separator } from "../ui/separator";
import { Topbar } from "./components/top-bar";
import { BlogStore, useBlogStore } from "@/store/blog-store";
import { ArticleLayers } from "./components/subject-layers";
import { ListLayers } from "./components/list-layers";
import { ActiveTask } from "./components/active-task";
import { Session } from "next-auth";
import HandleBlogSync from "./components/handle-sync-blog";

export interface EditorInterface {
  session: Session;
}

export const Editor: React.FC<EditorInterface> = ({ session }) => {
  return (
    <BlogStore.Provider
      initialValue={{
        isSearching: false,
        blogs: [],
      }}
    >
      <DashboardShell session={session} />
    </BlogStore.Provider>
  );
};

/**
 * Below `lg` there isn't room for all three panes side by side, so exactly
 * one of the post list or the active editor pane shows at a time, driven by
 * `activeBlog` (mirrors a typical mobile drill-down: list -> tap -> editor,
 * back via the control in ActiveTask's header). At `lg` and up all panes are
 * always visible regardless of `activeBlog`, matching the original desktop
 * layout.
 */
const DashboardShell: React.FC<EditorInterface> = ({ session }) => {
  const activeBlog = useBlogStore((state) => state.activeBlog);

  return (
    <main className="h-screen w-full relative grid grid-rows-[3.75rem_0.5px_1fr]">
      <HandleBlogSync />
      <Topbar session={session} />
      <Separator className="h-[0.2px] bg-accent" />
      <div className="flex w-full min-h-full relative px-3 overflow-x-hidden">
        <Separator orientation="vertical" className="hidden lg:block" />
        <ArticleLayers className="hidden lg:flex" />
        <Separator orientation="vertical" className="hidden lg:block" />
        <ListLayers
          session={session}
          className={activeBlog ? "hidden lg:block" : undefined}
        />
        <Separator orientation="vertical" className="hidden lg:block" />
        <ActiveTask
          session={session}
          className={!activeBlog ? "hidden lg:block" : undefined}
        />
        <Separator orientation="vertical" className="hidden lg:block" />
      </div>
    </main>
  );
};
