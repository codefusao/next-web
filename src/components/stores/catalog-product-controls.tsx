"use client";

import { ListFilter } from "lucide-react";
import { useState } from "react";
import { SearchInput } from "@/components/ui/search-input";
import { productCategories } from "@/constants/product-categories";
import {
	type CatalogProductOrder,
	catalogProductOrder,
} from "@/lib/catalog-products";

type CatalogProductControlsProps = {
	query: string;
	categoryId: string;
	order: CatalogProductOrder;
	onQueryChange: (query: string) => void;
	onCategoryChange: (categoryId: string) => void;
	onOrderChange: (order: CatalogProductOrder) => void;
};

const orderOptions: { value: CatalogProductOrder; label: string }[] = [
	{ value: catalogProductOrder.name, label: "Nome (A–Z)" },
	{ value: catalogProductOrder.category, label: "Categoria" },
	{ value: catalogProductOrder.code, label: "Código" },
];

export function CatalogProductControls({
	query,
	categoryId,
	order,
	onQueryChange,
	onCategoryChange,
	onOrderChange,
}: CatalogProductControlsProps) {
	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const activeFilterLabel = productCategories.find(
		(category) => category.id === categoryId,
	)?.label;

	return (
		<div className="border-b border-border p-4 sm:p-5">
			<div className="flex gap-2">
				<SearchInput
					query={query}
					onQueryChange={onQueryChange}
					placeholder="Buscar por produto, código ou categoria"
					label="Buscar no catálogo da loja"
					className="mb-0 flex-1"
					inputClassName="bg-transparent"
				/>
				<div className="relative shrink-0">
					<button
						type="button"
						className={`inline-flex h-[var(--control-height-input)] items-center gap-2 rounded-[var(--radius-control)] border px-3 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
							isFilterOpen || categoryId
								? "border-primary bg-primary/10 text-primary"
								: "border-border bg-transparent text-foreground hover:border-primary/40"
						}`}
						onClick={() => setIsFilterOpen((isOpen) => !isOpen)}
						aria-expanded={isFilterOpen}
						aria-controls="catalog-category-filter"
					>
						<ListFilter aria-hidden="true" className="size-4" />
						<span className="hidden sm:inline">Filtros</span>
					</button>
					{isFilterOpen ? (
						<div
							id="catalog-category-filter"
							className="absolute right-0 z-30 mt-2 w-64 rounded-[var(--radius-control)] border border-border bg-card p-2 shadow-lg"
						>
							<p className="px-2 py-1.5 text-xs font-bold uppercase tracking-wide text-muted">
								Categoria
							</p>
							<button
								type="button"
								className={`w-full rounded-[var(--radius-sm)] px-2 py-2 text-left text-sm transition-colors hover:bg-background ${
									!categoryId ? "bg-primary/10 font-bold text-primary" : ""
								}`}
								onClick={() => {
									onCategoryChange("");
									setIsFilterOpen(false);
								}}
							>
								Todas as categorias
							</button>
							<div className="max-h-56 overflow-y-auto">
								{productCategories.map((category) => (
									<button
										key={category.id}
										type="button"
										className={`w-full rounded-[var(--radius-sm)] px-2 py-2 text-left text-sm transition-colors hover:bg-background ${
											category.id === categoryId
												? "bg-primary/10 font-bold text-primary"
												: ""
										}`}
										onClick={() => {
											onCategoryChange(category.id);
											setIsFilterOpen(false);
										}}
									>
										{category.label}
									</button>
								))}
							</div>
						</div>
					) : null}
				</div>
			</div>
			<div className="mt-4 flex flex-wrap items-center justify-between gap-3">
				<p className="text-sm text-muted">
					{activeFilterLabel
						? `Filtro: ${activeFilterLabel}`
						: "Todos os produtos"}
				</p>
				<select
					value={order}
					onChange={(event) =>
						onOrderChange(event.target.value as CatalogProductOrder)
					}
					className="h-9 rounded-[var(--radius-sm)] border border-border bg-transparent px-2 text-sm font-medium text-foreground outline-none focus:border-primary"
					aria-label="Ordenar produtos do catálogo"
				>
					{orderOptions.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</select>
			</div>
		</div>
	);
}
