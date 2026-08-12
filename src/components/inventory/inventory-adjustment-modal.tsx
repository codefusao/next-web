"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PackageCheck, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormField, inputBorderClass } from "@/components/ui/form-field";
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
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
			role="presentation"
		>
			<section
				className="w-full max-w-md rounded-[var(--radius-card)] border border-border bg-card p-6 shadow-xl"
				role="dialog"
				aria-modal="true"
				aria-labelledby="inventory-adjustment-title"
			>
				<div className="flex items-start justify-between gap-4">
					<div>
						<span className="inline-flex rounded-lg bg-primary/10 p-2 text-primary">
							<PackageCheck aria-hidden="true" className="size-5" />
						</span>
						<h2
							id="inventory-adjustment-title"
							className="mt-3 text-xl font-bold"
						>
							Ajustar estoque
						</h2>
						<p className="mt-1 text-sm leading-6 text-muted">{item.nome}</p>
					</div>
					<Button
						type="button"
						variant="ghost"
						size="icon-sm"
						onClick={onClose}
						aria-label="Fechar ajuste de estoque"
					>
						<X aria-hidden="true" className="size-5" />
					</Button>
				</div>
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
							className={`h-[var(--control-height-input)] w-full rounded-[var(--radius-control)] border-[1.5px] bg-background px-3.5 text-[15px] text-foreground outline-none transition-colors focus:border-primary ${inputBorderClass(hasQuantityError)}`}
						/>
					</FormField>
					<div className="mt-6 flex justify-end gap-3">
						<Button type="button" variant="outline" onClick={onClose}>
							Cancelar
						</Button>
						<Button type="submit">Salvar quantidade</Button>
					</div>
				</form>
			</section>
		</div>
	);
}
