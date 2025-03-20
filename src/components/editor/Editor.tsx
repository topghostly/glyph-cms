import { Separator } from "@radix-ui/react-separator"
import { Topbar } from "./components/top-bar"
import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"


export const Editor: React.FC = () => {
    return (
        <main className="h-screen w-full">
            <Topbar />
            <Separator className="h-[0.2px] bg-accent" />
        </main>
    )
}
