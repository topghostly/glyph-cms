"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ImageUp, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextEditor } from "./components/text-editor";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useBlogStore } from "@/store/blog-store";
import { Blog } from "@/type/blog";

export const Structure = () => {
  /* IMPORT BLOG CONTEXT FUNCTIONS AND PROPERTIES */
  const updateBlog = useBlogStore((state) => state.updateBlog);
  const activeBlog = useBlogStore((state) => state.activeBlog);
  /* IMPORT BLOG CONTEXT FUNCTIONS AND PROPERTIES */

  const [inputValue, setInputValue] = useState<string>("");
  const [blog, setBlog] = useState<Blog>(
    activeBlog || { _localID: "", content: { title: "", tags: [] } }
  );

  useEffect(() => {
    if (activeBlog && activeBlog._localID !== blog._localID) {
      setBlog(activeBlog);
    }
  }, [activeBlog?._localID]);

  useEffect(() => {
    if (blog._localID) {
      updateBlog(blog);
    }
  }, [blog]);

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

  return (
    <div className="w-full flex flex-col gap-8 pb-5 relative">
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
            <Card className="w-full aspect-video rounded overflow-hidden">
              <CardContent className="grid place-content-center w-full h-full">
                <div>
                  <ImageUp size={30} color="#cccccc" strokeWidth={2} />
                </div>
              </CardContent>
            </Card>
            <div className="flex flex-col gap-2">
              <Label htmlFor="alternate" className="text-[12px]">
                Alternate Text
              </Label>
              <Input
                id="alternate"
                name="alternate"
                placeholder="React Context API in image form ..."
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
        <TextEditor />
      </div>
    </div>
  );
};
