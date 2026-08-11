"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FormField, inputBorderClass } from "@/components/ui/form-field";
import {
	type UpdateStoreFields,
	type UpdateStoreFormInputs,
	updateStoreSchema,
} from "@/schemas/store";
import { useStoresStore } from "@/store/stores-store";
import type { StoreListItem } from "@/types/store";

type EditStoreFormProps = {
	store: StoreListItem;
	onCancel: () => void;
	onSave: () => void;
};

const inputClass = (hasError: boolean) =>
	`h-[var(--control-height-input)] w-full rounded-[var(--radius-control)] border-[1.5px] bg-background px-3.5 text-[15px] text-foreground outline-none transition-colors placeholder:text-placeholder focus:border-primary ${inputBorderClass(hasError)}`;

export function EditStoreForm({ store, onCancel, onSave }: EditStoreFormProps) {
	const updateStore = useStoresStore((state) => state.updateStore);
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
		},
		reValidateMode: "onChange",
	});

	function submitStore(fields: UpdateStoreFields) {
		updateStore(store.id, fields);
		toast.success("Informações da loja atualizadas.");
		onSave();
	}

	return (
		<form onSubmit={handleSubmit(submitStore)} noValidate className="mt-7">
			<div className="grid gap-5 md:grid-cols-2">
				<FormField
					label="ID da empresa matriz"
					inputId="edit-store-parent-id"
					error={errors.parentId?.message}
					hint="Opcional. Deixe vazio para remover o vínculo."
				>
					<input
						{...register("parentId")}
						id="edit-store-parent-id"
						placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
						className={inputClass(Boolean(errors.parentId))}
						aria-invalid={Boolean(errors.parentId)}
					/>
				</FormField>
				<FormField
					label="Nome da loja"
					inputId="edit-store-name"
					error={errors.name?.message}
				>
					<input
						{...register("name")}
						id="edit-store-name"
						className={inputClass(Boolean(errors.name))}
						aria-invalid={Boolean(errors.name)}
					/>
				</FormField>
				<FormField
					label="Endereço"
					inputId="edit-store-address"
					error={errors.address?.message}
				>
					<input
						{...register("address")}
						id="edit-store-address"
						className={inputClass(Boolean(errors.address))}
						aria-invalid={Boolean(errors.address)}
					/>
				</FormField>
				<FormField
					label="CNPJ"
					inputId="edit-store-cnpj"
					error={errors.cnpj?.message}
					hint="Opcional. Deixe vazio para manter o valor atual."
				>
					<input
						{...register("cnpj")}
						id="edit-store-cnpj"
						inputMode="numeric"
						placeholder="00.000.000/0000-00"
						className={inputClass(Boolean(errors.cnpj))}
						aria-invalid={Boolean(errors.cnpj)}
					/>
				</FormField>
			</div>
			<div className="mt-5">
				<FormField
					label="Descrição"
					inputId="edit-store-description"
					error={errors.description?.message}
					hint="Opcional. Deixe vazio para remover a descrição."
				>
					<textarea
						{...register("description")}
						id="edit-store-description"
						className={`min-h-28 w-full resize-y rounded-[var(--radius-control)] border-[1.5px] bg-background px-3.5 py-3 text-[15px] text-foreground outline-none transition-colors placeholder:text-placeholder focus:border-primary ${inputBorderClass(Boolean(errors.description))}`}
						aria-invalid={Boolean(errors.description)}
					/>
				</FormField>
			</div>
			<div className="mt-6 flex justify-end gap-3 border-t border-border pt-6">
				<Button type="button" variant="outline" onClick={onCancel}>
					Cancelar
				</Button>
				<Button type="submit" disabled={!isDirty}>
					<Save aria-hidden="true" className="size-5" />
					Salvar alterações
				</Button>
			</div>
		</form>
	);
}
