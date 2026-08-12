"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

type RemoveCatalogLocationDialogProps = {
	productName: string;
	onCancel: () => void;
	onConfirm: () => void;
};

export function RemoveCatalogLocationDialog({
	productName,
	onCancel,
	onConfirm,
}: RemoveCatalogLocationDialogProps) {
	return (
		<Modal
			title="Remover localização?"
			description={`A localização de ${productName} será removida deste catálogo.`}
			closeLabel="Fechar remoção de localização"
			onClose={onCancel}
		>
			<div className="mt-6 flex justify-end gap-3">
				<Button variant="outline" onClick={onCancel}>
					Cancelar
				</Button>
				<Button variant="destructive" onClick={onConfirm}>
					<AlertTriangle aria-hidden="true" className="size-4" />
					Remover localização
				</Button>
			</div>
		</Modal>
	);
}
