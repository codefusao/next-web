import { Store } from "lucide-react";

export default function StoresPage() {
	return (
		<section className="rounded-[var(--radius-card)] border border-dashed border-border bg-card px-6 py-14 text-center">
			<Store aria-hidden="true" className="mx-auto mb-4 size-10 text-primary" />
			<h2 className="text-2xl font-bold">Lojas em breve</h2>
			<p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted">
				Aqui os produtos serão vinculados às lojas e receberão estoque e
				localização física.
			</p>
		</section>
	);
}
