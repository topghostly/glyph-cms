import { toast } from "sonner";

/**
 * Fetches the signed-in author's posts. The server derives the user from
 * the session, so no id is passed.
 */
export const getAllBlogs = async () => {
  try {
    const res = await fetch("/api/blog/get-all-blog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });

    if (!res.ok) {
      console.error("Error fetching blogs:", res.status);
      return null;
    }

    const result = await res.json();
    return result.blogs;
  } catch (error) {
    toast(`Error during fetch: ${error}`);
    return null;
  }
};
