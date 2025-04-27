"use client";

import React from "react";
// import { Button } from "@/components/ui/button";
// import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardDescription } from "../ui/card";

const ErrorPage: React.FC = () => {
  //   const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4 bg-white">
      <Card className="max-w-100 w-[90%] h-fit flex flex-col gap-1 bg-white border-[#b3b3b3]">
        <CardHeader className="flex flex-col gap-1">
          <Image
            src={"/images/svg/Glyph-01.svg"}
            alt="glyph logo"
            width={40}
            height={40}
            className="mb-5"
          />
          <CardTitle className="text-lg text-red-500">
            Something went wrong
          </CardTitle>
          <CardDescription className="">
            <p className="text-left">
              We couldn&apos;t load this blog post. It might have been deleted
              or there was a network issue.
            </p>
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
};

export default ErrorPage;
