import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useBlogStore } from "@/store/blog-store";
import {
  Ellipsis,
  FileText,
  Plus,
  Search,
  Trash2,
  UserRoundPen,
} from "lucide-react";
import { toast } from "sonner";
import { Session } from "next-auth";

export const PostLayer: React.FC<{ session: Session }> = ({ session }) => {
  const [deletingBlogId, setDeletingBlogId] = useState<string | null>(null);

  /* IMPORT BLOG CONTEXT FUNCTIONS AND PROPERTIES */
  const blogs = useBlogStore((state) => state.blogs);
  const deleteBlog = useBlogStore((state) => state.deleteBlog);
  const setActiveTask = useBlogStore((state) => state.setActiveTask);
  const activeBlog = useBlogStore((state) => state.activeBlog);
  const setActiveBlog = useBlogStore((state) => state.setActiveBlog);
  const addBlog = useBlogStore((state) => state.addBlog);
  const isSyncing = useBlogStore((state) => state.isSyncing);
  /* IMPORT BLOG CONTEXT FUNCTIONS AND PROPERTIES */

  /* FUNCTION TO DELETE A BLOG */
  const handleBlogDelete = async (
    blogLocalId: string,
    key: string | undefined
  ) => {
    setDeletingBlogId(blogLocalId);
    try {
      if (key) {
        const deletedImage = await fetch("/api/bucket/delete-image", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            key: key,
          }),
        });

        if (!deletedImage.ok) {
          toast("❌ Image deletion failed.");
          return;
        }
      }

      const res = await fetch("/api/blog/delete-blog", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _localID: blogLocalId,
        }),
      });

      // A 404 means it was never persisted (or is already gone) — either
      // way, dropping the local copy is correct.
      if (res.ok || res.status === 404) {
        deleteBlog(blogLocalId);
        setActiveTask(null);
        setActiveBlog(null);
        toast(`✅ Blog has been deleted`);
      } else {
        toast("❌ Blog not deleted");
      }
    } catch (error) {
      toast(`❌ Error deleting blog: ${error}`);
    } finally {
      setDeletingBlogId(null);
    }
  };
  /* FUNCTION TO DELETE A BLOG */

  const [searchQuery, setSearchQuery] = useState("");

  // Drafts created locally have an empty creator until first publish, so
  // include those alongside this author's synced posts.
  const userBlogs = blogs.filter(
    (b) => !b.creator || b.creator === session.user.id
  );

  const filteredBlogs = userBlogs.filter((blog) =>
    blog.content.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center mb-4">
        <p className="font-bold text-[14px] flex items-center gap-2">
          Posts
          {isSyncing && (
            <span
              aria-label="Syncing"
              className="w-3 h-3 border-1 border-white/50 border-t-transparent rounded-full animate-spin"
            />
          )}
        </p>
        <div
          className="w-7 h-7 grid place-content-center hover:bg-accent rounded"
          onClick={() => {
            const newBlogID = crypto.randomUUID();
            addBlog({
              _localID: newBlogID,
              content: {
                title: "Untitled Blog",
                description: "",
              },
              // Server overwrites this from the session on publish.
              creator: "",
            });
            setActiveBlog(newBlogID);
            setActiveTask("structure");
          }}
        >
          <Plus size={18} className="text-white/80 cursor-pointer" />
        </div>
      </div>

      {/* SEARCH INPUT FIELD */}
      <div className="relative">
        <div className="w-fit pointer-events-none absolute top-[50%] translate-y-[-50%] left-[8px]">
          <Search size={18} color="#cccccc" strokeWidth={1} />
        </div>
        <div className="w-full">
          <Input
            className="pl-9 border-none"
            placeholder="Search list"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      {/* SEARCH INPUT FIELD */}

      {filteredBlogs.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-2 py-10 text-white/40">
          <FileText size={22} strokeWidth={1.5} />
          <p className="text-[12px] text-center px-4">
            {userBlogs.length === 0
              ? isSyncing
                ? "Syncing your posts…"
                : "No posts yet — create your first one."
              : "No posts match your search."}
          </p>
        </div>
      )}

      <div className="flex flex-col gap-1 w-full">
        {filteredBlogs.map((d) => (
          <div
            key={d._localID}
            onClick={() => {
              setActiveBlog(d._localID);
              setActiveTask("structure");
            }}
            className={cn(
              "grid grid-cols-[40px_1fr_30px] gap-2 items-center h-[55px] w-full px-2 rounded cursor-pointer",
              activeBlog?._localID === d._localID
                ? "text-background bg-chart-1"
                : "text-white/80 bg-background hover:bg-accent"
            )}
          >
            <div className="w-[40px] h-[40px] flex justify-center items-center relative">
              <Image
                src={
                  d.content.mainImage?.url || "/images/png/default-image.webp"
                }
                alt=""
                fill
                sizes="40px"
                className="rounded object-center object-cover"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <p className="text-[14px] font-bold truncate">
                {d.content.title !== "" ? d.content.title : "Untitled Blog"}
              </p>
              <p className="text-[10px]">{session.user.name}</p>
            </div>
            <div>
              {deletingBlogId === d._localID ? (
                <div className="flex items-center justify-center">
                  <div className="w-3 h-3 border-1 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger className="outline-none">
                    <Ellipsis className="cursor-pointer" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        onClick={(event) => {
                          event.stopPropagation();
                          handleBlogDelete(
                            d._localID,
                            d.content.mainImage?.key
                          );
                        }}
                      >
                        <Trash2 />
                        <span>Delete Blog</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(event) => {
                          event.stopPropagation();
                          setActiveBlog(d._localID);
                          setActiveTask("structure");
                        }}
                      >
                        <UserRoundPen />
                        <span>Edit Blog</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
