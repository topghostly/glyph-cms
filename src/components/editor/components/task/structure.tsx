import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ImageUp, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextEditor } from "./components/text-editor";

export const Structure = () => {
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
                <div className="flex flex-col gap-2">
                    <Card className="rounded h-4">
                        <CardContent></CardContent>
                    </Card>
                    <div className="flex gap-2">
                        <Input
                            id="tag"
                            name="tag"
                            placeholder="Add tags and categories..."
                        />
                        <Button variant={"outline"} size={"sm"}>
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
