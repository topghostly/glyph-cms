"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ImageUp, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextEditor } from "./components/text-editor";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useBlogStore } from "@/store/blog-store";
import { Blog, Node } from "@/type/blog";
import Image from "next/image";

export const Structure = () => {
  /* IMPORT BLOG CONTEXT FUNCTIONS AND PROPERTIES */
  const updateBlog = useBlogStore((state) => state.updateBlog);
  const activeBlog = useBlogStore((state) => state.activeBlog);
  /* IMPORT BLOG CONTEXT FUNCTIONS AND PROPERTIES */

  // const scrollableRef = useRef(null);

  const [inputValue, setInputValue] = useState<string>("");
  const [savedBlog, setSavedBlog] = useState<Node[]>([]);
  const [blog, setBlog] = useState<Blog>(
    activeBlog || {
      _localID: "",
      content: {
        title: "",
        tags: [],
        mainImage: {
          alt: "",
          url: "",
        },
      },
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
  }, [activeBlog?._localID]);

  useEffect(() => {
    if (blog._localID) {
      updateBlog(blog);
    }
  }, [blog]);

  useEffect(() => {
    if (blog.content.body) {
      setSavedBlog(blog.content.body);
    } else {
      setSavedBlog([]);
    }
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
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];

    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        const base64String = reader.result as string;

        setBlog((prevBlog) => ({
          ...prevBlog,
          content: {
            ...prevBlog.content,
            mainImage: {
              url: base64String,
              alt: prevBlog.content.mainImage?.alt || "",
            },
          },
        }));
      };

      reader.onerror = (error) => {
        console.error("Error converting image to Base64:", error);
      };
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
      <div className="flex flex-col gap-4">
        <Label htmlFor="image" className="text-[12px]">
          Main Image
        </Label>
        <Card className="w-full p-3">
          <CardContent className="flex flex-col gap-5 px-0">
            {blog.content.mainImage?.url ? (
              <div className="w-full relative h-100">
                <Image
                  src={blog.content.mainImage.url}
                  alt="new image"
                  className="mx-auto rounded object-center object-cover"
                  fill
                />
              </div>
            ) : (
              <div {...getRootProps()} className="w-full h-full cursor-pointer">
                <input {...getInputProps()} type="file" />
                <Card className="w-full aspect-video rounded overflow-hidden">
                  <CardContent className="grid place-content-center w-full h-full">
                    <div>
                      <ImageUp size={30} color="#cccccc" strokeWidth={2} />
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
                <TooltipProvider key={index}>
                  <Tooltip>
                    <TooltipTrigger>
                      <Badge
                        onClick={() => handleRemoveTag(index)}
                        className="cursor-pointer"
                      >
                        {tag}
                      </Badge>
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

      {/* BODY */}
      <div className="flex flex-col gap-4">
        <Label htmlFor="body">Body</Label>
        <TextEditor setBlog={setBlog} savedBlog={savedBlog} />
      </div>
    </div>
  );
};
