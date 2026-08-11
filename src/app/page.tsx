"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useTheme } from "@/hooks/use-theme";
import { AuthStatus, useAuthStore } from "@/store/auth-store";

export default function Page() {
	const router = useRouter();
	const { mode: theme } = useTheme();
	const authStatus = useAuthStore((state) => state.authStatus);

	useEffect(() => {
		if (authStatus !== AuthStatus.Loading) {
			router.replace(
				authStatus === AuthStatus.Authenticated ? "/products" : "/login",
			);
		}
	}, [authStatus, router]);

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
