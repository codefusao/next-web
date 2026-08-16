"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Navigation } from "@/components/navigation/navigation";
import { EmptyState } from "@/components/ui/empty-state";
import { PageLoadingState } from "@/components/ui/page-loading-state";
import {
	useCurrentSessionQuery,
	useLogoutMutation,
} from "@/hooks/use-auth-mutations";
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
	const setSession = useAuthStore((state) => state.login);
	const logout = useAuthStore((state) => state.logout);
	const queryClient = useQueryClient();
	const session = useCurrentSessionQuery();
	const logoutMutation = useLogoutMutation();

	async function handleLogout() {
		try {
			await logoutMutation.mutateAsync();
		} finally {
			logout();
			queryClient.clear();
			router.replace("/login");
		}
	}

	useEffect(() => {
		if (session.data) setSession(session.data);
		if (session.isError) {
			logout();
			router.replace("/login");
		}
	}, [logout, router, session.data, session.isError, setSession]);

	if (session.isPending || authStatus !== AuthStatus.Authenticated || !user) {
		return <PageLoadingState theme={theme} />;
	}

	if (user.role !== "ADMIN") {
		return (
			<main
				data-theme={theme}
				className="flex min-h-full flex-1 items-center justify-center bg-background p-6 text-foreground"
			>
				<EmptyState
					title="Acesso restrito"
					description="A administração de lojas está disponível apenas para administradores."
				/>
			</main>
		);
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
