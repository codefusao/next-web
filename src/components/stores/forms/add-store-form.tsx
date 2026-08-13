"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { defaultStoreMetadata } from "@/api/mock-data";
import { StoreBasicFormFields } from "@/components/stores/forms/store-basic-form-fields";
import { StoreMetadataFormFields } from "@/components/stores/forms/store-metadata-form-fields";
import { Button } from "@/components/ui/button";
import { useCreateStoreMutation } from "@/hooks/use-stores-query";
import {
	type StoreFields,
	type StoreFormInputs,
	storeSchema,
} from "@/schemas/store";

type AddStoreFormProps = {
	onSuccess: () => void;
};

export function AddStoreForm({ onSuccess }: AddStoreFormProps) {
	const createStore = useCreateStoreMutation();
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<StoreFormInputs, undefined, StoreFields>({
		resolver: zodResolver(storeSchema),
		defaultValues: {
			parentId: "",
			name: "",
			address: "",
			cnpj: "",
			description: "",
			...defaultStoreMetadata,
		},
		reValidateMode: "onChange",
	});

	async function submitStore(fields: StoreFields) {
		try {
			await createStore.mutateAsync(fields);
			reset();
			toast.success("Loja adicionada com sucesso.");
			onSuccess();
		} catch {
			toast.error("Não foi possível adicionar a loja.");
		}
	}

	return (
		<form onSubmit={handleSubmit(submitStore)} noValidate className="mt-6">
			<StoreBasicFormFields
				register={register}
				errors={errors}
				mode="create"
				idPrefix="store"
			/>
			<StoreMetadataFormFields register={register} errors={errors} />
			<div className="mt-6 flex justify-end border-t border-border pt-6">
				<Button type="submit" disabled={createStore.isPending}>
					<Plus aria-hidden="true" className="size-5" />
					Adicionar loja
				</Button>
			</div>
		</form>
	);
}
