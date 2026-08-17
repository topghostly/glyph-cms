"use client";

import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import Image from "next/image";
import { Button } from "@/components/ui/button";

/**
 * Submit button for the Google sign-in form.
 *
 * `useFormStatus` reports the server action as pending, but signing in
 * navigates away to Google — the action never "finishes" from this page's
 * point of view. If the browser then restores this page from the back/
 * forward cache (user hits Back from the Google consent screen, or an
 * OAuth error bounces them here), React state comes back exactly as it was
 * and the spinner would be stuck on forever.
 *
 * The `pageshow` listener catches that restore (`event.persisted` is true
 * only for a bfcache restore, not a normal load) and clears the spinner.
 * Clicking again re-arms it.
 */
export function GoogleSignInButton() {
  const { pending } = useFormStatus();
  const [restoredFromCache, setRestoredFromCache] = useState(false);

  useEffect(() => {
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) setRestoredFromCache(true);
    };

    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  const loading = pending && !restoredFromCache;

  return (
    <Button
      variant={"outline"}
      type="submit"
      // Re-arm the spinner for a fresh attempt after a bfcache restore.
      onClick={() => setRestoredFromCache(false)}
      disabled={loading}
      aria-busy={loading}
      className="w-full cursor-pointer disabled:cursor-not-allowed"
    >
      {loading ? (
        <>
          <span
            aria-hidden="true"
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
          />
          Signing in…
        </>
      ) : (
        <>
          <Image
            src={"/images/svg/google.svg"}
            alt=""
            width={18}
            height={18}
          />
          Signin with Google
        </>
      )}
    </Button>
  );
}
