import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

type DeleteStoreDialogProps = {
	storeName: string;
	onCancel: () => void;
	onConfirm: () => void;
};

export function DeleteStoreDialog({
	storeName,
	onCancel,
	onConfirm,
}: DeleteStoreDialogProps) {
	return (
		<Modal
			title="Excluir loja?"
			description={`A loja ${storeName} será removida da lista local. Esta ação não pode ser desfeita.`}
			closeLabel="Fechar exclusão de loja"
			onClose={onCancel}
		>
			<span className="inline-flex rounded-lg bg-destructive/10 p-2 text-destructive">
				<AlertTriangle aria-hidden="true" className="size-6" />
			</span>
			<div className="mt-6 flex justify-end gap-3">
				<Button variant="outline" onClick={onCancel}>
					Cancelar
				</Button>
				<Button
					variant="outline"
					onClick={onConfirm}
					className="border-destructive text-destructive hover:bg-destructive/10 focus-visible:outline-destructive"
				>
					<span className="text-destructive">Excluir loja</span>
				</Button>
			</div>
		</Modal>
	);
}
