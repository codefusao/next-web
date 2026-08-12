import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";

type StoreNotFoundStateProps = {
	className: string;
};

export function StoreNotFoundState({ className }: StoreNotFoundStateProps) {
	return (
		<section className={className}>
			<EmptyState
				className="py-14"
				titleAs="h1"
				title="Loja não encontrada"
				description="A loja solicitada não está disponível na lista local."
				action={
					<Link
						href="/stores"
						className="inline-flex h-10 items-center gap-2 rounded-[var(--radius-control)] bg-primary px-4 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
					>
						<ArrowLeft aria-hidden="true" className="size-4" />
						Voltar para lojas
					</Link>
				}
			/>
		</section>
	);
}
