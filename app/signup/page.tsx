"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Signup01 } from "@/components/auth/signup-01";

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackURL = searchParams.get("callbackUrl") ?? "/profile";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    const { error } = await authClient.signUp.email({
      name,
      email,
      password,
      callbackURL,
    });

    if (error) {
      setError(error.message ?? "Something went wrong. Please try again.");
      setIsLoading(false);
      return;
    }

    router.push(callbackURL);
  }

  return (
    <Signup01
      name={name}
      email={email}
      password={password}
      isLoading={isLoading}
      error={error}
      onSubmit={handleSubmit}
      onNameChange={setName}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
    />
  );
}

