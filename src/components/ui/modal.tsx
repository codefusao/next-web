"use client";

import { X } from "lucide-react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";

type ModalSize = "sm" | "lg";
type ModalLayout = "centered" | "scrollable";

type ModalProps = {
	title: string;
	description?: string;
	closeLabel: string;
	onClose: () => void;
	children: React.ReactNode;
	size?: ModalSize;
	layout?: ModalLayout;
	footer?: React.ReactNode;
};

const sizeClasses: Record<ModalSize, string> = {
	sm: "max-w-xl",
	lg: "max-w-5xl",
};

const layoutClasses: Record<ModalLayout, string> = {
	centered: "flex items-center justify-center p-4",
	scrollable: "flex items-center justify-center overflow-y-auto p-4 sm:p-8",
};

export function Modal({
	title,
	description,
	closeLabel,
	onClose,
	children,
	size = "sm",
	layout = "centered",
	footer,
}: ModalProps) {
	const { mode } = useTheme();
	const titleId = `${title.toLowerCase().replaceAll(" ", "-")}-title`;
	const descriptionId = description ? `${titleId}-description` : undefined;

	return createPortal(
		<div
			data-theme={mode}
			className={`fixed inset-0 z-50 bg-black/50 ${layoutClasses[layout]}`}
		>
			<button
				type="button"
				aria-label={closeLabel}
				className="absolute inset-0 cursor-default"
				onClick={onClose}
			/>
			<section
				className={`relative z-10 mx-auto w-full rounded-[var(--radius-card)] border border-border bg-card p-5 text-foreground shadow-xl sm:p-7 ${sizeClasses[size]} ${layout === "scrollable" ? "max-h-[calc(100dvh-2rem)] overflow-y-auto" : ""}`}
				role="dialog"
				aria-modal="true"
				aria-labelledby={titleId}
				aria-describedby={descriptionId}
				onKeyDown={(event) => {
					if (event.key === "Escape") onClose();
				}}
			>
				<div className="flex items-start justify-between gap-4">
					<div>
						<h2 id={titleId} className="text-2xl font-bold tracking-tight">
							{title}
						</h2>
						{description ? (
							<p
								id={descriptionId}
								className="mt-1 text-sm leading-6 text-muted"
							>
								{description}
							</p>
						) : null}
					</div>
					<Button
						type="button"
						variant="ghost"
						size="icon-sm"
						onClick={onClose}
						aria-label={closeLabel}
						autoFocus
					>
						<X aria-hidden="true" className="size-5" />
					</Button>
				</div>
				{children}
				{footer}
			</section>
		</div>,
		document.body,
	);
}
