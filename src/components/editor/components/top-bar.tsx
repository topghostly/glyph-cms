import { Button } from "@/components/ui/button";
import {
  ArrowUpToLine,
  Cloud,
  Columns2,
  File,
  FileJson,
  FileKey2,
  Github,
  KeySquare,
  LayoutPanelTop,
  LifeBuoy,
  LogOut,
  Plus,
  User,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSubTrigger,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { useBlogStore } from "@/store/blog-store";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { logOut } from "@/server/auth";
import { useAuth } from "@/store/auth-store";
import { Blog } from "@/type/blog";
import { toast } from "sonner";
import isEqual from "lodash.isequal";
import { getAllBlogs } from "@/util/getAllBlog";
import { base64ToBlob } from "@/util/base64-blob";
import { useUser } from "@/store/user-store";

export const Topbar: React.FC = () => {
  const { session } = useAuth();

  const [syncMode, setSyncMode] = useState<boolean>(false);
  const [uploadTrigger, setUploadTrigger] = useState(false);
  const [uploading, setUploading] = useState<boolean>(false);
  // const [userInfo, setUserInfo] = useState<LocalUserInfoProps>();

  /* IMPORT BLOG CONTEXT FUNCTIONS AND PROPERTIES */
  const addBlog = useBlogStore((state) => state.addBlog);
  const setActiveTask = useBlogStore((state) => state.setActiveTask);
  const setActiveBlog = useBlogStore((state) => state.setActiveBlog);
  const activeTask = useBlogStore((state) => state.activeTask);
  const activeBlog = useBlogStore((state) => state.activeBlog);
  const updateBlog = useBlogStore((state) => state.updateBlog);
  /* IMPORT BLOG CONTEXT FUNCTIONS AND PROPERTIES */
  const { userInfo } = useUser();

  /* FUNCTION TO UPLOAD BLOG TO THE DATABASE */
  const handleBlogUpload = async (blog: Blog | null) => {
    // GET USER INFORMATION FROM LOCALSTORAGE
    if (!userInfo.userId) {
      toast("❌ Error: You may not authenticated yet. Please reload the app.");
      return;
    }

    if (!blog || !blog.content.mainImage?.url) {
      toast("No blog or image found to upload.");
      return;
    }

    try {
      setUploading(true);

      if (!activeBlog || !activeBlog.content.mainImage) return;
      let finalImageUrl = activeBlog.content.mainImage.url;

      const imageBlob = base64ToBlob(finalImageUrl!);

      // 1. Upload the image to S3
      if (imageBlob instanceof Blob) {
        const formData = new FormData();
        formData.append("file", imageBlob, `${activeBlog._localID}-main.jpg`);

        const imageUploadRes = await fetch("/api/bucket/image-upload", {
          method: "POST",
          body: formData,
        });

        if (!imageUploadRes.ok) {
          toast("❌ Image upload failed.");
          return;
        }

        const { data } = await imageUploadRes.json();
        console.log("✅ Uploaded image URL:", data.publicUrl);
        finalImageUrl = data.publicUrl;
      }

      // 2. Replace base64 with final public S3 URL
      updateBlog({
        ...blog,
        content: {
          ...blog.content,
          mainImage: {
            ...blog.content.mainImage,
            url: finalImageUrl,
          },
        },
      });
      const updatedBlog = {
        ...blog,
        content: {
          ...blog.content,
          mainImage: {
            ...blog.content.mainImage,
            url: finalImageUrl,
          },
        },
      };

      // 3. Upload blog to DB
      const blogUploadRes = await fetch("/api/blog/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _localID: blog._localID,
          content: JSON.stringify(updatedBlog),
          creator: userInfo.userId,
          link: `https://glyph-cms.vercel.app/blogs/post/${blog._localID}`,
        }),
      });

      const result = await blogUploadRes.json();
      console.log(result);
      await getAllBlogs(userInfo.userId);

      if (blogUploadRes.ok) {
        toast(`✅ '${updatedBlog.content.title}' has been uploaded`);
        setUploadTrigger((prev) => !prev);
      } else {
        toast("❌ Blog upload failed.");
      }
    } catch (error) {
      toast(`❌ UPLOAD ERROR: ${String(error)}`);
    } finally {
      setUploading(false);
    }
  };

  /* FUNCTION TO UPLOAD BLOG TO THE DATABASE */

  useEffect(() => {
    if (!localStorage.getItem("online-blogs") || !activeBlog) return;
    const allOnlineBlog = JSON.parse(localStorage.getItem("online-blogs")!);

    const blog = allOnlineBlog.filter(
      (b: Blog) => b._localID === activeBlog?._localID
    );

    if (!blog[0]) return setSyncMode(false);

    if (blog) {
      const blogContent = JSON.parse(blog[0].content);
      setSyncMode(isEqual(blogContent.content, activeBlog?.content));
    }
  }, [activeBlog, uploadTrigger]);

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
                description: "",
              },
              creator: userInfo?.userId ?? "Unknown",
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
      <div className="h-full flex gap-5 justify-center items-center">
        <div>
          <p className="text-[13px] text-white/30">
            Blog status{" "}
            <span
              className={cn(
                "w-1.5 h-1.5 rounded-full inline-block ml-1",
                syncMode
                  ? " bg-green-500 hover:bg-green-950"
                  : " bg-amber-500 hover:bg-amber-950",
                !activeBlog && "bg-white/80 border-white/5 hover:bg-white/10"
              )}
            />
          </p>
        </div>

        <Button
          variant={"outline"}
          size={"sm"}
          className="w-8 h-8"
          onClick={() => {
            if (!syncMode && activeBlog) handleBlogUpload(activeBlog);
          }}
        >
          {uploading ? (
            <div className="flex items-center justify-center">
              <div className="w-[15px] h-[15px] border-1 border-white/80 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <ArrowUpToLine size={12} strokeWidth={2} />
          )}
        </Button>

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

              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <span className="pr-2">
                    <FileKey2 size={15} />
                  </span>
                  <span>Access Key</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem
                      onClick={async () => {
                        try {
                          if (!userInfo?.userId) return;
                          await navigator.clipboard.writeText(
                            userInfo?.userId!
                          );
                          toast("✅ Access key copied");
                        } catch (error) {
                          toast("❌ Unable to copy access key");
                          console.log(error);
                        }
                      }}
                    >
                      <KeySquare size={15} />
                      <span>{userInfo?.userId}</span>
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
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

            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>
              <Cloud />
              <span>API</span>
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              <File />
              <span>Docs</span>
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
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
