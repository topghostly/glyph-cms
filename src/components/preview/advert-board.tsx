import Image from "next/image";
import { Button } from "../ui/button";

export default function AdvertBoard() {
  return (
    <div className="w-full h-fit pb-5 bg-white rounded-xl overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.06),0_8px_16px_-8px_rgba(0,0,0,0.1)]">
      <div className="w-full h-[160px] relative">
        <Image
          src={"/images/png/fill-image-2.png"}
          alt="Glyph"
          className="object-center"
          fill
          sizes="290px"
        />
      </div>
      <div className="p-5">
        <p className="text-gray-600 text-sm">
          Let’s create boldly, write freely, and never lose a great idea again.
        </p>
      </div>
      <div className="px-5">
        <Button
          variant={"secondary"}
          className="w-full text-sm bg-blue-50 text-blue-700 hover:bg-blue-100"
        >
          Try Glyph
        </Button>
      </div>
    </div>
  );
}
