"use client";

import { LogOut, Moon, Sun, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";

type UserActionsMenuProps = {
	email: string;
	onLogout: () => void;
};

export function UserActionsMenu({ email, onLogout }: UserActionsMenuProps) {
	const [isOpen, setIsOpen] = useState(false);
	const menuRef = useRef<HTMLElement>(null);
	const { mode, setMode } = useTheme();

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		const handlePointerDown = (event: PointerEvent) => {
			if (!menuRef.current?.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		document.addEventListener("pointerdown", handlePointerDown);

		return () => document.removeEventListener("pointerdown", handlePointerDown);
	}, [isOpen]);

	return (
		<section ref={menuRef} className="relative">
			<Button
				variant="outline"
				size="icon"
				onClick={() => setIsOpen((open) => !open)}
				aria-label="Abrir menu do usuário"
				aria-haspopup="menu"
				aria-expanded={isOpen}
			>
				<User aria-hidden="true" className="size-5" />
			</Button>
			{isOpen ? (
				<section
					className="absolute right-0 z-10 mt-2 w-72 rounded-[var(--radius-card)] border border-border bg-card p-2 shadow-lg"
					aria-label="Menu do usuário"
				>
					<p className="break-all px-3 py-1 text-sm font-semibold text-foreground">
						{email}
					</p>
					<div className="mt-1 mb-2 border-t border-border" />
					<fieldset
						aria-label="Tema"
						className="m-0 mx-2 grid min-w-0 grid-cols-2 overflow-hidden rounded-[var(--radius-card)] border border-border p-0"
					>
						<Button
							variant="ghost"
							size="compact"
							onClick={() => setMode("light")}
							aria-pressed={mode === "light"}
							className={`justify-center rounded-none border-r border-border px-2 hover:!bg-border ${
								mode === "light" ? "bg-border text-foreground" : ""
							}`}
						>
							<Sun aria-hidden="true" className="size-4" />
							Claro
						</Button>
						<Button
							variant="ghost"
							size="compact"
							onClick={() => setMode("dark")}
							aria-pressed={mode === "dark"}
							className={`justify-center rounded-none px-2 hover:!bg-border ${
								mode === "dark" ? "bg-border text-foreground" : ""
							}`}
						>
							<Moon aria-hidden="true" className="size-4" />
							Escuro
						</Button>
					</fieldset>
					<div className="my-2 border-t border-border" />
					<div role="menu">
						<Button
							variant="ghost"
							size="compact"
							onClick={onLogout}
							role="menuitem"
							className="w-full justify-start px-2 hover:!bg-border"
						>
							<LogOut aria-hidden="true" className="size-4" />
							Sair
						</Button>
					</div>
				</section>
			) : null}
		</section>
	);
}
