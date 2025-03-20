import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Plus, Search } from "lucide-react";
import Image from "next/image";

export const PostLayer: React.FC = () => {
    const DATA = [
        {
            title: "The top AI Email Manager tool on the web",
            imageUERL: "/images/png/download.jpeg",
        },
        {
            title: "The top AI Email Manager tool on the web",
            imageUERL: "/images/png/download.jpeg",
        },
        {
            title: "The top AI Email Manager tool on the web",
            imageUERL: "/images/png/download.jpeg",
        },
    ];
    return (
        <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center mb-4">
                <p className="font-bold text-[14px]">Posts</p>
                <Plus size={18} className="text-white/80 cursor-pointer" />
            </div>

            {/* SEARCH INPUT FIELD */}
            <div className="relative">
                <div className=" w-fit pointer-events-none absolute top-[50%] translate-y-[-50%] left-[8px]"><Search size={18} color="#cccccc" strokeWidth={1} /></div>
                <div className="w-full"><Input className="pl-9 border-none" placeholder="Search list" /></div>
            </div>
            {/* SEARCH INPUT FIELD */}

            <div className="flex flex-col gap-1 w-full">
                {DATA.map((d, index) => (
                    <div key={index} className={cn('grid grid-cols-[40px_1fr] gap-2 items-center h-[55px] w-full px-2 rounded cursor-pointer', index === 1 ? "text-background bg-chart-1" : 'text-white/80 bg-background hover:bg-accent')}>

                        <div className="w-[40px] h-[40px] flex justify-center items-center relative">
                            <Image className="rounded" src={d.imageUERL} alt={d.title} fill />
                        </div>
                        <div className="flex flex-col ">
                            <p className="text-[14px] font-bold truncate w-[170px]">{d.title}</p>
                            <p className="text-[10px]">by Damilare Abolaji</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
