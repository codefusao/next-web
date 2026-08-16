export enum CompanyStatus {
	Open = "OPEN",
	Closed = "CLOSED",
}

export type StoreHours = {
	mondayToSaturday: string;
	sundaysAndHolidays?: string;
};

export type Company = {
	id: string;
	parentId: string | null;
	name: string;
	cnpj: string;
	description: string | null;
	address: string | null;
	bannerUrl: string | null;
	status: CompanyStatus | null;
	manager: string | null;
	phone: string | null;
	email: string | null;
	area: number | null;
	storeHours: StoreHours | null;
	latitude: number | null;
	longitude: number | null;
	createdAt: string;
	updatedAt: string;
};

export type CompanyListItem = Company;
