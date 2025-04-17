"use client";

import { useEffect, useState } from "react";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { User } from "@/type/user";

import { toast } from "sonner";

export default function HandleDatabase({ session }: { session: Session }) {
  /* ERROR STATE */
  //   const [error, setError] = useState("");
  /* ERROR STATE */

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
      const data: User = {
        email: session.user?.email!,
        fullname: session.user?.name!,
      };

      addmailToDB(data);
    }
  });

  return null;
}
