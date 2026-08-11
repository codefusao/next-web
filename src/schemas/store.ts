import { z } from "zod";

const addressSchema = z.string().trim().min(5, "Informe o endereço da loja");

export const storeSchema = z.object({
	parentId: z
		.string()
		.trim()
		.refine(
			(value) => !value || z.uuid().safeParse(value).success,
			"Informe um UUID válido",
		)
		.transform((value) => value || undefined),
	name: z.string().trim().min(3, "Informe o nome da loja"),
	address: addressSchema,
	cnpj: z
		.string()
		.trim()
		.transform((value) => value.replace(/\D/g, ""))
		.refine((value) => value.length === 14, "O CNPJ deve conter 14 dígitos"),
	description: z
		.string()
		.trim()
		.max(500, "A descrição pode ter no máximo 500 caracteres")
		.transform((value) => value || undefined),
});

export type StoreFormInputs = z.input<typeof storeSchema>;
export type StoreFields = z.output<typeof storeSchema>;

export const updateStoreSchema = z.object({
	parentId: z
		.string()
		.trim()
		.refine(
			(value) => !value || z.uuid().safeParse(value).success,
			"Informe um UUID válido",
		)
		.transform((value) => value || null),
	name: z.string().trim().min(3, "Informe o nome da loja"),
	address: addressSchema,
	cnpj: z
		.string()
		.trim()
		.transform((value) => value.replace(/\D/g, "") || undefined)
		.refine(
			(value) => value === undefined || value.length === 14,
			"O CNPJ deve conter 14 dígitos",
		),
	description: z
		.string()
		.trim()
		.max(500, "A descrição pode ter no máximo 500 caracteres")
		.transform((value) => value || null),
});

export type UpdateStoreFormInputs = z.input<typeof updateStoreSchema>;
export type UpdateStoreFields = z.output<typeof updateStoreSchema>;
