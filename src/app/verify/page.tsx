"use server";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { auth } from "@/auth";
import HandleDatabase from "@/components/verify/handle-database";

export default async function Verify() {
  const session = await auth();

  return (
    <div className="max-w-screen max-h-screen h-screen overflow-hidden flex items-center justify-center">
      {session && <HandleDatabase session={session} />}

      <Card className="max-w-100 w-[90%] h-fit flex flex-col gap-2">
        <CardHeader className="flex flex-col gap-1">
          <Image
            src={"/images/svg/Glyph-01.svg"}
            alt="glyph logo"
            width={32}
            height={32}
            className="mb-5"
          />
          <CardTitle className="text-md">
            Just verifying your Credentials
          </CardTitle>
          <CardDescription className="flex gap-2 items-center">
            You would be redirected shortly{" "}
            <div className="flex items-center justify-center">
              <div className="w-2.5 h-2.5 border-1 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
