import { z } from "zod";
import { storeValidation } from "@/constants/store";
import { StoreStatus, StoreType } from "@/types/store";

const addressSchema = z.string().trim().min(5, "Informe o endereço da loja");
const phoneSchema = z
	.string()
	.trim()
	.refine(
		(value) =>
			value.replace(/\D/g, "").length >= storeValidation.minimumPhoneDigits,
		"Informe um telefone válido",
	);
const areaSchema = z.coerce
	.number("Informe a área da loja")
	.positive("A área deve ser maior que zero");
const bannerUrlSchema = z
	.url("Informe uma URL de imagem válida")
	.refine(
		(value) => new URL(value).protocol === "https:",
		"A imagem deve usar HTTPS",
	);
export const storeMapUploadSchema = z.object({
	storeMap: z
		.custom<File>(
			(value) => typeof File !== "undefined" && value instanceof File,
			"Selecione uma imagem do mapa",
		)
		.refine(
			(file) => storeValidation.acceptedMapTypes.includes(file.type as never),
			"Use uma imagem PNG, JPEG ou WebP",
		)
		.refine(
			(file) => file.size <= storeValidation.maximumMapFileSize,
			"A imagem deve ter no máximo 5 MB",
		),
});

export type StoreMapUploadFields = z.output<typeof storeMapUploadSchema>;
export type StoreMapUploadFormInputs = z.input<typeof storeMapUploadSchema>;

const storeMetadataSchema = {
	status: z.enum(StoreStatus),
	type: z.enum(StoreType),
	manager: z.string().trim().min(3, "Informe o gerente da loja"),
	phone: phoneSchema,
	email: z.email("Informe um e-mail válido").trim(),
	area: areaSchema,
};

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
		.refine(
			(value) => value.length === storeValidation.cnpjDigits,
			"O CNPJ deve conter 14 dígitos",
		),
	description: z
		.string()
		.trim()
		.max(
			storeValidation.maximumDescriptionLength,
			"A descrição pode ter no máximo 500 caracteres",
		)
		.transform((value) => value || undefined),
	bannerUrl: bannerUrlSchema,
	...storeMetadataSchema,
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
			(value) =>
				value === undefined || value.length === storeValidation.cnpjDigits,
			"O CNPJ deve conter 14 dígitos",
		),
	description: z
		.string()
		.trim()
		.max(
			storeValidation.maximumDescriptionLength,
			"A descrição pode ter no máximo 500 caracteres",
		)
		.transform((value) => value || null),
	bannerUrl: bannerUrlSchema,
	...storeMetadataSchema,
});

export type UpdateStoreFormInputs = z.input<typeof updateStoreSchema>;
export type UpdateStoreFields = z.output<typeof updateStoreSchema>;

export const storeBannerSchema = z.object({
	bannerUrl: bannerUrlSchema,
});

export type StoreBannerFields = z.output<typeof storeBannerSchema>;
export type StoreBannerFormInputs = z.input<typeof storeBannerSchema>;
