"use client";

import { PackagePlus } from "lucide-react";
import { useState } from "react";
import { AddProductForm } from "@/components/products/forms/add-product-form";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

export function AddProductModal() {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<Button
				type="button"
				size="compact"
				onClick={() => setIsOpen(true)}
				className="h-[var(--control-height-input)] shrink-0"
			>
				<PackagePlus aria-hidden="true" className="size-4" />
				Adicionar produto
			</Button>
			{isOpen ? (
				<Modal
					title="Adicionar produto"
					description="Crie um produto de catálogo."
					closeLabel="Fechar formulário de produto"
					onClose={() => setIsOpen(false)}
					size="lg"
					layout="scrollable"
				>
					<AddProductForm onSuccess={() => setIsOpen(false)} />
				</Modal>
			) : null}
		</>
	);
}
