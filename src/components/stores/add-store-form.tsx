"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { StoreBasicFormFields } from "@/components/stores/store-basic-form-fields";
import { StoreMetadataFormFields } from "@/components/stores/store-metadata-form-fields";
import { Button } from "@/components/ui/button";
import { defaultStoreMetadata } from "@/constants/store";
import {
	type StoreFields,
	type StoreFormInputs,
	storeSchema,
} from "@/schemas/store";
import { useStoresStore } from "@/store/stores-store";

type AddStoreFormProps = {
	onSuccess: () => void;
};

export function AddStoreForm({ onSuccess }: AddStoreFormProps) {
	const addStore = useStoresStore((state) => state.addStore);
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

	function submitStore(fields: StoreFields) {
		addStore(fields);
		reset();
		toast.success("Loja adicionada à lista local.");
		onSuccess();
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
				<Button type="submit">
					<Plus aria-hidden="true" className="size-5" />
					Adicionar loja
				</Button>
			</div>
		</form>
	);
}
