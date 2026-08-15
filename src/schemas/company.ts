import { z } from "zod";
import { storeValidation } from "@/constants/store";

const parentIdSchema = z
	.string()
	.trim()
	.refine(
		(value) => !value || z.uuid().safeParse(value).success,
		"Informe um UUID válido",
	);

const cnpjSchema = z
	.string()
	.trim()
	.transform((value) => value.replace(/\D/g, ""))
	.refine(
		(value) => value.length === storeValidation.cnpjDigits,
		"O CNPJ deve conter 14 dígitos",
	);

const descriptionSchema = z
	.string()
	.trim()
	.max(
		storeValidation.maximumDescriptionLength,
		"A descrição pode ter no máximo 500 caracteres",
	);

export const companySchema = z.object({
	parentId: parentIdSchema.transform((value) => value || undefined),
	name: z.string().trim().min(3, "Informe o nome da loja"),
	cnpj: cnpjSchema,
	description: descriptionSchema.transform((value) => value || undefined),
});

export type CompanyFormInputs = z.input<typeof companySchema>;
export type CompanyFields = z.output<typeof companySchema>;

export const updateCompanySchema = z.object({
	parentId: parentIdSchema.transform((value) => value || null),
	name: z.string().trim().min(3, "Informe o nome da loja"),
	cnpj: z
		.string()
		.trim()
		.transform((value) => value.replace(/\D/g, "") || undefined)
		.refine(
			(value) =>
				value === undefined || value.length === storeValidation.cnpjDigits,
			"O CNPJ deve conter 14 dígitos",
		),
	description: descriptionSchema.transform((value) => value || null),
});

export type UpdateCompanyFormInputs = z.input<typeof updateCompanySchema>;
export type UpdateCompanyFields = z.output<typeof updateCompanySchema>;
