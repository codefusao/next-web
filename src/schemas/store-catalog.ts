import { z } from "zod";

const mapCoordinateSchema = z
	.number("Selecione uma posição válida no mapa")
	.min(0, "A posição deve estar dentro do mapa")
	.max(100, "A posição deve estar dentro do mapa");

const storeCatalogLocationBaseSchema = z.object({
	x: mapCoordinateSchema,
	y: mapCoordinateSchema,
	departmentId: z.string().uuid("Selecione um departamento"),
	aisle: z.string().trim().min(1, "Informe o corredor"),
	shelf: z.string().trim().min(1, "Informe a prateleira"),
	module: z.string().trim().min(1, "Informe o módulo"),
	level: z.string().trim().min(1, "Informe o nível"),
});

export const storeCatalogLocationSchema = storeCatalogLocationBaseSchema;

export type StoreCatalogLocationFields = z.infer<
	typeof storeCatalogLocationSchema
>;
