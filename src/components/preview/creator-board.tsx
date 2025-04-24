import Image from "next/image";

export default function CreatorBoard() {
  return (
    <div className="w-full h-fit p-5 bg-white border-1 rounded-md border-gray-200">
      <p className="text-[#334155] text-xl font-bold mb-2">Written by</p>
      <div className="flex gap-2">
        <Image
          src={"/images/png/web-icon.png"}
          alt="writer image"
          width={40}
          height={40}
          className="rounded-full"
        />
        <div>
          <p className="text-lg">Abolaji T.</p>
          <p className="text-xs">@bossBeaver</p>
        </div>
      </div>
    </div>
  );
}
