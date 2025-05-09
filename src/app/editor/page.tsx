"use server";

import { auth } from "@/auth";
import { Editor } from "@/components/editor/Editor";
import { ErrorBoundary } from "@/components/error-boundaty";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  if (session)
    return (
      <div className="w-screen max-h-screen h-screen bg-background overflow-hidden select-none">
        <ErrorBoundary>
          <Editor session={session} />
        </ErrorBoundary>
      </div>
    );

  return redirect("/auth");
}
