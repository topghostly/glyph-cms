"use client";

import { useCallback, useEffect } from "react";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { User } from "@/type/user";
import { toast } from "sonner";
import { useUser } from "@/store/user-store";

export default function HandleDatabase({ session }: { session: Session }) {
  const router = useRouter();
  const { updateUserInfo } = useUser();

  const addMailToDB = useCallback(
    async (data: User) => {
      try {
        const res = await fetch("/api/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        const result = await res.json();

        if (res.ok && result.user?._id) {
          console.log("✅ Received user ID from backend:", result.user._id);
          updateUserInfo({
            username: data.fullname,
            usermail: data.email,
            userImage: data.image,
            userId: result.user._id,
          });
          toast(`✅ Welcome, ${data.fullname}`);
          router.replace("/");
        } else {
          toast(`❌ An error occurred, please try again.`);
          console.error("Error result from server:", result);
          router.replace("/auth");
        }
      } catch (error) {
        toast(`❌ ERROR: ${error}`);
        console.error("API error:", error);
        router.replace("/auth");
      }
    },
    [router]
  );

  useEffect(() => {
    if (session?.user?.email && session.user.name && session.user.image) {
      const data: User = {
        email: session.user.email,
        fullname: session.user.name,
        image: session.user.image,
      };

      addMailToDB(data);
    }
  }, [session, addMailToDB]);

  return null;
}
