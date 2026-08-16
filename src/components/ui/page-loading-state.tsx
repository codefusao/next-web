import type { ThemeMode } from "@/store/theme-store";

type PageLoadingStateProps = {
	theme: ThemeMode;
};

export function PageLoadingState({ theme }: PageLoadingStateProps) {
	return (
		<main
			data-theme={theme}
			className="flex min-h-full flex-1 items-center justify-center bg-background text-muted"
			aria-busy="true"
		>
			Carregando…
		</main>
	);
}
