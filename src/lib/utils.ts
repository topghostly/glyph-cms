// import { useBlogStore } from "@/store/blog-store";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// export const addNewBlog = () => {
//   /* IMPORT BLOG CONTEXT FUNCTIONS AND PROPERTIES */
//   const addBlog = useBlogStore((state) => state.addBlog);
//   const setActiveTask = useBlogStore((state) => state.setActiveTask);
//   const setActiveBlog = useBlogStore((state) => state.setActiveBlog);
//   /* IMPORT BLOG CONTEXT FUNCTIONS AND PROPERTIES */

//   const newBlogID = crypto.randomUUID();
//   addBlog({
//     _localID: newBlogID,
//     content: {
//       title: "Untitled Blog",
//     },
//   });
//   setActiveBlog(newBlogID);
//   setActiveTask("structure");
// };

export const getDate = (date = new Date()) => {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};
