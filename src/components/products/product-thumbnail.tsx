"use client";

import { Boxes } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

type ProductThumbnailProps = {
	source: string | null;
	productName: string;
};

export function ProductThumbnail({
	source,
	productName,
}: ProductThumbnailProps) {
	const [hasError, setHasError] = useState(false);

	if (!source || hasError) {
		return (
			<div
				className="flex size-14 items-center justify-center rounded-[var(--radius-sm)] bg-background text-muted"
				role="img"
				aria-label={`Imagem indisponível para ${productName}`}
			>
				<Boxes aria-hidden="true" className="size-5" />
			</div>
		);
	}

	return (
		<Image
			src={source}
			alt={`Imagem de ${productName}`}
			width={56}
			height={56}
			className="size-14 rounded-[var(--radius-sm)] bg-background object-contain"
			onError={() => setHasError(true)}
		/>
	);
}
