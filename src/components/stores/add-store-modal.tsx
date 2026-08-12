"use client";

import { Store } from "lucide-react";
import { useState } from "react";
import { AddStoreForm } from "@/components/stores/add-store-form";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

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
				<Modal
					title="Adicionar loja"
					description="Inclua uma unidade na lista local."
					closeLabel="Fechar formulário de loja"
					onClose={() => setIsOpen(false)}
					size="lg"
					layout="scrollable"
				>
					<AddStoreForm onSuccess={() => setIsOpen(false)} />
				</Modal>
			) : null}
		</>
	);
}
