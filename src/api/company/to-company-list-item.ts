import type { z } from "zod";
import type { companySchema } from "@/api/company/company-contract";
import { defaultCompanyInformation } from "@/api/mock-data";
import type { CompanyListItem } from "@/types/company";

type CompanyPayload = z.infer<typeof companySchema>;

export function toCompanyListItem(company: CompanyPayload): CompanyListItem {
	// Address is also local-only until the backend exposes its Address relation.
	return { ...company, ...defaultCompanyInformation, address: "" };
}
