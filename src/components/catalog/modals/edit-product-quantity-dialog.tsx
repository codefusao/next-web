"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import type { CatalogProduct } from "@/types/store-catalog";

type EditProductQuantityDialogProps = {
	product: CatalogProduct;
	onClose: () => void;
	onSave: (product: CatalogProduct, quantity: number) => Promise<void>;
};

export function EditProductQuantityDialog({
	product,
	onClose,
	onSave,
}: EditProductQuantityDialogProps) {
	const schema = z.object({
		quantity: z
			.number("Informe a quantidade")
			.int("A quantidade deve ser um número inteiro")
			.min(1, "A quantidade deve ser maior que zero")
			.max(
				product.maxQuantity,
				`Há somente ${product.maxQuantity} unidade${product.maxQuantity === 1 ? "" : "s"} disponível${product.maxQuantity === 1 ? "" : "is"} no estoque`,
			),
	});
	const {
		handleSubmit,
		register,
		formState: { errors, isSubmitting },
	} = useForm<{ quantity: number }>({
		resolver: zodResolver(schema),
		defaultValues: { quantity: product.quantity },
	});

	async function submit({ quantity }: { quantity: number }) {
		await onSave(product, quantity);
		onClose();
	}

	return (
		<Modal
			title="Alterar quantidade"
			description={`Defina quantas unidades de ${product.nome} ficam nesta localização.`}
			closeLabel="Fechar alteração de quantidade"
			onClose={onClose}
		>
			<form onSubmit={handleSubmit(submit)} noValidate className="mt-6">
				<label className="block">
					<span className="text-sm font-bold text-foreground">Quantidade</span>
					<input
						{...register("quantity", { valueAsNumber: true })}
						type="number"
						min="1"
						max={product.maxQuantity}
						className="mt-2 h-[var(--control-height-input)] w-full rounded-[var(--radius-control)] border-[1.5px] border-border bg-background px-3.5 text-[15px] text-foreground outline-none transition-colors focus:border-primary"
					/>
					<p className="mt-2 text-xs text-muted">
						Disponível para alocar: {product.maxQuantity}
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
					<Button type="submit" disabled={isSubmitting}>
						<Save aria-hidden="true" className="size-4" />
						Salvar quantidade
					</Button>
				</div>
			</form>
		</Modal>
	);
}
