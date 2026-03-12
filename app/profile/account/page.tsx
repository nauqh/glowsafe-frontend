"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { PROFILE_STORAGE_KEY, USER_EMAIL_STORAGE_KEY } from "@/lib/skin-profile-data";

export default function AccountPage() {
	const router = useRouter();
	const { data: session, isPending } = authClient.useSession();
	const [isSigningOut, setIsSigningOut] = useState(false);

	async function handleSignOut() {
		setIsSigningOut(true);
		await authClient.signOut();
		router.push("/");
	}

	function handleClearProfile() {
		localStorage.removeItem(PROFILE_STORAGE_KEY);
		localStorage.removeItem(USER_EMAIL_STORAGE_KEY);
		router.push("/profile");
	}

	if (isPending) {
		return (
			<div className="flex items-center justify-center py-20">
				<p className="text-muted-foreground">Loading...</p>
			</div>
		);
	}

	return (
		<>
			<h1 className="text-2xl font-medium tracking-tight text-foreground">
				Account
			</h1>
			<p className="mt-1 text-sm text-muted-foreground">
				Manage your GlowSafe account and data.
			</p>

			{/* Account info */}
			<section className="mt-8 rounded-2xl border border-border bg-card p-6">
				{session?.user && (
					<div className="space-y-4">
						<AccountRow label="Name" value={session.user.name} />
						<AccountRow label="Email" value={session.user.email} />
						<AccountRow
							label="Joined"
							value={
								session.user.createdAt
									? new Date(session.user.createdAt).toLocaleDateString(
											"en-AU",
											{
												year: "numeric",
												month: "long",
												day: "numeric",
											},
										)
									: "—"
							}
						/>
					</div>
				)}
			</section>

			{/* Actions */}
			<section className="mt-6 space-y-3">
				<div className="rounded-xl border border-border bg-card p-5">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-foreground">
								Sign out
							</p>
							<p className="mt-0.5 text-xs text-muted-foreground">
								You can always sign back in to access your profile.
							</p>
						</div>
						<Button
							variant="outline"
							size="sm"
							onClick={handleSignOut}
							disabled={isSigningOut}
							className="gap-2"
						>
							<LogOut className="size-3.5" />
							{isSigningOut ? "Signing out..." : "Sign out"}
						</Button>
					</div>
				</div>

				<div className="rounded-xl border border-border bg-card p-5">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-foreground">
								Reset profile
							</p>
							<p className="mt-0.5 text-xs text-muted-foreground">
								Clear your skin profile data from this device. You can rebuild
								it from the quiz.
							</p>
						</div>
						<Button
							variant="destructive"
							size="sm"
							onClick={handleClearProfile}
						>
							Reset
						</Button>
					</div>
				</div>

				<div className="rounded-xl border border-border bg-card p-5">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-foreground">
								Retake the quiz
							</p>
							<p className="mt-0.5 text-xs text-muted-foreground">
								Start fresh with the skin builder.
							</p>
						</div>
						<Link href="/skin-builder">
							<Button variant="outline" size="sm" className="gap-2">
								<ExternalLink className="size-3.5" />
								Skin Builder
							</Button>
						</Link>
					</div>
				</div>
			</section>
		</>
	);
}

function AccountRow({ label, value }: { label: string; value: string }) {
	return (
		<div className="flex items-baseline justify-between gap-4">
			<span className="shrink-0 text-xs font-medium uppercase tracking-wider text-muted-foreground">
				{label}
			</span>
			<span className="truncate text-sm font-medium text-foreground">
				{value}
			</span>
		</div>
	);
}
