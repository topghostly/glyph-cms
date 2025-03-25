import { Separator } from "@/components/ui/separator";
import React, { useEffect } from "react";
import { Structure } from "./task/structure";
import { Ellipsis, Plus } from "lucide-react";
import { StartBlog } from "./task/start-blog";
import { useBlogStore } from "@/store/blog-store";
import { EditorInterface } from "../Editor";
import { useAuth } from "@/store/auth-store";
import RichTextRenderer from "./task/preview-blog";

export const ActiveTask: React.FC<EditorInterface> = ({ session }) => {
  const activeTask = useBlogStore((state) => state.activeTask);
  const setActiveBlog = useBlogStore((state) => state.setActiveBlog);
  const setActiveTask = useBlogStore((state) => state.setActiveTask);
  const activeBlog = useBlogStore((state) => state.activeBlog);

  const { updateSession } = useAuth();

  useEffect(() => {
    updateSession(session);
  });
  return (
    <div className="w-full h-full overflow-y-scroll relative scrollbar-h">
      <div className="h-[50px] gap-3 px-3 flex items-center justify-end text-white/80 cursor-pointer">
        <div className="w-7 h-7 grid place-content-center rounded hover:bg-accent">
          <Ellipsis size={18} />
        </div>
        <div className="w-7 h-7 grid place-content-center rounded hover:bg-accent">
          <Plus
            size={18}
            className="rotate-45"
            onClick={() => {
              setActiveBlog(null);
              setActiveTask(null);
            }}
          />
        </div>
      </div>
      <Separator />
      <div className="px-2 pt-5 h-full mx-auto max-w-[750px]">
        {activeBlog ? (
          <>
            <div>{activeTask === "structure" && <Structure />}</div>
            <div>{activeTask === "preview" && <RichTextRenderer />}</div>
          </>
        ) : (
          <StartBlog />
        )}
      </div>
    </div>
  );
};
