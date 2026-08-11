"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { UserActionsMenu } from "@/components/admin/user-actions-menu";
import { useTheme } from "@/hooks/use-theme";
import { AuthStatus, useAuthStore } from "@/store/auth-store";

type AuthenticatedPageProps = {
	children: React.ReactNode;
};

export function AuthenticatedPage({ children }: AuthenticatedPageProps) {
	const router = useRouter();
	const { mode: theme } = useTheme();
	const user = useAuthStore((state) => state.user);
	const authStatus = useAuthStore((state) => state.authStatus);
	const logout = useAuthStore((state) => state.logout);

	useEffect(() => {
		if (authStatus === AuthStatus.Unauthenticated) router.replace("/login");
	}, [authStatus, router]);

	if (authStatus !== AuthStatus.Authenticated || !user) {
		return (
			<main
				data-theme={theme}
				className="flex min-h-full flex-1 items-center justify-center bg-background text-muted"
				aria-busy="true"
			>
				Carregando…
			</main>
		);
	}

	return (
		<main
			data-theme={theme}
			className="min-h-full flex-1 bg-background text-foreground"
		>
			<header className="bg-card">
				<div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
					<Image
						src="/leroy-merlin-logo.png"
						alt="Leroy Merlin"
						width={80}
						height={80}
						className="rounded-lg"
						priority
					/>
					<div className="min-w-0 flex-1" />
					<UserActionsMenu
						email={user.email}
						onLogout={() => {
							logout();
							router.replace("/login");
						}}
					/>
				</div>
			</header>
			{children}
		</main>
	);
}
