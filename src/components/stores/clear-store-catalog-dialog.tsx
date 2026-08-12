"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

type ClearStoreCatalogDialogProps = {
	onCancel: () => void;
	onConfirm: () => void;
};

export function ClearStoreCatalogDialog({
	onCancel,
	onConfirm,
}: ClearStoreCatalogDialogProps) {
	return (
		<Modal
			title="Trocar o mapa da loja?"
			description="As localizações do catálogo serão removidas porque elas não correspondem ao novo mapa. Esta ação não pode ser desfeita."
			closeLabel="Fechar confirmação de troca de mapa"
			onClose={onCancel}
		>
			<div className="mt-6 flex justify-end gap-3">
				<Button variant="outline" onClick={onCancel}>
					Cancelar
				</Button>
				<Button variant="destructive" onClick={onConfirm}>
					<AlertTriangle aria-hidden="true" className="size-4" />
					Trocar e limpar locais
				</Button>
			</div>
		</Modal>
	);
}
