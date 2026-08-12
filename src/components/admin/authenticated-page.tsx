"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Navigation } from "@/components/navigation/navigation";
import { PageLoadingState } from "@/components/ui/page-loading-state";
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

	function handleLogout() {
		logout();
		router.replace("/login");
	}

	useEffect(() => {
		if (authStatus === AuthStatus.Unauthenticated) router.replace("/login");
	}, [authStatus, router]);

	if (authStatus !== AuthStatus.Authenticated || !user) {
		return <PageLoadingState theme={theme} />;
	}

	return (
		<main
			data-theme={theme}
			className="min-h-full flex-1 bg-background text-foreground lg:flex"
		>
			<Navigation email={user.email} onLogout={handleLogout} />
			<div className="min-w-0 flex-1">{children}</div>
		</main>
	);
}
