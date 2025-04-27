"use client";

// import { useAuth } from "@/store/auth-store";
import Image from "next/image";

export default function CreatorBoard({
  fullname,
  image,
}: {
  fullname?: string;
  image?: string;
}) {
  return (
    <div className="w-full h-fit p-5 bg-white border-1 rounded-md border-gray-200">
      <p className="text-[#334155] text-sm font-bold mb-2">Written by</p>
      <div className="flex gap-2">
        <Image
          src={image ?? "/images/png/fill-image-2.png"}
          // src={session?.user?.image ?? "/images/png/web-icon.png"}
          alt="writer image"
          width={40}
          height={40}
          className="rounded-full"
        />
        <div>
          <p className="text-lg text-[14px] font-bold truncate w-[130px]">
            {fullname ?? "Anonymous"}
          </p>
          <p className="text-xs">@{fullname!.replace(/\s+/g, "")}</p>
        </div>
      </div>
    </div>
  );
}
