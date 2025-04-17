"use client";

import { useEffect } from "react";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { User } from "@/type/user";
import { useAuth } from "@/store/auth-store";
import { toast } from "sonner";

export default function HandleDatabase({ session }: { session: Session }) {
  const { updateUserId } = useAuth();
  const router = useRouter();

  const addmailToDB = async (data: User) => {
    try {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      console.log("Result is:", result.user._id);

      //Update user _id
      updateUserId(result.user._id);

      if (res.ok) {
        toast(`Welcome, ${data.fullname}`);
        console.log("Added");
        router.replace("/");
      } else {
        toast(`ERROR: An error occured, please try again`);
        router.replace("/auth");
      }
    } catch (error) {
      toast(`ERROR: ${error}`);
      router.replace("/auth");
    }
  };

  useEffect(() => {
    if (session) {
      if (!session.user?.email || !session.user?.name) return;
      const data: User = {
        email: session.user?.email,
        fullname: session.user?.name,
      };

      addmailToDB(data);
    }
  });

  return null;
}
