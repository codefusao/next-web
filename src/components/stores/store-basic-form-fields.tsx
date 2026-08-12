import type {
	FieldErrors,
	FieldValues,
	Path,
	UseFormRegister,
} from "react-hook-form";
import { FormField, formControlClass } from "@/components/ui/form-field";
import type { StoreFormInputs } from "@/schemas/store";

type StoreBasicFormInputs = Pick<
	StoreFormInputs,
	"parentId" | "name" | "address" | "cnpj" | "description"
>;

type StoreBasicFormFieldsProps<T extends FieldValues> = {
	register: UseFormRegister<T>;
	errors: FieldErrors<T>;
	mode: "create" | "edit";
	idPrefix: string;
};

function fieldName<T extends FieldValues>(name: keyof StoreBasicFormInputs) {
	return name as Path<T>;
}

export function StoreBasicFormFields<T extends FieldValues>({
	register,
	errors,
	mode,
	idPrefix,
}: StoreBasicFormFieldsProps<T>) {
	const fieldErrors = errors as FieldErrors<StoreBasicFormInputs>;
	const isEdit = mode === "edit";
	const id = (name: keyof StoreBasicFormInputs) => `${idPrefix}-${name}`;

	return (
		<>
			<div className="grid gap-5 md:grid-cols-2">
				<FormField
					label="ID da empresa matriz"
					inputId={id("parentId")}
					error={fieldErrors.parentId?.message}
					hint={
						isEdit
							? "Opcional. Deixe vazio para remover o vínculo."
							: "Opcional. Informe o UUID da empresa matriz."
					}
				>
					<input
						{...register(fieldName<T>("parentId"))}
						id={id("parentId")}
						placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
						className={formControlClass({
							hasError: Boolean(fieldErrors.parentId),
						})}
						aria-invalid={Boolean(fieldErrors.parentId)}
					/>
				</FormField>
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
				<FormField
					label="Endereço"
					inputId={id("address")}
					error={fieldErrors.address?.message}
				>
					<input
						{...register(fieldName<T>("address"))}
						id={id("address")}
						placeholder="Ex.: Av. Exemplo, 1000 - Centro"
						className={formControlClass({
							hasError: Boolean(fieldErrors.address),
						})}
						aria-invalid={Boolean(fieldErrors.address)}
					/>
				</FormField>
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
