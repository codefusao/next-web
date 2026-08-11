"use client";

import { Boxes } from "lucide-react";
import { useProductStore } from "@/store/product-store";

export function AddedProductsSection() {
	const products = useProductStore((state) => state.products);

	return (
		<section className="mt-8" aria-labelledby="local-products-title">
			<div className="mb-4 flex items-end justify-between gap-4">
				<div>
					<h2 id="local-products-title" className="text-xl font-bold">
						Produtos adicionados
					</h2>
					<p className="mt-1 text-sm text-muted">
						Lista local desta sessão. Ela será substituída pela integração com o
						servidor.
					</p>
				</div>
				<span className="rounded-full bg-card px-3 py-1 text-sm font-bold text-muted">
					{products.length}
				</span>
			</div>
			{products.length === 0 ? (
				<div className="rounded-[var(--radius-card)] border border-dashed border-border bg-card px-6 py-12 text-center">
					<Boxes
						aria-hidden="true"
						className="mx-auto mb-3 size-9 text-muted"
					/>
					<p className="font-semibold">Nenhum produto adicionado</p>
					<p className="mt-1 text-sm text-muted">
						Os produtos criados aparecerão aqui.
					</p>
				</div>
			) : (
				<div className="overflow-x-auto rounded-[var(--radius-card)] border border-border bg-card">
					<table className="min-w-full text-left text-sm">
						<thead className="border-b border-border bg-background text-xs uppercase tracking-wide text-muted">
							<tr>
								<th className="px-4 py-3 font-semibold">Código</th>
								<th className="px-4 py-3 font-semibold">Produto</th>
								<th className="px-4 py-3 font-semibold">Categoria</th>
								<th className="px-4 py-3 font-semibold">Preços e condições</th>
							</tr>
						</thead>
						<tbody>
							{products.map((product) => (
								<tr
									key={product.id}
									className="border-b border-border last:border-0"
								>
									<td className="whitespace-nowrap px-4 py-4 font-semibold">
										{product.codigo}
									</td>
									<td className="min-w-56 px-4 py-4 font-medium">
										{product.nome}
									</td>
									<td className="whitespace-nowrap px-4 py-4 text-muted">
										{product.categoria.label}
									</td>
									<td className="min-w-72 px-4 py-4 text-muted">
										{product.precos_e_condicoes.join(" · ")}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</section>
	);
}
