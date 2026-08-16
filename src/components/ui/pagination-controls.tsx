import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type PaginationControlsProps = {
	activePage: number;
	totalPages: number;
	onPrevious: () => void;
	onNext: () => void;
	label: string;
};

export function PaginationControls({
	activePage,
	totalPages,
	onPrevious,
	onNext,
	label,
}: PaginationControlsProps) {
	return (
		<nav
			className="mt-4 flex items-center justify-end gap-3"
			aria-label={label}
		>
			<Button
				variant="outline"
				size="compact"
				onClick={onPrevious}
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
				onClick={onNext}
				disabled={activePage === totalPages}
			>
				Próxima
				<ChevronRight aria-hidden="true" className="size-4" />
			</Button>
		</nav>
	);
}
