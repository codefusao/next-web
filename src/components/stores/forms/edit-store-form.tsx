"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { StoreBasicFormFields } from "@/components/stores/forms/store-basic-form-fields";
import { StoreMetadataFormFields } from "@/components/stores/forms/store-metadata-form-fields";
import { Button } from "@/components/ui/button";
import { useUpdateCompanyMutation } from "@/hooks/use-companies-query";
import {
	type UpdateCompanyFields,
	type UpdateCompanyFormInputs,
	updateCompanySchema,
} from "@/schemas/company";
import type { CompanyListItem } from "@/types/company";

type EditStoreFormProps = {
	store: CompanyListItem;
	onCancel: () => void;
	onSave: () => void;
};

export function EditStoreForm({ store, onCancel, onSave }: EditStoreFormProps) {
	const updateCompany = useUpdateCompanyMutation();
	const {
		register,
		setValue,
		handleSubmit,
		formState: { errors, isDirty },
	} = useForm<UpdateCompanyFormInputs, undefined, UpdateCompanyFields>({
		resolver: zodResolver(updateCompanySchema),
		defaultValues: {
			parentId: store.parentId ?? "",
			name: store.name,
			address: store.address ?? "",
			cnpj: store.cnpj,
			description: store.description ?? "",
			bannerUrl: store.bannerUrl ?? "",
			status: store.status ?? "",
			manager: store.manager ?? "",
			phone: store.phone ?? "",
			email: store.email ?? "",
			area: store.area ?? "",
		},
		reValidateMode: "onChange",
	});

	async function submitStore(fields: UpdateCompanyFields) {
		try {
			await updateCompany.mutateAsync({ company: store, changes: fields });
			toast.success("Informações da loja atualizadas.");
			onSave();
		} catch (error) {
			console.error("Unable to update store information", error);
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
				companyId={store.id}
				onParentCompanyIdChange={(companyId) =>
					setValue("parentId", companyId, {
						shouldDirty: true,
						shouldValidate: true,
					})
				}
			/>
			<StoreMetadataFormFields register={register} errors={errors} />
			<div className="mt-6 flex justify-end gap-3 border-t border-border pt-6">
				<Button type="button" variant="outline" onClick={onCancel}>
					Cancelar
				</Button>
				<Button type="submit" disabled={!isDirty || updateCompany.isPending}>
					<Save aria-hidden="true" className="size-5" />
					Salvar alterações
				</Button>
			</div>
		</form>
	);
}
