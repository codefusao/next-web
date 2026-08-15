import { CompanyStatus, CompanyType } from "@/types/company";

export const storeValidation = {
	minimumPhoneDigits: 10,
	cnpjDigits: 14,
	maximumDescriptionLength: 500,
	maximumMapFileSize: 5 * 1024 * 1024,
	acceptedMapTypes: ["image/jpeg", "image/png", "image/webp"],
} as const;

export const storeStatusLabels: Record<CompanyStatus, string> = {
	[CompanyStatus.Open]: "Aberta",
	[CompanyStatus.Closed]: "Fechada",
};

export const storeTypeLabels: Record<CompanyType, string> = {
	[CompanyType.Physical]: "Física",
	[CompanyType.Online]: "Online",
	[CompanyType.Hybrid]: "Híbrida",
};
