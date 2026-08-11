"use client";

import { Store, X } from "lucide-react";
import { useState } from "react";
import { AddStoreForm } from "@/components/stores/add-store-form";
import { Button } from "@/components/ui/button";

export function AddStoreModal() {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<Button
				type="button"
				size="compact"
				onClick={() => setIsOpen(true)}
				className="h-[var(--control-height-input)] shrink-0"
			>
				<Store aria-hidden="true" className="size-4" />
				Adicionar loja
			</Button>
			{isOpen ? (
				<div
					className="fixed inset-0 z-50 overflow-y-auto bg-black/50 p-4 sm:p-8"
					role="presentation"
				>
					<section
						className="mx-auto w-full max-w-5xl rounded-[var(--radius-card)] border border-border bg-card p-5 shadow-xl sm:p-7"
						role="dialog"
						aria-modal="true"
						aria-labelledby="add-store-title"
					>
						<div className="flex items-start justify-between gap-4">
							<div>
								<h2
									id="add-store-title"
									className="text-2xl font-bold tracking-tight"
								>
									Adicionar loja
								</h2>
								<p className="mt-1 text-sm leading-6 text-muted">
									Inclua uma unidade na lista local.
								</p>
							</div>
							<Button
								type="button"
								variant="ghost"
								size="icon-sm"
								onClick={() => setIsOpen(false)}
								aria-label="Fechar formulário de loja"
							>
								<X aria-hidden="true" className="size-5" />
							</Button>
						</div>
						<AddStoreForm onSuccess={() => setIsOpen(false)} />
					</section>
				</div>
			) : null}
		</>
	);
}
