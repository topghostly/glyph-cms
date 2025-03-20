import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Image from "next/image";

export const Topbar: React.FC = () => {
    return (
        <div className="px-5 max-w-[1440px] mx-auto h-13 overflow-hidden flex items-center justify-between">
            <div className="h-full flex gap-3 justify-center items-center">
                <Image
                    src={"/images/svg/Glyph-01.svg"}
                    alt="glyph logo"
                    width={25}
                    height={25}
                />
                <Button className="h-[30px] px-2" variant={'outline'}>
                    <span className="flex gap-0.5 justify-between items-center text-">
                        <Plus size={20} strokeWidth={1} />
                        Create
                    </span>
                </Button>
            </div>
        </div>
    );
};
