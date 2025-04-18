import { Button } from "@/components/ui/button";
import {
  ArrowUpToLine,
  Cloud,
  Columns2,
  FileJson,
  Github,
  Keyboard,
  LayoutPanelTop,
  LifeBuoy,
  LogOut,
  Plus,
  Settings,
  User,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { useBlogStore } from "@/store/blog-store";
import { cn } from "@/lib/utils";
import React from "react";
import { logOut } from "@/server/auth";
import { useAuth } from "@/store/auth-store";
import { Blog } from "@/type/blog";
import { toast } from "sonner";

export const Topbar: React.FC = () => {
  const { session } = useAuth();

  /* IMPORT BLOG CONTEXT FUNCTIONS AND PROPERTIES */
  const addBlog = useBlogStore((state) => state.addBlog);
  const setActiveTask = useBlogStore((state) => state.setActiveTask);
  const setActiveBlog = useBlogStore((state) => state.setActiveBlog);
  const activeTask = useBlogStore((state) => state.activeTask);
  const activeBlog = useBlogStore((state) => state.activeBlog);
  /* IMPORT BLOG CONTEXT FUNCTIONS AND PROPERTIES */

  /* FUNCTION TO UPLOAD BLOG TO THE DATABASE */
  const handleBlogUpload = async (blog: Blog | null) => {
    const localUserId = localStorage.getItem("localUserId");
    if (!localUserId) {
      toast("User not authenticated yet. Please try again shortly.");
      return;
    }
    try {
      const res = await fetch("/api/blog/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _localID: blog?._localID,
          content: JSON.stringify(blog),
          creator: localUserId || "Unknown",
        }),
      });

      const result = await res.json();
      console.log(result);

      if (res.ok) {
        toast(`${blog?.content.title} has been uploaded`);
      } else {
        console.log("Blog not uploaded ");
      }
    } catch (error) {
      toast(`ERROR: ${error}`);
    }
  };

  /* FUNCTION TO UPLOAD BLOG TO THE DATABASE */

  return (
    <div className="px-3 max-w-[1440px] w-full mx-auto h-15 overflow-hidden flex items-center justify-between">
      <div className="h-full flex gap-3 justify-center items-center select-none">
        <Image
          src={"/images/svg/Glyph-01.svg"}
          alt="glyph logo"
          width={32}
          height={32}
        />
        <Button
          size={"sm"}
          variant={"outline"}
          onClick={() => {
            const newBlogID = crypto.randomUUID();
            addBlog({
              _localID: newBlogID,
              content: {
                title: "Untitled Blog",
              },
              creator: localStorage.getItem("localUserId") ?? "Unknown",
            });
            setActiveBlog(newBlogID);
            setActiveTask("structure");
          }}
          className="cursor-pointer"
        >
          <span className="flex gap-1 justify-between items-center text-[12px] text-white/80">
            <Plus size={20} strokeWidth={1} />
            Create
          </span>
        </Button>
      </div>
      <div className="h-full flex gap-3 justify-center items-center">
        <Button
          size={"sm"}
          className={cn(
            `${
              activeTask === "structure"
                ? "text-white/80 text-[12px]"
                : "border-none bg-background text-white text-[12px]"
            }`
          )}
          variant={"outline"}
          onClick={() => setActiveTask("structure")}
          disabled={!activeTask}
        >
          <LayoutPanelTop />
          Structure
        </Button>
        <Button
          variant={"outline"}
          size={"sm"}
          className={cn(
            `${
              activeTask === "preview"
                ? "text-white/80 text-[12px]"
                : "border-none bg-background text-white text-[12px]"
            }`
          )}
          onClick={() => {
            window.open("/preview", "_blank");
          }}
          disabled={
            activeBlog?.content.title === "" ||
            activeBlog?.content.title === "Untitled Blog" ||
            !activeBlog?.content.mainImage?.url ||
            !activeTask
          }
        >
          <Columns2 />
          Preview
        </Button>
        <Button
          variant={"outline"}
          size={"sm"}
          className={cn(
            `${
              activeTask === "code"
                ? "text-white/80 text-[12px]"
                : "border-none bg-background text-white text-[12px]"
            }`
          )}
          onClick={() => setActiveTask("code")}
          disabled={!activeTask}
        >
          <FileJson size={16} /> JSON
        </Button>
      </div>
      <div className="h-full flex gap-3 justify-center items-center">
        <div
          className="p-2 rounded-full border-[2px] text-white/80 border-white/5 cursor-pointer"
          onClick={() => handleBlogUpload(activeBlog)}
        >
          <ArrowUpToLine size={16} />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex justify-center items-center w-[30px] h-[30px] relative cursor-pointer rounded-full overflow-hidden">
              <Image
                src={session?.user?.image ?? "/images/png/web-icon.png"}
                alt="user picture"
                fill
                className="pointer-events-none"
              />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-58">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <User />
                <span>Profile</span>
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>

              <DropdownMenuItem disabled>
                <Settings />
                <span>Settings</span>
                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                <Keyboard />
                <span>Keyboard shortcuts</span>
                <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Github />
              <span>GitHub</span>
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              <LifeBuoy />
              <span>Support</span>
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              <Cloud />
              <span>API</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                logOut();
              }}
            >
              <LogOut />
              <span>Log out</span>
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
