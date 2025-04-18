"use client";

import { Separator } from "../ui/separator";
import { Topbar } from "./components/top-bar";
import { AuthProvider } from "@/store/auth-store";
import { BlogStore } from "@/store/blog-store";
import { ArticleLayers } from "./components/subject-layers";
import { ListLayers } from "./components/list-layers";
import { ActiveTask } from "./components/active-task";
import { Session } from "next-auth";
import { useEffect, useState } from "react";
import { MonitorCheck } from "lucide-react";
import { getAllBlogs } from "@/util/getAllBlog";

export interface EditorInterface {
  session: Session;
}

export const Editor: React.FC<EditorInterface> = ({ session }) => {
  const [isScreenTooSmall, setIsScreenTooSmall] = useState(true);
  // const [loading, setLoading] = useState<boolean>();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsScreenTooSmall(window.innerWidth < 920);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    getAllBlogs();
  }, []);

  if (isScreenTooSmall) {
    return (
      <div className="grid place-content-center min-h-[100vh] min-w-[100vw] w-full h-full">
        <p className="text-white/60 mt-2 flex justify-center flex-col items-center gap-3 w-[300px] text-center">
          <MonitorCheck size={30} />
          Please use a larger screen (at least 950px wide) to access this
          application.
        </p>
      </div>
    );
  }

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
