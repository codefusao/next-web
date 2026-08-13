"use client";

import { LogOut, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";

type UserActionsMenuProps = {
	email: string;
	onLogout: () => void;
};

export function UserActionsMenu({ email, onLogout }: UserActionsMenuProps) {
	const [isOpen, setIsOpen] = useState(false);
	const { mode, setMode } = useTheme();

	return (
		<section>
			<Button
				variant="outline"
				size="compact"
				onClick={() => setIsOpen((open) => !open)}
				aria-label="Abrir ações da conta"
				aria-haspopup="dialog"
				aria-expanded={isOpen}
				className="h-auto w-full justify-start border-transparent px-3 py-3 text-left text-muted hover:bg-card hover:text-foreground"
			>
				<span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-foreground text-sm font-bold text-background">
					{email.slice(0, 1).toUpperCase()}
				</span>
				<span className="min-w-0">
					<span className="block truncate text-sm font-bold text-foreground">
						{email}
					</span>
				</span>
			</Button>
			{isOpen
				? createPortal(
						<div
							data-theme={mode}
							className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
							role="presentation"
						>
							<button
								type="button"
								aria-label="Fechar configurações"
								className="absolute inset-0"
								onClick={() => setIsOpen(false)}
							/>
							<section
								className="relative z-10 w-full max-w-sm rounded-[var(--radius-card)] border border-border bg-card p-5 text-foreground shadow-xl"
								role="dialog"
								aria-modal="true"
								aria-labelledby="settings-menu-title"
							>
								<h2 id="settings-menu-title" className="text-lg font-bold">
									Configurações
								</h2>
								<p className="mt-1 break-all text-sm text-muted">{email}</p>
								<fieldset
									aria-label="Tema"
									className="mt-5 grid min-w-0 grid-cols-2 overflow-hidden rounded-[var(--radius-card)] border border-border"
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
								<div className="my-5 border-t border-border" />
								<Button
									variant="ghost"
									size="compact"
									onClick={onLogout}
									className="w-full justify-start px-2 hover:!bg-border"
								>
									<LogOut aria-hidden="true" className="size-4" />
									Sair
								</Button>
							</section>
						</div>,
						document.body,
					)
				: null}
		</section>
	);
}
