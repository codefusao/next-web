"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import type { CatalogProductPickerItem } from "./product-picker-modal";

type SelectProductQuantityDialogProps = {
	product: CatalogProductPickerItem;
	onClose: () => void;
	onConfirm: (quantity: number) => void;
};

export function SelectProductQuantityDialog({
	product,
	onClose,
	onConfirm,
}: SelectProductQuantityDialogProps) {
	const availableQuantity = product.availableQuantity ?? 0;
	const schema = z.object({
		quantity: z
			.number("Informe a quantidade")
			.int("A quantidade deve ser um número inteiro")
			.min(1, "A quantidade deve ser maior que zero")
			.max(
				availableQuantity,
				`Há somente ${availableQuantity} unidade${availableQuantity === 1 ? "" : "s"} disponível${availableQuantity === 1 ? "" : "is"} no estoque`,
			),
	});
	const {
		handleSubmit,
		register,
		formState: { errors },
	} = useForm<{ quantity: number }>({
		resolver: zodResolver(schema),
		defaultValues: { quantity: 1 },
	});

	return (
		<Modal
			title="Definir quantidade"
			description={`Quantas unidades de ${product.nome} ficarão nesta localização?`}
			closeLabel="Fechar definição de quantidade"
			onClose={onClose}
		>
			<form
				onSubmit={handleSubmit(({ quantity }) => onConfirm(quantity))}
				noValidate
				className="mt-6"
			>
				<label className="block">
					<span className="text-sm font-bold text-foreground">Quantidade</span>
					<input
						{...register("quantity", { valueAsNumber: true })}
						type="number"
						min="1"
						max={availableQuantity}
						className="mt-2 h-[var(--control-height-input)] w-full rounded-[var(--radius-control)] border-[1.5px] border-border bg-background px-3.5 text-[15px] text-foreground outline-none transition-colors focus:border-primary"
					/>
					<p className="mt-2 text-xs text-muted">
						Disponível para alocar: {availableQuantity}
					</p>
					{errors.quantity?.message ? (
						<p
							role="alert"
							className="mt-2 text-sm font-medium text-destructive"
						>
							{errors.quantity.message}
						</p>
					) : null}
				</label>
				<div className="mt-6 flex justify-end gap-3">
					<Button type="button" variant="outline" onClick={onClose}>
						Cancelar
					</Button>
					<Button type="submit">
						<ArrowRight aria-hidden="true" className="size-4" />
						Definir localização
					</Button>
				</div>
			</form>
		</Modal>
	);
}
