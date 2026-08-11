import { z } from "zod";

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
