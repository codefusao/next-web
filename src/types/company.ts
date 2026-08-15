export enum CompanyStatus {
	Open = "open",
	Closed = "closed",
}

export enum CompanyType {
	Physical = "physical",
	Online = "online",
	Hybrid = "hybrid",
}

export type Company = {
	id: string;
	parentId: string | null;
	name: string;
	cnpj: string;
	description: string | null;
	createdAt: string;
	updatedAt: string;
};

export type CompanyListItem = Company & {
	// Local-only temporary information. These fields do not exist in the backend
	// Company contract and must never be sent to or persisted by the API.
	// TODO(backend): add Company support for these fields.
	address: string;
	bannerUrl: string;
	storeMapUrl: string;
	status: CompanyStatus;
	type: CompanyType;
	manager: string;
	phone: string;
	email: string;
	area: number;
};
