import { cn } from "@/lib/utils";
import { Newspaper, Tag } from "lucide-react";

export const ArticleLayers: React.FC = () => {
    const DATA = [
        {
            text: "Posts",
            svgPath: <Newspaper size={16} />
        },
        {
            text: "Categories",
            svgPath: <Tag className="rotate-270" size={16} />
        },

    ];
    return (
        <div className="flex flex-col basis-[200px] shrink-0 overflow-y-scroll relative scrollbar-h pt-5 gap-5 pr-1">
            <div>
                <p className="font-bold text-[14px]">Articles</p>
            </div>
            <div className="flex flex-col gap-1">
                {DATA.map((d, index) => (
                    <div key={index} className={cn('flex gap-2 items-center h-10 w-full bg- px-2 rounded cursor-pointer', index === 1 ? "text-white bg-background hover:bg-accent" : 'text-white/80 bg-primary-foreground/20 border')}>
                        <span>
                            {d.svgPath}
                        </span>
                        <p className="text-[12px]">{d.text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
