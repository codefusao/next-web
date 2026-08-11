"use client";

import { Boxes, Store } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { UserActionsMenu } from "@/components/admin/user-actions-menu";
import { useTheme } from "@/hooks/use-theme";
import { AuthStatus, useAuthStore } from "@/store/auth-store";

const tabs = [
	{ href: "/products", label: "Produtos", icon: Boxes },
	{ href: "/stores", label: "Lojas", icon: Store },
] as const;

export default function TabsLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	const pathname = usePathname();
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

			<nav
				aria-label="Áreas administrativas"
				className="border-b border-border bg-card"
			>
				<div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 sm:px-6">
					{tabs.map(({ href, label, icon: Icon }) => {
						const active = pathname === href || pathname.startsWith(`${href}/`);
						return (
							<Link
								key={href}
								href={href}
								aria-current={active ? "page" : undefined}
								className={`inline-flex shrink-0 cursor-pointer items-center gap-2 border-b-2 px-4 py-3 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary ${active ? "border-primary text-primary" : "border-transparent text-muted hover:border-border hover:text-foreground"}`}
							>
								<Icon aria-hidden="true" className="size-4" />
								{label}
							</Link>
						);
					})}
				</div>
			</nav>

			<div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
				{children}
			</div>
		</main>
	);
}
