import type { FormEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type Signup01Props = {
  name: string;
  email: string;
  password: string;
  isLoading: boolean;
  error: string | null;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
};

export function Signup01({
  name,
  email,
  password,
  isLoading,
  error,
  onSubmit,
  onNameChange,
  onEmailChange,
  onPasswordChange,
}: Signup01Props) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card/80 p-6 shadow-sm backdrop-blur md:p-8">
        <div className="mb-6 text-center">
          <Link
            href="/"
            className="text-sm font-semibold tracking-wide text-muted-foreground hover:text-foreground"
          >
            GlowSafe
          </Link>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
            Create your account
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Set up your GlowSafe login to save your profile.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-foreground"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(event) => onNameChange(event.target.value)}
              className="block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none ring-0 transition focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-foreground"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => onEmailChange(event.target.value)}
              className="block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none ring-0 transition focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-foreground"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(event) => onPasswordChange(event.target.value)}
              className="block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none ring-0 transition focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
            />
          </div>

          {error ? (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}

          <Button
            type="submit"
            className="mt-2 w-full"
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Sign up"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

