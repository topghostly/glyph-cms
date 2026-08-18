import Image from "next/image";
import Link from "next/link";
import { FileQuestion } from "lucide-react";

const ErrorPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 bg-white">
      <Image
        src={"/images/svg/Glyph-black.svg"}
        alt="glyph logo"
        width={32}
        height={32}
        className="mb-8"
      />
      <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center mb-5">
        <FileQuestion size={24} className="text-gray-400" strokeWidth={1.5} />
      </div>
      <h1 className="text-xl font-bold text-gray-900 mb-2">
        This post isn&apos;t here
      </h1>
      <p className="text-sm text-gray-500 max-w-[340px] mb-6">
        It might have been unpublished or the link is off. Either way, there&apos;s
        nothing to read at this address.
      </p>
      <Link
        href="/"
        className="text-sm font-medium text-blue-600 hover:underline"
      >
        Back to Glyph
      </Link>
    </div>
  );
};

export default ErrorPage;
