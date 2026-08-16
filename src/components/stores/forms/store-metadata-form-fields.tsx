import type {
	FieldErrors,
	FieldValues,
	Path,
	UseFormRegister,
} from "react-hook-form";
import { FormField, formControlClass } from "@/components/ui/form-field";
import { storeStatusLabels } from "@/constants/store";
import { CompanyStatus } from "@/types/company";

type StoreMetadataFormFieldsProps<T extends FieldValues> = {
	register: UseFormRegister<T>;
	errors: FieldErrors<T>;
};

type StoreMetadataFormInputs = {
	status: CompanyStatus | "";
	manager: string;
	phone: string;
	email: string;
	area: number | "";
	bannerUrl: string;
	storeHours: {
		mondayToSaturday: string;
		sundaysAndHolidays: string;
	};
	latitude: number | "";
	longitude: number | "";
};

function inputClass(hasError: boolean) {
	return formControlClass({ hasError });
}

function fieldName<T extends FieldValues>(name: keyof StoreMetadataFormInputs) {
	return name as Path<T>;
}

function storeHoursFieldName<T extends FieldValues>(
	name: keyof StoreMetadataFormInputs["storeHours"],
) {
	return `storeHours.${name}` as Path<T>;
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
						<option value="">Não informado</option>
						{Object.values(CompanyStatus).map((status) => (
							<option key={status} value={status}>
								{storeStatusLabels[status]}
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
				<FormField
					label="Latitude"
					inputId="store-latitude"
					error={metadataErrors.latitude?.message}
				>
					<input
						{...register(fieldName<T>("latitude"))}
						id="store-latitude"
						type="number"
						step="any"
						placeholder="Ex.: -23.5505"
						className={inputClass(Boolean(metadataErrors.latitude))}
						aria-invalid={Boolean(metadataErrors.latitude)}
					/>
				</FormField>
				<FormField
					label="Longitude"
					inputId="store-longitude"
					error={metadataErrors.longitude?.message}
				>
					<input
						{...register(fieldName<T>("longitude"))}
						id="store-longitude"
						type="number"
						step="any"
						placeholder="Ex.: -46.6333"
						className={inputClass(Boolean(metadataErrors.longitude))}
						aria-invalid={Boolean(metadataErrors.longitude)}
					/>
				</FormField>
			</div>
			<div className="mt-5">
				<h4 className="text-sm font-semibold text-foreground">
					Horário de funcionamento
				</h4>
				<div className="mt-3 grid gap-5 md:grid-cols-2">
					<FormField
						label="Segunda a sábado"
						inputId="store-hours-monday-to-saturday"
						error={metadataErrors.storeHours?.mondayToSaturday?.message}
					>
						<input
							{...register(storeHoursFieldName<T>("mondayToSaturday"))}
							id="store-hours-monday-to-saturday"
							placeholder="Ex.: 08:00 às 22:00"
							className={inputClass(
								Boolean(metadataErrors.storeHours?.mondayToSaturday),
							)}
							aria-invalid={Boolean(
								metadataErrors.storeHours?.mondayToSaturday,
							)}
						/>
					</FormField>
					<FormField
						label="Domingos e feriados"
						inputId="store-hours-sundays-and-holidays"
						error={metadataErrors.storeHours?.sundaysAndHolidays?.message}
					>
						<input
							{...register(storeHoursFieldName<T>("sundaysAndHolidays"))}
							id="store-hours-sundays-and-holidays"
							placeholder="Ex.: 09:00 às 20:00"
							className={inputClass(
								Boolean(metadataErrors.storeHours?.sundaysAndHolidays),
							)}
							aria-invalid={Boolean(
								metadataErrors.storeHours?.sundaysAndHolidays,
							)}
						/>
					</FormField>
				</div>
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
