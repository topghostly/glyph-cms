import { signIn } from "@/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { GoogleSignInButton } from "./google-sign-in-button";

export default function SignIn() {
  return (
    <div className="max-w-screen max-h-screen h-screen overflow-hidden flex items-center justify-center">
      <Card className="max-w-100 w-[90%] h-fit flex flex-col gap-2">
        <CardHeader className="flex flex-col gap-1">
          <Image
            src={"/images/svg/Glyph-01.svg"}
            alt="glyph logo"
            width={32}
            height={32}
            className="mb-5"
          />
          <CardTitle className="text-xl">Sign In to Glyph</CardTitle>
          <CardDescription>
            Welcome back! Sign in with your Google account
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-5">
          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/" });
            }}
          >
            {/* useFormStatus only reports on the form it is rendered inside,
                so the button has to be its own client component. */}
            <GoogleSignInButton />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
