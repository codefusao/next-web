"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { StoreBasicFormFields } from "@/components/stores/forms/store-basic-form-fields";
import { StoreMetadataFormFields } from "@/components/stores/forms/store-metadata-form-fields";
import { Button } from "@/components/ui/button";
import { useUpdateStoreMutation } from "@/hooks/use-stores-query";
import {
	type UpdateStoreFields,
	type UpdateStoreFormInputs,
	updateStoreSchema,
} from "@/schemas/store";
import type { StoreListItem } from "@/types/store";

type EditStoreFormProps = {
	store: StoreListItem;
	onCancel: () => void;
	onSave: () => void;
};

export function EditStoreForm({ store, onCancel, onSave }: EditStoreFormProps) {
	const updateStore = useUpdateStoreMutation();
	const {
		register,
		handleSubmit,
		formState: { errors, isDirty },
	} = useForm<UpdateStoreFormInputs, undefined, UpdateStoreFields>({
		resolver: zodResolver(updateStoreSchema),
		defaultValues: {
			parentId: store.parentId ?? "",
			name: store.name,
			address: store.address ?? "",
			cnpj: store.cnpj ?? "",
			description: store.description ?? "",
			bannerUrl: store.bannerUrl,
			status: store.status,
			type: store.type,
			manager: store.manager,
			phone: store.phone,
			email: store.email,
			area: store.area,
		},
		reValidateMode: "onChange",
	});

	async function submitStore(fields: UpdateStoreFields) {
		try {
			await updateStore.mutateAsync({ store, changes: fields });
			toast.success("Informações da loja atualizadas.");
			onSave();
		} catch {
			toast.error("Não foi possível atualizar a loja.");
		}
	}

	return (
		<form onSubmit={handleSubmit(submitStore)} noValidate className="mt-7">
			<StoreBasicFormFields
				register={register}
				errors={errors}
				mode="edit"
				idPrefix="edit-store"
			/>
			<StoreMetadataFormFields register={register} errors={errors} />
			<div className="mt-6 flex justify-end gap-3 border-t border-border pt-6">
				<Button type="button" variant="outline" onClick={onCancel}>
					Cancelar
				</Button>
				<Button type="submit" disabled={!isDirty || updateStore.isPending}>
					<Save aria-hidden="true" className="size-5" />
					Salvar alterações
				</Button>
			</div>
		</form>
	);
}
