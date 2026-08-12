import type {
	FieldErrors,
	FieldValues,
	Path,
	UseFormRegister,
} from "react-hook-form";
import { FormField, formControlClass } from "@/components/ui/form-field";
import { storeStatusLabels, storeTypeLabels } from "@/constants/store";
import type { StoreFormInputs } from "@/schemas/store";
import { StoreStatus, StoreType } from "@/types/store";

type StoreMetadataFormFieldsProps<T extends FieldValues> = {
	register: UseFormRegister<T>;
	errors: FieldErrors<T>;
};

type StoreMetadataFormInputs = Pick<
	StoreFormInputs,
	"status" | "type" | "manager" | "phone" | "email" | "area" | "bannerUrl"
>;

function inputClass(hasError: boolean) {
	return formControlClass({ hasError });
}

function fieldName<T extends FieldValues>(name: keyof StoreMetadataFormInputs) {
	return name as Path<T>;
}

export function StoreMetadataFormFields<T extends FieldValues>({
	register,
	errors,
}: StoreMetadataFormFieldsProps<T>) {
	const metadataErrors = errors as FieldErrors<StoreMetadataFormInputs>;

	return (
		<>
			<div className="my-7 border-t border-border" />
			<div className="mb-4">
				<h3 className="font-bold text-foreground">Dados da operação</h3>
				<p className="mt-1 text-sm text-muted">
					Essas informações aparecem no resumo da loja.
				</p>
			</div>
			<div className="grid gap-5 md:grid-cols-2">
				<FormField
					label="Status"
					inputId="store-status"
					error={metadataErrors.status?.message}
				>
					<select
						{...register(fieldName<T>("status"))}
						id="store-status"
						className={inputClass(Boolean(metadataErrors.status))}
						aria-invalid={Boolean(metadataErrors.status)}
					>
						{Object.values(StoreStatus).map((status) => (
							<option key={status} value={status}>
								{storeStatusLabels[status]}
							</option>
						))}
					</select>
				</FormField>
				<FormField
					label="Tipo de loja"
					inputId="store-type"
					error={metadataErrors.type?.message}
				>
					<select
						{...register(fieldName<T>("type"))}
						id="store-type"
						className={inputClass(Boolean(metadataErrors.type))}
						aria-invalid={Boolean(metadataErrors.type)}
					>
						{Object.values(StoreType).map((type) => (
							<option key={type} value={type}>
								{storeTypeLabels[type]}
							</option>
						))}
					</select>
				</FormField>
				<FormField
					label="Gerente"
					inputId="store-manager"
					error={metadataErrors.manager?.message}
				>
					<input
						{...register(fieldName<T>("manager"))}
						id="store-manager"
						className={inputClass(Boolean(metadataErrors.manager))}
						aria-invalid={Boolean(metadataErrors.manager)}
					/>
				</FormField>
				<FormField
					label="Telefone"
					inputId="store-phone"
					error={metadataErrors.phone?.message}
				>
					<input
						{...register(fieldName<T>("phone"))}
						id="store-phone"
						inputMode="tel"
						className={inputClass(Boolean(metadataErrors.phone))}
						aria-invalid={Boolean(metadataErrors.phone)}
					/>
				</FormField>
				<FormField
					label="E-mail"
					inputId="store-email"
					error={metadataErrors.email?.message}
				>
					<input
						{...register(fieldName<T>("email"))}
						id="store-email"
						type="email"
						className={inputClass(Boolean(metadataErrors.email))}
						aria-invalid={Boolean(metadataErrors.email)}
					/>
				</FormField>
				<FormField
					label="Área da loja (m²)"
					inputId="store-area"
					error={metadataErrors.area?.message}
				>
					<input
						{...register(fieldName<T>("area"))}
						id="store-area"
						inputMode="decimal"
						className={inputClass(Boolean(metadataErrors.area))}
						aria-invalid={Boolean(metadataErrors.area)}
					/>
				</FormField>
			</div>
			<div className="mt-5">
				<FormField
					label="URL do banner da loja"
					inputId="store-banner-url"
					error={metadataErrors.bannerUrl?.message}
				>
					<input
						{...register(fieldName<T>("bannerUrl"))}
						id="store-banner-url"
						type="url"
						placeholder="https://..."
						className={inputClass(Boolean(metadataErrors.bannerUrl))}
						aria-invalid={Boolean(metadataErrors.bannerUrl)}
					/>
				</FormField>
			</div>
		</>
	);
}
