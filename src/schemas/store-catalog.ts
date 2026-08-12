import { z } from "zod";

const mapCoordinateSchema = z
	.number("Selecione uma posição válida no mapa")
	.min(0, "A posição deve estar dentro do mapa")
	.max(100, "A posição deve estar dentro do mapa");

export const storeCatalogLocationSchema = z.object({
	x: mapCoordinateSchema,
	y: mapCoordinateSchema,
	description: z.string().trim().min(3, "Informe a descrição da localização"),
});

export type StoreCatalogLocationFields = z.infer<
	typeof storeCatalogLocationSchema
>;
