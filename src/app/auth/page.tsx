import { signIn } from "@/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
// import { useAuth } from "@/store/auth-store";

export default function SignIn() {
  //   const { setSession } = useAuth();
  return (
    <div className="max-w-screen max-h-screen h-screen overflow-hidden flex items-center justify-center">
      <Card className="w-100 h-fit flex flex-col gap-2">
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
              await signIn("google", {
                redirectTo: "/",
              });
            }}
          >
            <Button
              variant={"outline"}
              type="submit"
              className="w-full cursor-pointer"
            >
              <Image
                src={"/images/svg/google.svg"}
                alt="glyph logo"
                width={18}
                height={18}
              />
              Signin with Google
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
