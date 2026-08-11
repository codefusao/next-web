import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

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
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
			role="presentation"
		>
			<section
				className="w-full max-w-md rounded-[var(--radius-card)] border border-border bg-card p-6 shadow-xl"
				role="alertdialog"
				aria-modal="true"
				aria-labelledby="delete-store-title"
				aria-describedby="delete-store-description"
			>
				<span className="inline-flex rounded-lg bg-destructive/10 p-2 text-destructive">
					<AlertTriangle aria-hidden="true" className="size-6" />
				</span>
				<h2 id="delete-store-title" className="mt-4 text-xl font-bold">
					Excluir loja?
				</h2>
				<p
					id="delete-store-description"
					className="mt-2 text-sm leading-6 text-muted"
				>
					A loja {storeName} será removida da lista local. Esta ação não pode
					ser desfeita.
				</p>
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
			</section>
		</div>
	);
}
