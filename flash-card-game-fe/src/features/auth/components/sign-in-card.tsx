"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TriangleAlert } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SignInflow } from "../api/auth-types";

import { logIn } from "@/services/api";
import { setTeacher } from "@/lib/storage";

interface SignInCardProps {
  setstate: (state: SignInflow) => void;
}

export const SignInCard = ({ setstate }: SignInCardProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const router = useRouter();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    setError("");

    //TODO: call signIn api here
    try {
      const teacher = await logIn(email, password);

      if (!teacher) {
        setError("Invalid email or password");
        return;
      }

      setTeacher(teacher);
      router.push("/dashboard");
    } catch (err) {
      setError("Something went wrong!");
    } finally {
      setPending(false);
    }
  };

  const onGoogleSignIn = () => {
    alert("test: Sign in with google");
  };

  return (
    <Card className="w=full max-w-md p-8 mx-auto mt-10">
      <CardHeader className="pt-0 px-0">
        <CardTitle>Log in to Flash dashboard</CardTitle>
        <CardDescription>Use your email to continue</CardDescription>
      </CardHeader>

      {error && (
        <div className="bg-destructive/15 rounded-md flex p-3 items-center gap-x-2 text-sm text-destructive mb-6">
          <TriangleAlert className="size-4" />
          <p>{error}</p>
        </div>
      )}

      <CardContent className="space-y-5 px-0 pb-0">
        <form className="space-y-2.5" onSubmit={onSubmit}>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={pending}
            type="email"
            placeholder="Email"
          />
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={pending}
            type="password"
            placeholder="Password"
          />
          <Button
            type="submit"
            className="w-full"
            disabled={pending}
            size={"lg"}
          >
            {pending ? "Logging in ..." : "Continue"}
          </Button>
        </form>
        <Separator />

        <div className="flex flex-col gap-y-2.5">
          <Button
            disabled={pending}
            onClick={onGoogleSignIn}
            className="w-full relative"
            variant={"outline"}
            size="lg"
          >
            <FcGoogle className="size-5 absolute top-3 left-2.5" />
            Continue with Google
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Don&apos;t have an account?{" "}
          <span
            className="text-sky-700 hover:underline cursor-pointer"
            onClick={() => setstate("SignUp")}
          >
            Sign up
          </span>
        </p>
      </CardContent>
    </Card>
  );
};
