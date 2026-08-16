"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { StoreBasicFormFields } from "@/components/stores/forms/store-basic-form-fields";
import { Button } from "@/components/ui/button";
import { useCreateCompanyMutation } from "@/hooks/use-companies-query";
import {
	type CompanyFields,
	type CompanyFormInputs,
	companySchema,
} from "@/schemas/company";

type AddStoreFormProps = {
	onSuccess: () => void;
};

export function AddStoreForm({ onSuccess }: AddStoreFormProps) {
	const createCompany = useCreateCompanyMutation();
	const {
		register,
		setValue,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<CompanyFormInputs, undefined, CompanyFields>({
		resolver: zodResolver(companySchema),
		defaultValues: {
			parentId: "",
			name: "",
			address: "",
			cnpj: "",
			description: "",
		},
		reValidateMode: "onChange",
	});

	async function submitStore(fields: CompanyFields) {
		try {
			await createCompany.mutateAsync(fields);
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
				onParentCompanyIdChange={(companyId) =>
					setValue("parentId", companyId, {
						shouldDirty: true,
						shouldValidate: true,
					})
				}
			/>
			<div className="mt-6 flex justify-end border-t border-border pt-6">
				<Button type="submit" disabled={createCompany.isPending}>
					<Plus aria-hidden="true" className="size-5" />
					Adicionar loja
				</Button>
			</div>
		</form>
	);
}
