"use client";

import { Toaster } from "sonner";
import { useTheme } from "@/hooks/use-theme";

export function AppToaster() {
	const { mode } = useTheme();

	return (
		<div data-theme={mode}>
			<Toaster
				theme={mode}
				position="top-right"
				duration={4000}
				closeButton
				toastOptions={{
					classNames: {
						toast:
							"!rounded-[var(--radius-card)] !border-border !bg-card !font-sans !text-foreground !shadow-lg",
						success: "!border-primary",
						closeButton:
							"!border-border !bg-card !text-muted hover:!bg-background hover:!text-foreground",
					},
				}}
			/>
		</div>
	);
}
