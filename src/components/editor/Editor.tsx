import { Separator } from "../ui/separator";
import { Topbar } from "./components/top-bar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ArticleLayers } from "./components/subject-layers";
import { ListLayers } from "./components/list-layers";
import { ActiveTask } from "./components/active-task";
import { Toolbar } from "./components/tool-bar";
// import { auth } from "@/auth";
// import { redirect } from "next/navigation";
export const Editor: React.FC = () => {
  //   const session = await auth();
  //   if (!session) {
  //     return redirect("/auth");
  //   }

  return (
    <main className="h-screen w-full relative grid grid-rows-[3.75rem_0.5px_1fr]">
      <Topbar />
      <Separator className="h-[0.2px] bg-accent" />
      <div className="flex w-full min-h-full relative px-3 max-w-[1440px] mx-auto overflow-x-hidden">
        <Separator orientation="vertical" />
        <ArticleLayers />
        <Separator orientation="vertical" />
        <ListLayers />
        <Separator orientation="vertical" />
        <ActiveTask />
        <Separator orientation="vertical" />
        {/* <Toolbar /> */}
      </div>
    </main>
  );
};
