import { CompanyStatus } from "@/types/company";

export const storeValidation = {
	minimumPhoneDigits: 10,
	cnpjDigits: 14,
	maximumDescriptionLength: 500,
} as const;

export const storeStatusLabels: Record<CompanyStatus, string> = {
	[CompanyStatus.Open]: "Aberta",
	[CompanyStatus.Closed]: "Fechada",
};
