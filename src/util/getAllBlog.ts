import { toast } from "sonner";

export const getAllBlogs = async (userId: string) => {
  console.log("Started fetching");

  if (!userId) {
    console.warn("No userId found in userInfo. Cannot fetch blogs.");
    //   setLoading(false);
    return;
  }

  try {
    const res = await fetch("/api/blog/get-all-blog", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    const result = await res.json();
    console.log("The result is from get all blogs", result);

    if (res.ok) {
      localStorage.setItem("online-blogs", JSON.stringify(result.blogs));
      console.log(result.blogs);
    } else {
      console.error("Error fetching blogs:", result.error);
    }
  } catch (error) {
    toast(`Error during fetch: ${error}`);
  } finally {
    //   setLoading(false);
  }
};
