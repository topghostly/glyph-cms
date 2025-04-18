"use client";

import { useEffect } from "react";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { User } from "@/type/user";
import { toast } from "sonner";

export default function HandleDatabase({ session }: { session: Session }) {
  const router = useRouter();

  const addMailToDB = async (data: User) => {
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
        localStorage.setItem("localUserId", result.user._id);
        toast(`Welcome, ${data.fullname}`);
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
  };

  useEffect(() => {
    if (session?.user?.email && session.user.name) {
      const data: User = {
        email: session.user.email,
        fullname: session.user.name,
      };

      addMailToDB(data);
    }
  }, [session, addMailToDB]);

  return null;
}
