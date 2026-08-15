import { EditStoreForm } from "@/components/stores/forms/edit-store-form";
import { Modal } from "@/components/ui/modal";
import type { CompanyListItem } from "@/types/company";

type EditStoreModalProps = {
	isOpen: boolean;
	onClose: () => void;
	store: CompanyListItem;
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
		<Modal
			title="Editar informações da loja"
			description={`Atualize os dados de ${store.name}.`}
			closeLabel="Fechar formulário de edição da loja"
			onClose={onClose}
			size="lg"
			layout="scrollable"
		>
			<EditStoreForm store={store} onCancel={onClose} onSave={onClose} />
		</Modal>
	);
}
