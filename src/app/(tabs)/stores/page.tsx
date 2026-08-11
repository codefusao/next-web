import { AddStoreForm } from "@/components/stores/add-store-form";
import { StoresList } from "@/components/stores/stores-list";

export default function StoresPage() {
	return (
		<section>
			<div className="mb-8 flex flex-col gap-1">
				<p className="text-sm font-semibold text-primary">Unidades</p>
				<h1 className="text-3xl font-bold tracking-tight">Lojas</h1>
				<p className="max-w-3xl text-sm leading-6 text-muted">
					Encontre os endereços das lojas disponíveis para vincular produtos e
					consultar informações operacionais.
				</p>
			</div>
			<AddStoreForm />
			<StoresList />
		</section>
	);
}
