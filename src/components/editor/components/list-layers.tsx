import { useBlogStore } from "@/store/blog-store";
import { PostLayer } from "./list/post-layer";
import { CategoryLayer } from "./list/category-layer";
import { Session } from "next-auth";
import { cn } from "@/lib/utils";

export const ListLayers: React.FC<{ session: Session; className?: string }> = ({
  session,
  className,
}) => {
  /* IMPORT BLOG CONTEXT FUNCTIONS AND PROPERTIES */
  const listMode = useBlogStore((state) => state.listMode);
  /* IMPORT BLOG CONTEXT FUNCTIONS AND PROPERTIES */

  return (
    <div
      className={cn(
        "w-full lg:basis-[300px] lg:w-auto shrink-0 relative overflow-y-scroll scrollbar-h pt-5 px-2",
        className
      )}
    >
      <div>
        {listMode === "all" && <PostLayer session={session} />}
        {listMode === "category" && <CategoryLayer />}
      </div>
    </div>
  );
};
