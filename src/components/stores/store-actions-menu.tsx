import { EllipsisVertical, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type StoreActionsMenuProps = {
	onEdit: () => void;
	onDelete: () => void;
};

export function StoreActionsMenu({ onEdit, onDelete }: StoreActionsMenuProps) {
	const [isOpen, setIsOpen] = useState(false);

	function handleEdit() {
		setIsOpen(false);
		onEdit();
	}

	function handleDelete() {
		setIsOpen(false);
		onDelete();
	}

	return (
		<div className="relative">
			<Button
				variant="outline"
				size="icon"
				onClick={() => setIsOpen((open) => !open)}
				aria-label="Mais ações da loja"
				aria-haspopup="menu"
				aria-expanded={isOpen}
			>
				<EllipsisVertical aria-hidden="true" className="size-5" />
			</Button>
			{isOpen ? (
				<div
					className="absolute right-0 z-10 mt-2 w-52 rounded-[var(--radius-sm)] border border-border bg-card p-1 shadow-lg"
					role="menu"
					aria-label="Ações da loja"
				>
					<button
						type="button"
						role="menuitem"
						onClick={handleEdit}
						className="flex w-full cursor-pointer items-center gap-2 rounded-[var(--radius-sm)] px-3 py-2 text-left text-sm font-semibold text-foreground transition-colors hover:bg-background focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary"
					>
						<Pencil aria-hidden="true" className="size-4" />
						Editar informações
					</button>
					<button
						type="button"
						role="menuitem"
						onClick={handleDelete}
						className="flex w-full cursor-pointer items-center gap-2 rounded-[var(--radius-sm)] px-3 py-2 text-left text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-destructive"
					>
						<Trash2 aria-hidden="true" className="size-4" />
						Excluir loja
					</button>
				</div>
			) : null}
		</div>
	);
}
