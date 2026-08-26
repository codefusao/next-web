"use client";

import { Boxes, ChartNoAxesCombined, Menu, Store, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { UserActionsMenu } from "@/components/navigation/user-actions-menu";
import { Button } from "@/components/ui/button";

const navigationItems = [
	{ href: "/products", label: "Produtos", icon: Boxes },
	{ href: "/stores", label: "Lojas", icon: Store },
	{ href: "/metrics", label: "Métricas", icon: ChartNoAxesCombined },
] as const;

type NavigationProps = {
	email: string;
	onLogout: () => void;
};

function navigationItemClass(active: boolean) {
	return `flex items-center gap-3 rounded-[var(--radius-control)] px-3 py-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
		active
			? "bg-primary/10 text-primary"
			: "text-muted hover:bg-card hover:text-foreground"
	}`;
}

function NavigationLinks({ onNavigate }: { onNavigate?: () => void }) {
	const pathname = usePathname();

	return (
		<nav aria-label="Navegação principal" className="space-y-1">
			{navigationItems.map(({ href, label, icon: Icon }) => {
				const active = pathname === href || pathname.startsWith(`${href}/`);
				return (
					<Link
						key={href}
						href={href}
						aria-current={active ? "page" : undefined}
						onClick={onNavigate}
						className={navigationItemClass(active)}
					>
						<Icon aria-hidden="true" className="size-5" />
						{label}
					</Link>
				);
			})}
		</nav>
	);
}

export function Navigation({ email, onLogout }: NavigationProps) {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	return (
		<>
			<header className="border-b border-border bg-background lg:hidden">
				<div className="relative flex h-16 items-center justify-center px-4 sm:px-6">
					<Button
						variant="ghost"
						size="icon"
						onClick={() => setIsMobileMenuOpen(true)}
						aria-label="Abrir menu de navegação"
						className="absolute left-4 text-muted hover:text-foreground sm:left-6"
					>
						<Menu aria-hidden="true" className="size-6" />
					</Button>
					<Image
						src="/leroy-merlin-logo.png"
						alt="Leroy Merlin"
						width={40}
						height={40}
						className="rounded-lg object-contain"
						priority
					/>
				</div>
			</header>
			{isMobileMenuOpen ? (
				<div className="fixed inset-0 z-50 lg:hidden">
					<button
						type="button"
						aria-label="Fechar menu de navegação"
						className="absolute inset-0 bg-black/40"
						onClick={() => setIsMobileMenuOpen(false)}
					/>
					<aside className="relative flex h-full w-72 flex-col border-r border-border bg-background p-4 shadow-xl">
						<div className="mb-8 flex justify-end">
							<Button
								variant="ghost"
								size="icon"
								onClick={() => setIsMobileMenuOpen(false)}
								aria-label="Fechar menu de navegação"
							>
								<X aria-hidden="true" className="size-6" />
							</Button>
						</div>
						<NavigationLinks onNavigate={() => setIsMobileMenuOpen(false)} />
						<div className="mt-auto border-t border-border pt-4">
							<UserActionsMenu email={email} onLogout={onLogout} />
						</div>
					</aside>
				</div>
			) : null}

			<aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-border bg-background p-4 lg:flex">
				<Image
					src="/leroy-merlin-logo.png"
					alt="Leroy Merlin"
					width={88}
					height={88}
					className="mb-10 ml-2 rounded-xl object-contain"
					priority
				/>
				<NavigationLinks />
				<div className="mt-auto border-t border-border pt-4">
					<UserActionsMenu email={email} onLogout={onLogout} />
				</div>
			</aside>
		</>
	);
}
