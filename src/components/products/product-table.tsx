"use client";

import { ChevronDown, ChevronUp, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { ProductThumbnail } from "@/components/products/product-thumbnail";
import { Button } from "@/components/ui/button";
import type { InventoryItem } from "@/types/inventory";
import type { Product } from "@/types/product";

type ProductTableProps =
	| {
			variant: "catalog";
			products: readonly Product[];
	  }
	| {
			variant: "inventory";
			products: readonly InventoryItem[];
			onAdjust: (item: InventoryItem, quantity: number) => Promise<void>;
			onHighlight: (item: InventoryItem) => void;
	  };

export function ProductTable(props: ProductTableProps) {
	const { products, variant } = props;

	return (
		<div className="overflow-x-auto rounded-[var(--radius-card)] border border-border bg-card">
			<table className="min-w-full text-left text-sm">
				<thead className="border-b border-border bg-background text-xs uppercase tracking-wide text-muted">
					<tr>
						<th className="px-4 py-3 font-semibold">Imagem</th>
						<th className="px-4 py-3 font-semibold">Produto</th>
						<th className="px-4 py-3 font-semibold">Categoria</th>
						<th className="px-4 py-3 font-semibold">
							{variant === "catalog" ? "Preços e condições" : "Quantidade"}
						</th>
						{variant === "inventory" ? (
							<th className="px-4 py-3 font-semibold">
								<span className="sr-only">Ações</span>
							</th>
						) : null}
					</tr>
				</thead>
				<tbody>
					{products.map((product) => (
						<tr
							key={product.id}
							className="border-b border-border last:border-0"
						>
							<td className="px-4 py-3">
								<ProductThumbnail
									source={product.image}
									productName={product.nome}
								/>
							</td>
							<td className="min-w-56 px-4 py-4 font-medium">{product.nome}</td>
							<td className="whitespace-nowrap px-4 py-4 text-muted">
								{product.categoria.label}
							</td>
							{variant === "catalog" ? (
								<td className="min-w-72 px-4 py-4 text-muted">
									{product.precos_e_condicoes.join(" · ")}
								</td>
							) : (
								<InventoryCells
									item={product as InventoryItem}
									onAdjust={props.onAdjust}
									onHighlight={props.onHighlight}
								/>
							)}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

function InventoryCells({
	item,
	onAdjust,
	onHighlight,
}: {
	item: InventoryItem;
	onAdjust: (item: InventoryItem, quantity: number) => Promise<void>;
	onHighlight: (item: InventoryItem) => void;
}) {
	return (
		<>
			<td className="whitespace-nowrap px-4 py-4">
				<EditableInventoryQuantity item={item} onSave={onAdjust} />
			</td>
			<td className="px-4 py-4">
				<div className="flex justify-end gap-2">
					<Button
						variant={item.highlight ? "primary" : "outline"}
						size="compact"
						onClick={() => onHighlight(item)}
						aria-label={item.highlight ? `Remover destaque de ${item.nome}` : `Destacar ${item.nome}`}
					>
						<Star aria-hidden="true" className={`size-4 ${item.highlight ? "fill-current" : ""}`} />
						{item.highlight ? "Destacado" : "Destacar"}
					</Button>
				</div>
			</td>
		</>
	);
}

function EditableInventoryQuantity({
	item,
	onSave,
}: {
	item: InventoryItem;
	onSave: (item: InventoryItem, quantity: number) => Promise<void>;
}) {
	const [value, setValue] = useState(String(item.quantity));
	const [isSaving, setIsSaving] = useState(false);

	useEffect(() => {
		if (!isSaving) setValue(String(item.quantity));
	}, [isSaving, item.quantity]);

	async function saveQuantity(nextValue = value) {
		const quantity = Number(nextValue);
		if (
			nextValue.trim() === "" ||
			!Number.isSafeInteger(quantity) ||
			quantity < 0
		) {
			setValue(String(item.quantity));
			return;
		}
		if (quantity === item.quantity) return;

		setIsSaving(true);
		try {
			await onSave(item, quantity);
		} catch {
			setValue(String(item.quantity));
		} finally {
			setIsSaving(false);
		}
	}

	function adjustQuantity(amount: number) {
		const currentQuantity = Number(value);
		const quantity =
			Number.isSafeInteger(currentQuantity) && currentQuantity >= 0
				? currentQuantity
				: item.quantity;
		const nextValue = String(Math.max(0, quantity + amount));
		setValue(nextValue);
		void saveQuantity(nextValue);
	}

	return (
		<div className="relative inline-flex">
			<input
				type="number"
				min="0"
				step="1"
				inputMode="numeric"
				value={value}
				disabled={isSaving}
				onChange={(event) => setValue(event.target.value)}
				onBlur={() => void saveQuantity()}
				onKeyDown={(event) => {
					if (event.key === "Enter") event.currentTarget.blur();
					if (event.key === "Escape") {
						setValue(String(item.quantity));
						event.currentTarget.blur();
					}
				}}
				aria-label={`Quantidade disponível de ${item.nome}`}
				className="w-20 appearance-none rounded-[var(--radius-sm)] border border-transparent bg-transparent px-1 py-1 pr-6 text-lg font-bold text-foreground outline-none transition-colors focus:border-primary focus:bg-background disabled:cursor-wait disabled:opacity-60 [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
			/>
			<div className="absolute inset-y-1 right-1 flex w-4 flex-col justify-center">
				<button
					type="button"
					disabled={isSaving}
					onPointerDown={(event) => event.preventDefault()}
					onClick={() => adjustQuantity(1)}
					aria-label={`Aumentar quantidade de ${item.nome}`}
					className="flex h-3 items-center justify-center rounded-sm text-muted transition-colors hover:bg-background hover:text-foreground disabled:cursor-wait disabled:opacity-60"
				>
					<ChevronUp aria-hidden="true" className="size-3" />
				</button>
				<button
					type="button"
					disabled={isSaving || Number(value) <= 0}
					onPointerDown={(event) => event.preventDefault()}
					onClick={() => adjustQuantity(-1)}
					aria-label={`Diminuir quantidade de ${item.nome}`}
					className="flex h-3 items-center justify-center rounded-sm text-muted transition-colors hover:bg-background hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
				>
					<ChevronDown aria-hidden="true" className="size-3" />
				</button>
			</div>
		</div>
	);
}
