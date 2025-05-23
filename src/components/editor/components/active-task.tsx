import { Separator } from "@/components/ui/separator";
import React, { useEffect } from "react";
import { Structure } from "./task/structure";
import { Ellipsis, Plus, UserRoundPen, ExternalLink } from "lucide-react";
import { StartBlog } from "./task/start-blog";
import { useBlogStore } from "@/store/blog-store";
import { EditorInterface } from "../Editor";
import { useAuth } from "@/store/auth-store";
import RichTextRenderer from "./task/preview-blog";
import CodePreview from "./task/code-preview";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

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
        {activeBlog && (
          <>
            <div className="w-7 h-7 grid place-content-center rounded hover:bg-accent">
              <DropdownMenu>
                <DropdownMenuTrigger className="outline-none">
                  <div className="flex justify-center items-center w-full h-full">
                    <Ellipsis size={18} />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={async () => {
                        try {
                          if (!activeBlog?._localID) return;
                          await navigator.clipboard.writeText(
                            `https://www.getglyph.app/blogs/post/${activeBlog._localID}`
                          );

                          toast("✅ External blog link copied");
                        } catch (error) {
                          toast("❌ Unable to copy blog link");
                          console.log(error);
                        }
                      }}
                    >
                      <ExternalLink />
                      <span>Share Blog</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <UserRoundPen />
                      <span>Edit Blog</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
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
          </>
        )}
      </div>
      <Separator />
      <div className="px-2 pt-5 h-full mx-auto max-w-[750px]">
        {activeBlog ? (
          <>
            <div>{activeTask === "structure" && <Structure />}</div>
            <div>{activeTask === "preview" && <RichTextRenderer />}</div>
            <div>{activeTask === "code" && <CodePreview />}</div>
          </>
        ) : (
          <StartBlog />
        )}
      </div>
    </div>
  );
};
