"use client";

import { EllipsisVertical, Map as MapIcon, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";

type MenuPosition = {
	top: number;
	right: number;
};

type CatalogProductActionsProps = {
	catalogProductId: string;
	productName: string;
	onEdit: () => void;
	onEditQuantity: () => void;
	onDelete: () => void;
};

export function CatalogProductActions({
	catalogProductId,
	productName,
	onEdit,
	onEditQuantity,
	onDelete,
}: CatalogProductActionsProps) {
	const { mode } = useTheme();
	const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null);
	const menuId = `catalog-product-actions-${catalogProductId}`;

	function toggleMenu(event: React.MouseEvent<HTMLButtonElement>) {
		if (menuPosition) {
			setMenuPosition(null);
			return;
		}

		const triggerBounds = event.currentTarget.getBoundingClientRect();
		setMenuPosition({
			top:
				triggerBounds.bottom + 52 > window.innerHeight
					? triggerBounds.top - 48
					: triggerBounds.bottom + 4,
			right: window.innerWidth - triggerBounds.right,
		});
	}

	return (
		<>
			<Button
				variant="ghost"
				size="icon-sm"
				onClick={toggleMenu}
				aria-label={`Mais ações para ${productName}`}
				aria-expanded={Boolean(menuPosition)}
				aria-controls={menuPosition ? menuId : undefined}
			>
				<EllipsisVertical aria-hidden="true" className="size-5" />
			</Button>
			{menuPosition
				? createPortal(
						<div data-theme={mode}>
							<button
								type="button"
								className="fixed inset-0 z-40 cursor-default"
								onClick={() => setMenuPosition(null)}
								aria-label="Fechar ações do produto"
							/>
							<div
								id={menuId}
								className="fixed z-50 w-44 rounded-[var(--radius-sm)] border border-border bg-card p-1 text-foreground shadow-lg"
								style={menuPosition}
							>
								<button
									type="button"
									className="flex w-full cursor-pointer items-center gap-2 rounded-[var(--radius-sm)] px-2 py-2 text-left text-xs font-medium hover:bg-background"
									onClick={() => {
										setMenuPosition(null);
										onEdit();
									}}
								>
									<MapIcon aria-hidden="true" className="size-4 text-primary" />
									Editar localização
								</button>
								<button
									type="button"
									className="flex w-full cursor-pointer items-center gap-2 rounded-[var(--radius-sm)] px-2 py-2 text-left text-xs font-medium hover:bg-background"
									onClick={() => {
										setMenuPosition(null);
										onEditQuantity();
									}}
								>
									<Pencil aria-hidden="true" className="size-4 text-primary" />
									Alterar quantidade
								</button>
								<button
									type="button"
									className="flex w-full cursor-pointer items-center gap-2 rounded-[var(--radius-sm)] px-2 py-2 text-left text-xs font-medium text-destructive hover:bg-destructive/10"
									onClick={() => {
										setMenuPosition(null);
										onDelete();
									}}
								>
									<Trash2 aria-hidden="true" className="size-4" />
									Excluir do mapa
								</button>
							</div>
						</div>,
						document.body,
					)
				: null}
		</>
	);
}
