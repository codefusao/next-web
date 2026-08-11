"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Store } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FormField, inputBorderClass } from "@/components/ui/form-field";
import {
	type StoreFields,
	type StoreFormInputs,
	storeSchema,
} from "@/schemas/store";
import { useStoresStore } from "@/store/stores-store";

const inputClass = (hasError: boolean) =>
	`h-[var(--control-height-input)] w-full rounded-[var(--radius-control)] border-[1.5px] bg-background px-3.5 text-[15px] text-foreground outline-none transition-colors placeholder:text-placeholder focus:border-primary ${inputBorderClass(hasError)}`;

export function AddStoreForm() {
	const addStore = useStoresStore((state) => state.addStore);
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<StoreFormInputs, undefined, StoreFields>({
		resolver: zodResolver(storeSchema),
		defaultValues: { parentId: "", name: "", cnpj: "", description: "" },
		reValidateMode: "onChange",
	});

	function submitStore(fields: StoreFields) {
		addStore(fields);
		reset();
		toast.success("Loja adicionada à lista local.");
	}

	return (
		<section
			className="mb-8 rounded-[var(--radius-card)] border border-border bg-card p-5 shadow-sm sm:p-7"
			aria-labelledby="add-store-title"
		>
			<div className="mb-5 flex items-center gap-3">
				<span className="rounded-lg bg-primary/10 p-2 text-primary">
					<Store aria-hidden="true" className="size-5" />
				</span>
				<div>
					<h2 id="add-store-title" className="font-bold">
						Adicionar loja
					</h2>
					<p className="text-sm text-muted">
						Inclua uma unidade na lista local.
					</p>
				</div>
			</div>
			<form onSubmit={handleSubmit(submitStore)} noValidate>
				<div className="grid gap-5 md:grid-cols-2">
					<FormField
						label="ID da empresa matriz"
						inputId="store-parent-id"
						error={errors.parentId?.message}
						hint="Opcional. Informe o UUID da empresa matriz."
					>
						<input
							{...register("parentId")}
							id="store-parent-id"
							placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
							className={inputClass(Boolean(errors.parentId))}
							aria-invalid={Boolean(errors.parentId)}
						/>
					</FormField>
					<FormField
						label="Nome da loja"
						inputId="store-name"
						error={errors.name?.message}
					>
						<input
							{...register("name")}
							id="store-name"
							placeholder="Ex.: Leroy Merlin Centro"
							className={inputClass(Boolean(errors.name))}
							aria-invalid={Boolean(errors.name)}
						/>
					</FormField>
					<FormField
						label="CNPJ"
						inputId="store-cnpj"
						error={errors.cnpj?.message}
					>
						<input
							{...register("cnpj")}
							id="store-cnpj"
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
						inputId="store-description"
						error={errors.description?.message}
						hint="Opcional. Máximo de 500 caracteres."
					>
						<textarea
							{...register("description")}
							id="store-description"
							placeholder="Descreva a unidade."
							className={`min-h-28 w-full resize-y rounded-[var(--radius-control)] border-[1.5px] bg-background px-3.5 py-3 text-[15px] text-foreground outline-none transition-colors placeholder:text-placeholder focus:border-primary ${inputBorderClass(Boolean(errors.description))}`}
							aria-invalid={Boolean(errors.description)}
						/>
					</FormField>
				</div>
				<div className="mt-6 flex justify-end border-t border-border pt-6">
					<Button type="submit">
						<Plus aria-hidden="true" className="size-5" />
						Adicionar loja
					</Button>
				</div>
			</form>
		</section>
	);
}
