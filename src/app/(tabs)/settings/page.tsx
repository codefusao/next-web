import { Settings } from "lucide-react";

export default function SettingsPage() {
	return (
		<section className="rounded-[var(--radius-card)] border border-dashed border-border bg-card px-6 py-14 text-center">
			<Settings
				aria-hidden="true"
				className="mx-auto mb-4 size-10 text-primary"
			/>
			<h2 className="text-2xl font-bold">Configurações em breve</h2>
			<p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted">
				As preferências e configurações administrativas serão incluídas nesta
				área em uma próxima etapa.
			</p>
		</section>
	);
}
