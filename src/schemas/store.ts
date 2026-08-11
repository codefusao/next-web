import { z } from "zod";

export const storeSchema = z.object({
	name: z.string().trim().min(3, "Informe o nome da loja"),
	address: z.string().trim().min(5, "Informe o endereço da loja"),
});

export type StoreFields = z.infer<typeof storeSchema>;
