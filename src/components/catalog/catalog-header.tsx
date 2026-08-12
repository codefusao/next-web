"use client";

import { ArrowLeft, MapPinned, PackagePlus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { StoreListItem } from "@/types/store";

type StoreCatalogHeaderProps = {
	store: StoreListItem;
	onAddProduct: () => void;
};

export function CatalogHeader({
	store,
	onAddProduct,
}: StoreCatalogHeaderProps) {
	return (
		<>
			<Link
				href={`/stores/${store.id}`}
				className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
			>
				<ArrowLeft aria-hidden="true" className="size-4" />
				Voltar para detalhes da loja
			</Link>
			<div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
				<div className="flex items-center gap-3">
					<span className="inline-flex rounded-[var(--radius-control)] bg-primary/10 p-3 text-primary">
						<MapPinned aria-hidden="true" className="size-6" />
					</span>
					<div>
						<h1 className="text-3xl font-bold tracking-tight text-foreground">
							Catálogo da loja
						</h1>
						<p className="mt-1 text-sm text-muted">
							Localize os produtos disponíveis dentro da loja.
						</p>
					</div>
				</div>
				<Button size="compact" onClick={onAddProduct}>
					<PackagePlus aria-hidden="true" className="size-4" />
					Adicionar produto
				</Button>
			</div>
		</>
	);
}
