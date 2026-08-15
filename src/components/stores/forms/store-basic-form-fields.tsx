import type {
	FieldErrors,
	FieldValues,
	Path,
	UseFormRegister,
} from "react-hook-form";
import { CompanyParentSearch } from "@/components/stores/forms/company-parent-search";
import { FormField, formControlClass } from "@/components/ui/form-field";
import type { CompanyFormInputs } from "@/schemas/company";

type CompanyFormFieldInputs = CompanyFormInputs;

type StoreBasicFormFieldsProps<T extends FieldValues> = {
	register: UseFormRegister<T>;
	errors: FieldErrors<T>;
	mode: "create" | "edit";
	idPrefix: string;
	companyId?: string;
	onParentCompanyIdChange: (companyId: string) => void;
};

function fieldName<T extends FieldValues>(name: keyof CompanyFormFieldInputs) {
	return name as Path<T>;
}

export function StoreBasicFormFields<T extends FieldValues>({
	register,
	errors,
	mode,
	idPrefix,
	companyId,
	onParentCompanyIdChange,
}: StoreBasicFormFieldsProps<T>) {
	const fieldErrors = errors as FieldErrors<CompanyFormFieldInputs>;
	const isEdit = mode === "edit";
	const id = (name: keyof CompanyFormFieldInputs) => `${idPrefix}-${name}`;

	return (
		<>
			<div className="grid gap-5 md:grid-cols-2">
				<FormField
					label="Nome da loja"
					inputId={id("name")}
					error={fieldErrors.name?.message}
				>
					<input
						{...register(fieldName<T>("name"))}
						id={id("name")}
						placeholder="Ex.: Leroy Merlin Centro"
						className={formControlClass({
							hasError: Boolean(fieldErrors.name),
						})}
						aria-invalid={Boolean(fieldErrors.name)}
					/>
				</FormField>
				<CompanyParentSearch
					companyId={companyId}
					error={fieldErrors.parentId?.message}
					inputId={id("parentId")}
					onSelectedCompanyIdChange={onParentCompanyIdChange}
				/>
				<FormField
					label="CNPJ"
					inputId={id("cnpj")}
					error={fieldErrors.cnpj?.message}
					hint={
						isEdit
							? "Opcional. Deixe vazio para manter o valor atual."
							: undefined
					}
				>
					<input
						{...register(fieldName<T>("cnpj"))}
						id={id("cnpj")}
						inputMode="numeric"
						placeholder="00.000.000/0000-00"
						className={formControlClass({
							hasError: Boolean(fieldErrors.cnpj),
						})}
						aria-invalid={Boolean(fieldErrors.cnpj)}
					/>
				</FormField>
			</div>
			<div className="mt-5">
				<FormField
					label="Descrição"
					inputId={id("description")}
					error={fieldErrors.description?.message}
					hint={
						isEdit
							? "Opcional. Deixe vazio para remover a descrição."
							: "Opcional. Máximo de 500 caracteres."
					}
				>
					<textarea
						{...register(fieldName<T>("description"))}
						id={id("description")}
						placeholder={isEdit ? undefined : "Descreva a unidade."}
						className={formControlClass({
							kind: "textarea",
							hasError: Boolean(fieldErrors.description),
						})}
						aria-invalid={Boolean(fieldErrors.description)}
					/>
				</FormField>
			</div>
		</>
	);
}
