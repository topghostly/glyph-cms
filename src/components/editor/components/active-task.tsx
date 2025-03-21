import { Separator } from "@/components/ui/separator";
import React from "react";
import { Structure } from "./task/structure";
import { Ellipsis, Plus } from "lucide-react";

export const ActiveTask: React.FC = () => {
    return (
        <div className="w-full h-full overflow-y-scroll relative scrollbar-h">
            <div className="h-[50px] gap-3 px-3 flex items-center justify-end text-white/80 cursor-pointer">
                <Ellipsis size={18} />
                <Plus size={18} className="rotate-45" />
            </div>
            <Separator />
            <div className="px-2 pt-5 h-full mx-auto max-w-[750px]">
                <Structure />
            </div>
        </div>
    );
};
