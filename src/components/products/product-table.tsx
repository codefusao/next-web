import { Pencil } from "lucide-react";
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
			onAdjust: (item: InventoryItem) => void;
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
}: {
	item: InventoryItem;
	onAdjust: (item: InventoryItem) => void;
}) {
	return (
		<>
			<td className="whitespace-nowrap px-4 py-4 text-lg font-bold text-foreground">
				{item.quantity}
			</td>
			<td className="px-4 py-4">
				<Button variant="outline" size="compact" onClick={() => onAdjust(item)}>
					<Pencil aria-hidden="true" className="size-4" />
					Ajustar
				</Button>
			</td>
		</>
	);
}
