"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { ImageMinus, ImageUp, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextEditor } from "./components/text-editor";
import { useCallback, useEffect, useState } from "react";

const MAX_FILE_SIZE_MB = 3; // Maximum cover image size
import { useDropzone } from "react-dropzone";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useBlogStore } from "@/store/blog-store";
import { Blog, TiptapDoc } from "@/type/blog";
import { toast } from "sonner";

export const Structure = () => {
  /* IMPORT BLOG CONTEXT FUNCTIONS AND PROPERTIES */
  const updateBlog = useBlogStore((state) => state.updateBlog);
  const activeBlog = useBlogStore((state) => state.activeBlog);
  /* IMPORT BLOG CONTEXT FUNCTIONS AND PROPERTIES */

  const [inputValue, setInputValue] = useState<string>("");
  const [uploadingCover, setUploadingCover] = useState(false);
  const [savedBlog, setSavedBlog] = useState<TiptapDoc | null>(null);
  const [blog, setBlog] = useState<Blog>(
    activeBlog || {
      _localID: "",
      content: {
        title: "",
        description: "",
        tags: [],
        mainImage: {
          alt: "",
          url: "",
        },
      },
      creator: "",
    }
  );

  /* FUNCTION TO SCROLLTO TOP ON BLOG CHANGE */
  // const scrollToTop = () => {
  //   if (scrollableRef.current) {
  //     scrollableRef.current.scrollTo = 0;
  //   }
  // };

  useEffect(() => {
    if (activeBlog && activeBlog._localID !== blog._localID) {
      setBlog(activeBlog);
    }
    // scrollToTop();
  }, [activeBlog?._localID, activeBlog, blog._localID]);

  // Debounced so a burst of keystrokes results in one localStorage write
  // rather than one per character.
  useEffect(() => {
    if (!blog._localID) return;
    const t = setTimeout(() => updateBlog(blog), 500);
    return () => clearTimeout(t);
  }, [blog, updateBlog]);

  useEffect(() => {
    setSavedBlog(blog.content.body ?? null);
    // Only reload editor content when switching posts, not on every edit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blog._localID]);

  const handleAddTags = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      setBlog((prevBlog) => ({
        ...prevBlog,
        content: {
          ...prevBlog.content,
          tags: [...(prevBlog.content.tags || []), inputValue.trim()],
        },
      }));
      setInputValue("");
    }
  };

  const handleRemoveTag = (index: number) => {
    setBlog((prevBlog) => ({
      ...prevBlog,
      content: {
        ...prevBlog.content,
        tags: (prevBlog.content.tags || []).filter((_, i) => i !== index),
      },
    }));
  };

  /* GET MAIN IMAGE */
  // Uploaded straight to S3 — storing the base64 data URI instead would
  // blow the localStorage quota once a couple of drafts exist.
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.size / (1024 * 1024) > MAX_FILE_SIZE_MB) {
      toast(`🚫 File too large. Please upload an image under ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }

    setUploadingCover(true);
    try {
      const form = new FormData();
      form.append("file", file);

      const res = await fetch("/api/bucket/image-upload", {
        method: "POST",
        body: form,
      });

      if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: null }));
        toast(`❌ ${error ?? "Cover image upload failed."}`);
        return;
      }

      const { data } = await res.json();
      if (!data?.publicUrl) {
        toast("❌ Upload returned no URL.");
        return;
      }

      setBlog((prevBlog) => ({
        ...prevBlog,
        content: {
          ...prevBlog.content,
          mainImage: {
            url: data.publicUrl,
            key: data.filename,
            alt: prevBlog.content.mainImage?.alt || "",
          },
        },
      }));
    } catch (err) {
      console.error("Cover upload failed:", err);
      toast("❌ Cover image upload failed.");
    } finally {
      setUploadingCover(false);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    accept: {
      "image/png": [".png"],
      "image/jpg": [".jpg"],
      "image/jpeg": [".jpeg"],
    },
    onDrop,
  });

  /* REMOVE MAIN IMAGE */
  const removeMainImage = async () => {
    const key = blog.content.mainImage?.key;

    setBlog((prevBlog) => ({
      ...prevBlog,
      content: {
        ...prevBlog.content,
        mainImage: { url: "", alt: "", key: undefined },
      },
    }));

    // Reclaim the bucket object rather than orphaning it.
    if (key) {
      try {
        await fetch("/api/bucket/delete-image", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key }),
        });
      } catch (err) {
        console.error("Failed to delete orphaned cover image", err);
      }
    }
  };

  return (
    <div className="w-full flex flex-col gap-8 pb-5 relative" id="structure">
      {/* BLOG TITLE */}
      <div className="flex flex-col gap-4">
        <Label htmlFor="title" className="text-[12px]">
          Title Heading
        </Label>
        <Input
          id="title"
          name="title"
          placeholder="My very first blog post..."
          value={blog.content.title}
          onChange={(e) =>
            setBlog({
              ...blog,
              content: { ...blog.content, title: e.target.value },
            })
          }
        />
      </div>

      {/* MAIN IMAGE */}
      <div className="flex flex-col gap-4 relative">
        <Label htmlFor="image" className="text-[12px]">
          Main Image
        </Label>
        <Card className="w-full p-3 relative">
          <CardContent className="flex flex-col gap-5 px-0">
            {blog.content.mainImage?.url && (
              <div className="absolute top-4 right-4 z-10">
                <Button
                  // className="w-[60px] h-[25px]"
                  onClick={() => removeMainImage()}
                >
                  <ImageMinus />
                </Button>
              </div>
            )}

            {blog.content.mainImage?.url ? (
              <div className="w-full relative h-100">
                <Image
                  src={blog.content.mainImage.url}
                  alt={blog.content.mainImage.alt || "Cover image"}
                  fill
                  sizes="(max-width: 768px) 100vw, 750px"
                  className="mx-auto rounded object-center object-cover"
                />
              </div>
            ) : (
              <div {...getRootProps()} className="w-full h-full cursor-pointer">
                <input {...getInputProps()} type="file" />
                <Card className="w-full aspect-video rounded overflow-hidden">
                  <CardContent className="grid place-content-center w-full h-full">
                    <div className="flex flex-col gap-2 justify-center items-center">
                      {uploadingCover ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <p className="text-[#8b8b8b] text-[10px]">
                            UPLOADING…
                          </p>
                        </>
                      ) : (
                        <>
                          <ImageUp size={30} color="#cccccc" strokeWidth={2} />
                          <p className="text-[#8b8b8b] text-[10px]">
                            {MAX_FILE_SIZE_MB}MB MAX SIZE.
                          </p>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <Label htmlFor="alternate" className="text-[12px]">
                Alternate Text
              </Label>
              <Input
                id="alternate"
                autoComplete="off"
                name="alternate"
                placeholder="React Context API in image form ..."
                value={blog.content.mainImage?.alt || ""} // Ensure it's always a string
                onChange={(e) =>
                  setBlog({
                    ...blog,
                    content: {
                      ...blog.content,
                      mainImage: {
                        ...blog.content.mainImage,
                        alt: e.target.value,
                      },
                    },
                  })
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* TAG COLLECTION */}
      <div className="flex flex-col gap-4">
        <Label htmlFor="tag" className="text-[12px]">
          Tag Categories
        </Label>
        <div className="flex flex-col gap-2 p-0 m-0 ">
          <Card className="rounded p-0 min-h-8 w-full">
            <CardContent className="flex flex-wrap gap-1.5 p-2">
              {(blog.content.tags || []).map((tag, index) => (
                <TooltipProvider key={`${tag}-${index}`}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        aria-label={`Remove tag ${tag}`}
                        onClick={() => handleRemoveTag(index)}
                      >
                        <Badge className="cursor-pointer">{tag}</Badge>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Click to remove</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </CardContent>
          </Card>
          <div className="flex gap-2">
            <Input
              id="tag"
              name="tag"
              placeholder="Add tags and categories..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleAddTags}
              autoComplete="off"
            />
            <Button
              variant="outline"
              onClick={() => {
                if (inputValue.trim()) {
                  setBlog((prevBlog) => ({
                    ...prevBlog,
                    content: {
                      ...prevBlog.content,
                      tags: [
                        ...(prevBlog.content.tags || []),
                        inputValue.trim(),
                      ],
                    },
                  }));
                  setInputValue("");
                }
              }}
            >
              <span>
                <Plus />
              </span>{" "}
              Add
            </Button>
          </div>
        </div>
      </div>

      {/* DESCRIPTION */}
      <div className="flex flex-col gap-4">
        <Label htmlFor="description" className="text-[12px]">
          Blog Description
        </Label>
        <Input
          id="description"
          name="description"
          placeholder="Beware that, when fighting monsters, you yourself do not become a monster... for when you gaze long into the abyss. The abyss gazes also into you."
          value={blog.content.description}
          onChange={(e) =>
            setBlog({
              ...blog,
              content: { ...blog.content, description: e.target.value },
            })
          }
        />
      </div>

      {/* BODY */}
      <div className="flex flex-col gap-4">
        <Label htmlFor="body">Body</Label>
        <TextEditor setBlog={setBlog} savedBlog={savedBlog} />
      </div>
    </div>
  );
};
