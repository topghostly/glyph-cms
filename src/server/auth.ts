"use server";

import { signIn, signOut, auth } from "@/auth";

export const logIn = async () => {
  await signIn("google", {
    redirectTo: "/",
  });
};

export const logOut = async () => {
  await signOut({ redirectTo: "/auth" });
};

export async function getAuthSession() {
  return await auth();
}
