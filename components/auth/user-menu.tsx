"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export function UserMenu() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [isSigningOut, setIsSigningOut] = useState(false);

  if (isPending) {
    return null;
  }

  async function handleSignOut() {
    setIsSigningOut(true);
    await authClient.signOut();
    router.push("/");
  }

  if (!session) {
    return (
      <div className="flex items-center gap-4">
        <Link
          href="/login"
          className="text-sm font-semibold text-white decoration-white/30 underline-offset-4 transition-colors duration-300 hover:text-white hover:decoration-white/70 group-hover:text-foreground/70 group-hover:decoration-transparent group-hover:hover:text-foreground"
        >
          Log in
        </Link>
        <Link
          href="/signup"
          className="rounded-full border border-white/60 px-4 py-1.5 text-sm font-semibold text-white transition-colors duration-300 hover:border-white hover:bg-white/10 hover:text-white group-hover:border-foreground/40 group-hover:text-foreground group-hover:hover:bg-foreground group-hover:hover:text-background"
        >
          Sign up
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/profile"
        className="text-sm font-semibold text-white decoration-white/30 underline-offset-4 transition-colors duration-300 hover:text-white hover:decoration-white/70 group-hover:text-foreground/70 group-hover:decoration-transparent group-hover:hover:text-foreground"
      >
        Profile
      </Link>
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="border-white/60 bg-black/10 text-white hover:border-white hover:bg-white/10 hover:text-white group-hover:border-foreground/40 group-hover:bg-transparent group-hover:text-foreground"
        onClick={handleSignOut}
        disabled={isSigningOut}
      >
        {isSigningOut ? "Signing out..." : "Sign out"}
      </Button>
    </div>
  );
}

