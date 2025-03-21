import { Separator } from "@/components/ui/separator";
import React from "react";
import { Structure } from "./task/structure";

export const ActiveTask: React.FC = () => {
    return (
        <div className="w-full h-full overflow-y-scroll relative scrollbar-h">
            <div className="h-[50px] px-2 flex items-center">
                <p className="font-bold text-lg text-muted-foreground">The top AI Email Manager tool on the web</p>
            </div>
            <Separator />
            <div className="px-2 pt-5 h-full mx-auto max-w-[750px]">
                <Structure />
            </div>
        </div>
    );
};
