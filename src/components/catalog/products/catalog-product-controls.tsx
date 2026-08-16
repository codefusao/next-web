"use client";

import { ArrowDownUp, ListFilter, X } from "lucide-react";
import { useState } from "react";
import type { ReactNode } from "react";
import { SearchInput } from "@/components/ui/search-input";
import { useCategoriesQuery } from "@/hooks/use-categories-query";
import { productOrder, type ProductOrder } from "@/types/product";

type CatalogProductControlsProps = {
	query: string;
	categoryId: string;
	order: ProductOrder;
	onQueryChange: (query: string) => void;
	onCategoryChange: (categoryId: string) => void;
	onOrderChange: (order: ProductOrder) => void;
	searchLabel?: string;
	searchPlaceholder?: string;
	idPrefix?: string;
	action?: ReactNode;
};

const orderOptions: { value: ProductOrder; label: string }[] = [
	{ value: productOrder.name, label: "Nome (A–Z)" },
	{ value: productOrder.category, label: "Categoria" },
];

export function CatalogProductControls({
	query,
	categoryId,
	order,
	onQueryChange,
	onCategoryChange,
	onOrderChange,
	searchLabel = "Buscar no catálogo da loja",
	searchPlaceholder = "Buscar por produto ou categoria",
	idPrefix = "catalog",
	action,
}: CatalogProductControlsProps) {
	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const [isOrderOpen, setIsOrderOpen] = useState(false);
	const { data: categories = [] } = useCategoriesQuery();
	const activeFilterLabel = categories.find((category) => category.id === categoryId)?.name;
	const filterId = `${idPrefix}-category-filter`;
	const orderId = `${idPrefix}-order-options`;

	return (
		<div className="p-4 sm:p-5">
			<div className="flex gap-2">
				<SearchInput
					query={query}
					onQueryChange={onQueryChange}
					placeholder={searchPlaceholder}
					label={searchLabel}
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
									onClick={() => {
										setIsFilterOpen((isOpen) => !isOpen);
										setIsOrderOpen(false);
									}}
						aria-expanded={isFilterOpen}
						aria-controls={filterId}
					>
						<ListFilter aria-hidden="true" className="size-4" />
						<span className="hidden sm:inline">Filtros</span>
					</button>
					{categoryId ? (
						<button
							type="button"
							onClick={() => onCategoryChange("")}
							className="absolute -right-1 -top-1 z-10 inline-flex size-5 cursor-pointer items-center justify-center rounded-full border border-primary bg-background text-primary shadow-sm transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
							aria-label={`Remover filtro${activeFilterLabel ? ` ${activeFilterLabel}` : ""}`}
						>
							<X aria-hidden="true" className="size-3" />
						</button>
					) : null}
					{isFilterOpen ? (
						<div
							id={filterId}
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
								{categories.map((category) => (
									<button
										key={category.id}
										type="button"
										className={`w-full rounded-[var(--radius-sm)] px-2 py-2 text-left text-sm transition-colors hover:bg-background ${category.id === categoryId ? "bg-primary/10 font-bold text-primary" : ""}`}
										onClick={() => {
											onCategoryChange(category.id);
											setIsFilterOpen(false);
										}}
									>
										{category.name}
									</button>
								))}
							</div>
						</div>
					) : null}
					</div>
					<div className="relative shrink-0">
						<button
							type="button"
							className={`inline-flex h-[var(--control-height-input)] items-center gap-2 rounded-[var(--radius-control)] border px-3 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
								isOrderOpen
									? "border-primary bg-primary/10 text-primary"
									: "border-border bg-transparent text-foreground hover:border-primary/40"
							}`}
							onClick={() => {
								setIsOrderOpen((isOpen) => !isOpen);
								setIsFilterOpen(false);
							}}
							aria-expanded={isOrderOpen}
							aria-controls={orderId}
						>
							<ArrowDownUp aria-hidden="true" className="size-4" />
							<span className="hidden sm:inline">Ordenar</span>
						</button>
						{isOrderOpen ? (
							<div id={orderId} className="absolute right-0 z-30 mt-2 w-56 rounded-[var(--radius-control)] border border-border bg-card p-2 shadow-lg">
								{orderOptions.map((option) => (
									<button
										key={option.value}
										type="button"
										className={`w-full rounded-[var(--radius-sm)] px-2 py-2 text-left text-sm transition-colors hover:bg-background ${order === option.value ? "bg-primary/10 font-bold text-primary" : ""}`}
										onClick={() => {
											onOrderChange(option.value);
											setIsOrderOpen(false);
										}}
									>
										{option.label}
									</button>
								))}
							</div>
						) : null}
					</div>
				{action}
			</div>
			<div className="mt-4 flex flex-wrap items-center justify-between gap-3">
				<p className="text-sm text-muted">
					{activeFilterLabel
						? `Filtro: ${activeFilterLabel}`
						: "Todos os produtos"}
				</p>
			</div>
		</div>
	);
}
