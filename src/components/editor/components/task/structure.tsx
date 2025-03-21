"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ImageUp, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextEditor } from "./components/text-editor";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export const Structure = () => {
    const [tags, setTags] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState<string>("");

    const handleAddTags = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && inputValue.trim() !== "") {
            setTags([...tags, inputValue.trim()]);
            setInputValue("");
        }
    };

    const handleRemoveTag = (index: number) => {
        setTags(tags.filter((_, i) => i !== index));
    };

    return (
        <div className="w-full flex flex-col gap-8 pb-5">
            {/* BLOG TITLE */}
            <div className="flex flex-col gap-4">
                <Label htmlFor="title" className="text-[12px]">
                    Title Heading
                </Label>
                <Input
                    id="title"
                    name="title"
                    placeholder="My very first blog post..."
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
                            {tags.map((tag, index) => (
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
                        />
                        <Button
                            variant={"outline"}
                            onClick={() => {
                                setTags([...tags, inputValue.trim()]);
                                setInputValue("");
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
