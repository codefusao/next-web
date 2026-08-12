"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { PageLoadingState } from "@/components/ui/page-loading-state";
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

	return <PageLoadingState theme={theme} />;
}
