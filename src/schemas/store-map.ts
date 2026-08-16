import { z } from "zod";

const publicUrlSchema = z
	.url("Informe uma URL de imagem válida")
	.refine(
		(value) => new URL(value).protocol === "https:",
		"A imagem deve usar HTTPS",
	);

export const storeMapUrlSchema = z.object({ imageUrl: publicUrlSchema });
export type StoreMapUrlFields = z.output<typeof storeMapUrlSchema>;
export type StoreMapUrlFormInputs = z.input<typeof storeMapUrlSchema>;
