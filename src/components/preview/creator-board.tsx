// import { useAuth } from "@/store/auth-store";
import Image from "next/image";

export default function CreatorBoard() {
  // const { session } = useAuth();
  return (
    <div className="w-full h-fit p-5 bg-white border-1 rounded-md border-gray-200">
      <p className="text-[#334155] text-sm font-bold mb-2">Written by</p>
      <div className="flex gap-2">
        <Image
          src={"/images/png/fill-image-2.png"}
          // src={session?.user?.image ?? "/images/png/web-icon.png"}
          alt="writer image"
          width={40}
          height={40}
          className="rounded-full"
        />
        <div>
          <p className="text-lg text-[14px] font-bold truncate w-[130px]">
            {localStorage.getItem("glyph-username")}
          </p>
          <p className="text-xs">
            @{localStorage.getItem("glyph-username")!.replace(/\s+/g, "")}
          </p>
        </div>
      </div>
    </div>
  );
}
