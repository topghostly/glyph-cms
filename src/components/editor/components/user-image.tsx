"use server";

import { auth } from "@/auth";
import ProfileImage from "./top-bar";
import Image from "next/image";

export default async function Profile() {
  const session = await auth();
  console.log(session);

  return (
    <div>
      {session?.user?.image && (
        <Image src={session.user.image} alt="user image" />
      )}
    </div>
  );
}
