import { z } from "zod";
import { storeValidation } from "@/constants/store";
import { CompanyStatus } from "@/types/company";

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

const publicUrlSchema = z
	.url("Informe uma URL de imagem válida")
	.refine(
		(value) => new URL(value).protocol === "https:",
		"A imagem deve usar HTTPS",
	);

const optionalUrlSchema = z
	.union([z.literal(""), publicUrlSchema])
	.transform((value) => value || undefined);

const optionalStatusSchema = z
	.union([z.literal(""), z.enum(CompanyStatus)])
	.transform((value) => value || undefined);

const optionalTextSchema = (minimumLength: number, message: string) =>
	z
		.string()
		.trim()
		.refine((value) => !value || value.length >= minimumLength, message)
		.transform((value) => value || undefined);

const optionalCoordinateSchema = (
	minimum: number,
	maximum: number,
	message: string,
) =>
	z
		.union([
			z.literal(""),
			z.coerce.number(message).min(minimum, message).max(maximum, message),
		])
		.transform((value) => (value === "" ? undefined : value));

const storeHoursSchema = z
	.object({
		mondayToSaturday: z
			.string()
			.trim()
			.max(100, "O horário pode ter no máximo 100 caracteres"),
		sundaysAndHolidays: z
			.string()
			.trim()
			.max(100, "O horário pode ter no máximo 100 caracteres"),
	})
	.superRefine((hours, context) => {
		if (!hours.sundaysAndHolidays || hours.mondayToSaturday) return;
		context.addIssue({
			code: "custom",
			path: ["mondayToSaturday"],
			message: "Informe o horário de segunda a sábado",
		});
	})
	.transform((hours) => {
		if (!hours.mondayToSaturday && !hours.sundaysAndHolidays) return undefined;

		return {
			mondayToSaturday: hours.mondayToSaturday,
			...(hours.sundaysAndHolidays
				? { sundaysAndHolidays: hours.sundaysAndHolidays }
				: {}),
		};
	});

const companyFieldsSchema = z.object({
	address: z.string().trim().min(5, "Informe o endereço da loja"),
	parentId: parentIdSchema.transform((value) => value || undefined),
	name: z.string().trim().min(3, "Informe o nome da loja"),
	cnpj: cnpjSchema,
	description: z
		.string()
		.trim()
		.max(
			storeValidation.maximumDescriptionLength,
			"A descrição pode ter no máximo 500 caracteres",
		)
		.transform((value) => value || undefined),
});

const profileSchema = {
	bannerUrl: optionalUrlSchema,
	status: optionalStatusSchema,
	manager: optionalTextSchema(3, "Informe o gerente da loja"),
	phone: z
		.string()
		.trim()
		.refine(
			(value) => !value || value.replace(/\D/g, "").length >= 10,
			"Informe um telefone válido",
		)
		.transform((value) => value || undefined),
	email: z
		.union([z.literal(""), z.email("Informe um e-mail válido")])
		.transform((value) => value || undefined),
	area: z
		.union([
			z.literal(""),
			z.coerce
				.number("Informe a área da loja")
				.positive("A área deve ser maior que zero"),
		])
		.transform((value) => (value === "" ? undefined : value)),
	storeHours: storeHoursSchema,
	latitude: optionalCoordinateSchema(-90, 90, "Informe uma latitude válida"),
	longitude: optionalCoordinateSchema(
		-180,
		180,
		"Informe uma longitude válida",
	),
};

export const companySchema = companyFieldsSchema;
export type CompanyFormInputs = z.input<typeof companySchema>;
export type CompanyFields = z.output<typeof companySchema>;

export const updateCompanySchema = companyFieldsSchema.extend({
	parentId: parentIdSchema.transform((value) => value || null),
	description: z
		.string()
		.trim()
		.max(
			storeValidation.maximumDescriptionLength,
			"A descrição pode ter no máximo 500 caracteres",
		)
		.transform((value) => value || null),
	...profileSchema,
});

export type UpdateCompanyFormInputs = z.input<typeof updateCompanySchema>;
export type UpdateCompanyFields = z.output<typeof updateCompanySchema>;

export const storeBannerSchema = z.object({ bannerUrl: publicUrlSchema });
export type StoreBannerFields = z.output<typeof storeBannerSchema>;
export type StoreBannerFormInputs = z.input<typeof storeBannerSchema>;
