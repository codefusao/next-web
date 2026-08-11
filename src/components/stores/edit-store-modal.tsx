import { X } from "lucide-react";
import { EditStoreForm } from "@/components/stores/edit-store-form";
import { Button } from "@/components/ui/button";
import type { StoreListItem } from "@/types/store";

type EditStoreModalProps = {
	isOpen: boolean;
	onClose: () => void;
	store: StoreListItem;
};

export function EditStoreModal({
	isOpen,
	onClose,
	store,
}: EditStoreModalProps) {
	if (!isOpen) {
		return null;
	}

	return (
		<div
			className="fixed inset-0 z-50 overflow-y-auto bg-black/50 p-4 sm:p-8"
			role="presentation"
		>
			<section
				className="mx-auto w-full max-w-5xl rounded-[var(--radius-card)] border border-border bg-card p-5 shadow-xl sm:p-7"
				role="dialog"
				aria-modal="true"
				aria-labelledby="edit-store-title"
			>
				<div className="flex items-start justify-between gap-4">
					<div>
						<h2
							id="edit-store-title"
							className="text-2xl font-bold tracking-tight"
						>
							Editar informações da loja
						</h2>
						<p className="mt-1 text-sm leading-6 text-muted">
							Atualize os dados de {store.name}.
						</p>
					</div>
					<Button
						type="button"
						variant="ghost"
						size="icon-sm"
						onClick={onClose}
						aria-label="Fechar formulário de edição da loja"
					>
						<X aria-hidden="true" className="size-5" />
					</Button>
				</div>
				<EditStoreForm store={store} onCancel={onClose} onSave={onClose} />
			</section>
		</div>
	);
}
