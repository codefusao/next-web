import { MapPin } from "lucide-react";
import type { CSSProperties } from "react";

type MapLocationPinProps = {
	size: number;
	className?: string;
	label?: string;
	style?: CSSProperties;
};

export function MapLocationPin({
	size,
	className = "",
	label,
	style,
}: MapLocationPinProps) {
	return (
		<MapPin
			aria-hidden={label ? undefined : true}
			aria-label={label}
			role={label ? "img" : undefined}
			className={`text-primary drop-shadow-md ${className}`}
			style={{ height: size, width: size, ...style }}
			fill="white"
			strokeWidth={1.5}
		/>
	);
}
