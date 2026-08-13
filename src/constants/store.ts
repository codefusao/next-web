import { StoreStatus, StoreType } from "@/types/store";

export const storeValidation = {
	minimumPhoneDigits: 10,
	cnpjDigits: 14,
	maximumDescriptionLength: 500,
	maximumMapFileSize: 5 * 1024 * 1024,
	acceptedMapTypes: ["image/jpeg", "image/png", "image/webp"],
} as const;

export const storeStatusLabels: Record<StoreStatus, string> = {
	[StoreStatus.Open]: "Aberta",
	[StoreStatus.Closed]: "Fechada",
};

export const storeTypeLabels: Record<StoreType, string> = {
	[StoreType.Physical]: "Física",
	[StoreType.Online]: "Online",
	[StoreType.Hybrid]: "Híbrida",
};
