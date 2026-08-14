import { apiRequest } from "@/api/client";
import {
	companySchema,
	type UpdateCompanyInput,
} from "@/api/company/company-contract";
import { toCompanyListItem } from "@/api/company/to-company-list-item";
import type { CompanyListItem } from "@/types/company";

export async function updateCompany(
	company: CompanyListItem,
	updatedCompany: UpdateCompanyInput,
): Promise<CompanyListItem> {
	// TODO(backend): include the remaining Company presentation fields here.
	const updatedCompanyResponse = await apiRequest(
		`/company/${company.id}`,
		companySchema,
		{
			method: "PUT",
			body: {
				parentId: updatedCompany.parentId,
				name: updatedCompany.name,
				cnpj: updatedCompany.cnpj,
				description: updatedCompany.description,
			},
		},
	);
	return toCompanyListItem(updatedCompanyResponse);
}
