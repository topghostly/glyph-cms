import { useBlogStore } from "@/store/blog-store";
import { PostLayer } from "./list/post-layer";
import { CategoryLayer } from "./list/category-layer";

export const ListLayers: React.FC = () => {
  /* IMPORT BLOG CONTEXT FUNCTIONS AND PROPERTIES */
  const listMode = useBlogStore((state) => state.listMode);
  /* IMPORT BLOG CONTEXT FUNCTIONS AND PROPERTIES */

  return (
    <div className="basis-[300px] w-full shrink-0 relative overflow-y-scroll scrollbar-h pt-5 px-2">
      <div>
        {listMode === "all" && <PostLayer />}
        {listMode === "category" && <CategoryLayer />}
      </div>
    </div>
  );
};
