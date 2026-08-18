import Image from "next/image";

export default function CreatorBoard({
  fullname,
  image,
}: {
  fullname?: string;
  image?: string;
}) {
  const displayName = fullname || "Anonymous";

  return (
    <div className="w-full h-fit p-5 bg-white rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.06),0_8px_16px_-8px_rgba(0,0,0,0.1)]">
      <p className="text-gray-900 text-sm font-semibold mb-3">Written by</p>
      <div className="flex items-center gap-3">
        <Image
          src={image || "/images/png/fill-image-2.png"}
          alt={displayName}
          width={40}
          height={40}
          className="rounded-full object-cover"
        />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">
            {displayName}
          </p>
          {fullname && (
            <p className="text-xs text-gray-500 truncate">
              @{fullname.replace(/\s+/g, "").toLowerCase()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
