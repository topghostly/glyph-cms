import { Button } from "@/components/ui/button";
import { useBlogStore } from "@/store/blog-store";
import { Plus } from "lucide-react";

export const StartBlog: React.FC = () => {
  const addBlog = useBlogStore((state) => state.addBlog);
  const setActiveBlog = useBlogStore((state) => state.setActiveBlog);
  const setActiveTask = useBlogStore((state) => state.setActiveTask);
  return (
    <div className="w-full h-full flex justify-center items-center">
      <Button
        size={"lg"}
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
        <span className="flex gap-1 justify-between items-center text-[14px] text-white/80">
          <Plus size={24} strokeWidth={1} />
          Create
        </span>
      </Button>
    </div>
  );
};
