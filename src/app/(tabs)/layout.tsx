"use client";

import { Boxes, LogOut, Moon, Settings, Store, Sun } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { AuthStatus, useAuthStore } from "@/store/auth-store";

const tabs = [
	{ href: "/products", label: "Produtos", icon: Boxes },
	{ href: "/stores", label: "Lojas", icon: Store },
	{ href: "/settings", label: "Configurações", icon: Settings },
] as const;

export default function TabsLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	const pathname = usePathname();
	const router = useRouter();
	const { mode: theme, toggle: toggleTheme } = useTheme();
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
			<header className="border-b border-border bg-card">
				<div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
					<Image
						src="/leroy-merlin-logo.png"
						alt="Leroy Merlin"
						width={40}
						height={40}
						className="rounded-lg"
						priority
					/>
					<div className="min-w-0 flex-1">
						<p className="text-sm font-bold text-primary">LEROY MERLIN</p>
						<h1 className="truncate text-base font-semibold">Administração</h1>
					</div>
					<p className="hidden text-sm text-muted sm:block">{user.email}</p>
					<Button
						variant="outline"
						size="icon"
						onClick={toggleTheme}
						className="text-muted hover:text-foreground"
						aria-label={`Ativar tema ${theme === "light" ? "escuro" : "claro"}`}
					>
						{theme === "dark" ? (
							<Sun aria-hidden="true" className="size-5" />
						) : (
							<Moon aria-hidden="true" className="size-5" />
						)}
					</Button>
					<Button
						variant="outline"
						size="compact"
						onClick={() => {
							logout();
							router.replace("/login");
						}}
					>
						<LogOut aria-hidden="true" className="size-4" />
						<span className="hidden sm:inline">Sair</span>
						<span className="sr-only sm:hidden">Sair</span>
					</Button>
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
								{href !== "/products" ? (
									<span className="text-xs font-medium">Em breve</span>
								) : null}
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
