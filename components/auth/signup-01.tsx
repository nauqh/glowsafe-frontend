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
		<div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-8">
			<div className="w-full max-w-lg rounded-[32px] border border-border/60 bg-card/90 p-7 shadow-[0_18px_60px_rgba(15,23,42,0.10)] backdrop-blur-sm sm:p-9 md:p-10">
				<div className="mb-8 text-center">
					<Link
						href="/"
						className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground"
					>
						GlowSafe
					</Link>
					<h1 className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-[28px]">
						Create your account
					</h1>
					<p className="mt-2 text-[13px] leading-relaxed text-muted-foreground sm:text-sm">
						Set up your GlowSafe login to save your profile.
					</p>
				</div>

				<form onSubmit={onSubmit} className="space-y-5">
					<div className="space-y-2">
						<label
							htmlFor="name"
							className="block text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground"
						>
							Name
						</label>
						<input
							id="name"
							type="text"
							autoComplete="name"
							required
							value={name}
							onChange={(event) =>
								onNameChange(event.target.value)
							}
							className="block w-full rounded-xl border border-input/70 bg-background/80 px-3.5 py-2.5 text-sm shadow-sm outline-none ring-0 transition focus-visible:border-foreground/70 focus-visible:ring-2 focus-visible:ring-foreground/10"
						/>
					</div>

					<div className="space-y-2">
						<label
							htmlFor="email"
							className="block text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground"
						>
							Email
						</label>
						<input
							id="email"
							type="email"
							autoComplete="email"
							required
							value={email}
							onChange={(event) =>
								onEmailChange(event.target.value)
							}
							className="block w-full rounded-xl border border-input/70 bg-background/80 px-3.5 py-2.5 text-sm shadow-sm outline-none ring-0 transition focus-visible:border-foreground/70 focus-visible:ring-2 focus-visible:ring-foreground/10"
						/>
					</div>

					<div className="space-y-2">
						<label
							htmlFor="password"
							className="block text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground"
						>
							Password
						</label>
						<input
							id="password"
							type="password"
							autoComplete="new-password"
							required
							value={password}
							onChange={(event) =>
								onPasswordChange(event.target.value)
							}
							className="block w-full rounded-xl border border-input/70 bg-background/80 px-3.5 py-2.5 text-sm shadow-sm outline-none ring-0 transition focus-visible:border-foreground/70 focus-visible:ring-2 focus-visible:ring-foreground/10"
						/>
					</div>

					{error ? (
						<p className="text-sm text-destructive" role="alert">
							{error}
						</p>
					) : null}

					<Button
						type="submit"
						className="mt-2 w-full rounded-full bg-foreground text-sm font-medium tracking-[0.08em] text-background shadow-none transition hover:bg-foreground/90"
						disabled={isLoading}
					>
						{isLoading ? "Creating account..." : "Sign up"}
					</Button>
				</form>

				<p className="mt-7 text-center text-xs text-muted-foreground sm:text-sm">
					Already have an account?{" "}
					<Link
						href="/login"
						className="font-medium text-foreground underline-offset-4 hover:underline"
					>
						Log in
					</Link>
				</p>
			</div>
		</div>
	);
}
