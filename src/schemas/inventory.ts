import { z } from "zod";

export const inventoryAdjustmentSchema = z.object({
	quantity: z
		.number("Informe uma quantidade válida")
		.int("Informe uma quantidade inteira")
		.min(0, "A quantidade não pode ser negativa"),
});

export type InventoryAdjustmentFields = z.infer<
	typeof inventoryAdjustmentSchema
>;
