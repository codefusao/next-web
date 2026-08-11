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
				className="border-transparent bg-card/95 text-foreground shadow-sm backdrop-blur-sm hover:bg-card"
			>
				<EllipsisVertical aria-hidden="true" className="size-5" />
			</Button>
			{isOpen ? (
				<div
					className="absolute right-0 z-10 mt-2 w-72 rounded-[var(--radius-card)] border border-border bg-card p-2 shadow-lg"
					role="menu"
					aria-label="Ações da loja"
				>
					<button
						type="button"
						role="menuitem"
						onClick={handleEdit}
						className="flex h-10 w-full cursor-pointer items-center gap-2 rounded-[var(--radius-control)] px-2 text-left text-sm font-bold text-foreground transition-colors hover:bg-border focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary"
					>
						<Pencil aria-hidden="true" className="size-4" />
						Editar informações
					</button>
					<div className="my-2 border-t border-border" />
					<button
						type="button"
						role="menuitem"
						onClick={handleDelete}
						className="flex h-10 w-full cursor-pointer items-center gap-2 rounded-[var(--radius-control)] px-2 text-left text-sm font-bold text-destructive transition-colors hover:bg-destructive/10 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-destructive"
					>
						<Trash2 aria-hidden="true" className="size-4" />
						Excluir loja
					</button>
				</div>
			) : null}
		</div>
	);
}
