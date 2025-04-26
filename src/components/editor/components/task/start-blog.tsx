import { Button } from "@/components/ui/button";
import { useBlogStore } from "@/store/blog-store";
import { useUser } from "@/store/user-store";
import { Plus } from "lucide-react";

export const StartBlog: React.FC = () => {
  const addBlog = useBlogStore((state) => state.addBlog);
  const setActiveBlog = useBlogStore((state) => state.setActiveBlog);
  const setActiveTask = useBlogStore((state) => state.setActiveTask);

  const { userInfo } = useUser(); // UserId from user context
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
              description: "",
            },
            creator: userInfo.userId ?? "Unknown",
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
