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

import { useState } from "react";
import { signUp } from "@/services/api";
import { setTeacher } from "@/lib/storage";
import { useRouter } from "next/navigation";
import { SignInflow } from "../api/auth-types";

interface SignUpCardProps {
  setstate: (state: SignInflow) => void;
}

export const SignUpCard = ({ setstate }: SignUpCardProps) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setPending(true);
    try {
      const newTeacher = await signUp(username, email, password);
      console.log("Signed up successfully:", newTeacher);

      setTeacher(newTeacher);
      router.push("/dashboard");
    } catch (err: any) {
      setError("Sign up failed");
    } finally {
      setPending(false);
    }
  };

  return (
    <Card className="w-full h-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Create your teacher account</CardTitle>
        <CardDescription>
          Sign up to manage your flash game modules
        </CardDescription>
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
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={pending}
            required
          />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={pending}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={pending}
            required
          />
          <Input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={pending}
            required
          />
          <Button type="submit" className="w-full" size="lg" disabled={pending}>
            Create Account
          </Button>
        </form>

        <Separator />

        <p className="text-xs text-muted-foreground">
          Already have an account?{" "}
          <span
            className="text-sky-700 hover:underline cursor-pointer"
            onClick={() => setstate("SignIn")}
          >
            Sign in
          </span>
        </p>
      </CardContent>
    </Card>
  );
};
