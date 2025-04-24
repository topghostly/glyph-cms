import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useBlogStore } from "@/store/blog-store";
import { Ellipsis, Plus, Search, Trash2, UserRoundPen } from "lucide-react";
// import Image from "next/image";
import { toast } from "sonner";

export const PostLayer: React.FC = () => {
  const [deletingBlogId, setDeletingBlogId] = useState<string | null>(null);

  /* IMPORT BLOG CONTEXT FUNCTIONS AND PROPERTIES */
  const blogs = useBlogStore((state) => state.blogs);
  const deleteBlog = useBlogStore((state) => state.deleteBlog);
  const setActiveTask = useBlogStore((state) => state.setActiveTask);
  const activeBlog = useBlogStore((state) => state.activeBlog);
  const setActiveBlog = useBlogStore((state) => state.setActiveBlog);
  const addBlog = useBlogStore((state) => state.addBlog);
  /* IMPORT BLOG CONTEXT FUNCTIONS AND PROPERTIES */

  const userId = localStorage.getItem("localUserId");

  /* FUNCTION TO DELETE A BLOG */
  const handleBlogDelete = async (blogLocalId: string) => {
    setDeletingBlogId(blogLocalId);
    try {
      const res = await fetch("/api/blog/delete-blog", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _localID: blogLocalId,
        }),
      });

      const result = await res.json();

      if (res.ok || result.error === "No blog found with that _localID") {
        deleteBlog(blogLocalId);
        setActiveTask(null);
        setActiveBlog(null);
        toast(`Blog has been deleted`);
      } else {
        toast("Blog not deleted");
      }
    } catch (error) {
      toast(`Error deleting blog: ${error}`);
    } finally {
      setDeletingBlogId(null);
    }
  };
  /* FUNCTION TO DELETE A BLOG */

  const [searchQuery, setSearchQuery] = useState("");

  const userBlogs = blogs.filter((b) => b.creator === userId);

  const filteredBlogs = userBlogs.filter((blog) =>
    blog.content.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center mb-4">
        <p className="font-bold text-[14px]">Posts</p>
        <div
          className="w-7 h-7 grid place-content-center hover:bg-accent rounded"
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
      <div className="flex flex-col gap-1 w-full">
        {filteredBlogs.map((d, index) => (
          <div
            key={index}
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
              <img
                className="rounded object-center object-cover w-full h-full"
                src={
                  d.content.mainImage?.url
                    ? d.content.mainImage?.url
                    : "/images/png/default-image.webp"
                }
                alt={"post image"}
                // fill
              />
            </div>
            <div className="flex flex-col">
              <p className="text-[14px] font-bold truncate w-[170px]">
                {d.content.title !== "" ? d.content.title : "Untitled Blog"}
              </p>
              <p className="text-[10px]">
                {localStorage.getItem("glyph-username")}
              </p>
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
                          handleBlogDelete(d._localID);
                        }}
                      >
                        <Trash2 />
                        <span>Delete Blog</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
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
