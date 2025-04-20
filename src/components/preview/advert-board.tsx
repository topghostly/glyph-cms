import Image from "next/image";
import { Button } from "../ui/button";

export default function AdvertBoard() {
  return (
    <div className="w-full h-fit pb-5 bg-white border-1 border-gray-200">
      <div className="w-full h-[180px] relative">
        <Image
          src={"/images/png/fill-image.png"}
          alt="Glyph"
          className="object-center"
          fill
        />
      </div>
      <div className="p-5">
        <p className="text-[#334155]">
          Let’s create boldly, write freely, and never lose a great idea again.
        </p>
      </div>
      <div className="px-5">
        <Button variant={"secondary"} className="w-full text-sm ">
          Try Glyph
        </Button>
      </div>
    </div>
  );
}
