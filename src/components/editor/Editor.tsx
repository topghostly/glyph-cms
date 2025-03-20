import { Separator } from "@radix-ui/react-separator"
import { Topbar } from "./components/top-bar"
import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { ArticleLayers } from "./components/subject-layers"
import { ListLayers } from "./components/list-layers"
import { ActiveTask } from "./components/active-task"


export const Editor: React.FC = () => {
    return (
        <main className="h-screen w-full relative grid grid-rows-[3.75rem_0.5px_1fr]">
            <Topbar />
            <Separator className="h-[0.2px] bg-accent" />
            <div className="flex w-full min-h-full relative px-3 max-w-[1440px] mx-auto overflow-x-hidden">
                <ArticleLayers />
                <Separator orientation="vertical" className="bg-accent w-[0.2px]" />
                <ListLayers />
                <Separator orientation="vertical" className="bg-accent w-[0.2px]" />
                <ActiveTask />
                <Separator orientation="vertical" className="bg-accent w-[0.2px]" />
            </div>
        </main>
    )
}
