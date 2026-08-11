"use client";

import { Boxes, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { AddProductModal } from "@/components/products/add-product-modal";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { filterProducts } from "@/lib/filter-products";
import { useProductStore } from "@/store/product-store";

const itemsPerPage = 10;

function ProductThumbnail({
	source,
	productName,
}: {
	source: string | null;
	productName: string;
}) {
	const [hasError, setHasError] = useState(false);

	if (!source || hasError) {
		return (
			<div
				className="flex size-14 items-center justify-center rounded-[var(--radius-sm)] bg-background text-muted"
				role="img"
				aria-label={`Imagem indisponível para ${productName}`}
			>
				<Boxes aria-hidden="true" className="size-5" />
			</div>
		);
	}

	return (
		<Image
			src={source}
			alt={`Imagem de ${productName}`}
			width={56}
			height={56}
			className="size-14 rounded-[var(--radius-sm)] bg-background object-contain"
			onError={() => setHasError(true)}
		/>
	);
}

export function AddedProductsSection() {
	const products = useProductStore((state) => state.products);
	const [currentPage, setCurrentPage] = useState(1);
	const [query, setQuery] = useState("");
	const filteredProducts = filterProducts(products, query);
	const totalPages = Math.max(
		1,
		Math.ceil(filteredProducts.length / itemsPerPage),
	);
	const activePage = Math.min(currentPage, totalPages);
	const visibleProducts = filteredProducts.slice(
		(activePage - 1) * itemsPerPage,
		activePage * itemsPerPage,
	);

	function handleSearch(query: string) {
		setQuery(query);
		setCurrentPage(1);
	}

	return (
		<section aria-label="Lista de produtos">
			<div className="mb-4 flex items-start gap-3">
				<SearchInput
					query={query}
					onQueryChange={handleSearch}
					placeholder="Buscar por produto, código ou categoria"
					label="Buscar produtos"
					className="mb-0 flex-1"
				/>
				<AddProductModal />
			</div>
			{filteredProducts.length === 0 ? (
				<div className="rounded-[var(--radius-card)] border border-dashed border-border bg-card px-6 py-12 text-center">
					<Boxes
						aria-hidden="true"
						className="mx-auto mb-3 size-9 text-muted"
					/>
					<p className="font-semibold">Nenhum produto encontrado</p>
					<p className="mt-1 text-sm text-muted">
						Tente buscar por outro produto, código ou categoria.
					</p>
				</div>
			) : (
				<>
					<div className="overflow-x-auto rounded-[var(--radius-card)] border border-border bg-card">
						<table className="min-w-full text-left text-sm">
							<thead className="border-b border-border bg-background text-xs uppercase tracking-wide text-muted">
								<tr>
									<th className="px-4 py-3 font-semibold">Imagem</th>
									<th className="px-4 py-3 font-semibold">Código</th>
									<th className="px-4 py-3 font-semibold">Produto</th>
									<th className="px-4 py-3 font-semibold">Categoria</th>
									<th className="px-4 py-3 font-semibold">
										Preços e condições
									</th>
								</tr>
							</thead>
							<tbody>
								{visibleProducts.map((product) => (
									<tr
										key={product.id}
										className="border-b border-border last:border-0"
									>
										<td className="px-4 py-3">
											<ProductThumbnail
												source={product.imagem_thumb ?? product.imagem}
												productName={product.nome}
											/>
										</td>
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
					<nav
						className="mt-4 flex items-center justify-end gap-3"
						aria-label="Paginação de produtos"
					>
						<Button
							variant="outline"
							size="compact"
							onClick={() => setCurrentPage((page) => page - 1)}
							disabled={activePage === 1}
						>
							<ChevronLeft aria-hidden="true" className="size-4" />
							Anterior
						</Button>
						<span className="text-sm font-medium text-muted" aria-live="polite">
							Página {activePage} de {totalPages}
						</span>
						<Button
							variant="outline"
							size="compact"
							onClick={() => setCurrentPage((page) => page + 1)}
							disabled={activePage === totalPages}
						>
							Próxima
							<ChevronRight aria-hidden="true" className="size-4" />
						</Button>
					</nav>
				</>
			)}
		</section>
	);
}
