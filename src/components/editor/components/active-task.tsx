import { Separator } from "@/components/ui/separator";
import React from "react";
import dynamic from "next/dynamic";
import { Structure } from "./task/structure";
import {
  ChevronLeft,
  Ellipsis,
  Plus,
  UserRoundPen,
  ExternalLink,
} from "lucide-react";
import { StartBlog } from "./task/start-blog";
import { useBlogStore } from "@/store/blog-store";
import { EditorInterface } from "../Editor";
import { cn } from "@/lib/utils";

// Only rendered when their tab is selected — keep them out of the
// initial editor chunk.
const RichTextRenderer = dynamic(() => import("./task/preview-blog"), {
  ssr: false,
});
const CodePreview = dynamic(() => import("./task/code-preview"), {
  ssr: false,
});
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export const ActiveTask: React.FC<
  EditorInterface & { className?: string }
> = ({ className }) => {
  const activeTask = useBlogStore((state) => state.activeTask);
  const setActiveBlog = useBlogStore((state) => state.setActiveBlog);
  const setActiveTask = useBlogStore((state) => state.setActiveTask);
  const activeBlog = useBlogStore((state) => state.activeBlog);

  return (
    <div
      className={cn(
        "w-full h-full overflow-y-scroll relative scrollbar-h",
        className
      )}
    >
      <div className="h-[50px] gap-3 px-3 flex items-center justify-between lg:justify-end text-white/80">
        {activeBlog ? (
          <button
            type="button"
            onClick={() => {
              setActiveBlog(null);
              setActiveTask(null);
            }}
            className="lg:hidden flex items-center gap-0.5 text-[13px] cursor-pointer -ml-2 pl-1 pr-2 py-1 rounded hover:bg-accent"
          >
            <ChevronLeft size={18} />
            Posts
          </button>
        ) : (
          <span />
        )}
        {activeBlog && (
          <div className="flex items-center gap-3 cursor-pointer">
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
                    <DropdownMenuItem
                      onClick={() => setActiveTask("structure")}
                    >
                      <UserRoundPen />
                      <span>Edit Blog</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="hidden lg:grid w-7 h-7 place-content-center rounded hover:bg-accent">
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
