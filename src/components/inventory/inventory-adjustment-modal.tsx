"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormField, formControlClass } from "@/components/ui/form-field";
import { Modal } from "@/components/ui/modal";
import {
	type InventoryAdjustmentFields,
	inventoryAdjustmentSchema,
} from "@/schemas/inventory";
import type { InventoryItem } from "@/types/inventory";

type InventoryAdjustmentModalProps = {
	item: InventoryItem;
	onClose: () => void;
	onSave: (quantity: number) => void;
};

export function InventoryAdjustmentModal({
	item,
	onClose,
	onSave,
}: InventoryAdjustmentModalProps) {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<InventoryAdjustmentFields>({
		resolver: zodResolver(inventoryAdjustmentSchema),
		defaultValues: { quantity: item.quantity },
		reValidateMode: "onChange",
	});

	function submitAdjustment(fields: InventoryAdjustmentFields) {
		onSave(fields.quantity);
	}

	const hasQuantityError = Boolean(errors.quantity);

	return (
		<Modal
			title="Ajustar estoque"
			description={item.nome}
			closeLabel="Fechar ajuste de estoque"
			onClose={onClose}
		>
			<form
				onSubmit={handleSubmit(submitAdjustment)}
				noValidate
				className="mt-6"
			>
				<FormField
					label="Quantidade disponível"
					inputId="inventory-quantity"
					error={errors.quantity?.message}
				>
					<input
						{...register("quantity", { valueAsNumber: true })}
						id="inventory-quantity"
						type="number"
						min="0"
						step="1"
						inputMode="numeric"
						aria-invalid={hasQuantityError}
						className={formControlClass({ hasError: hasQuantityError })}
					/>
				</FormField>
				<div className="mt-6 flex justify-end gap-3">
					<Button type="button" variant="outline" onClick={onClose}>
						Cancelar
					</Button>
					<Button type="submit">Salvar quantidade</Button>
				</div>
			</form>
		</Modal>
	);
}
