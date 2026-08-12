export enum StoreStatus {
	Open = "open",
	Closed = "closed",
}

export enum StoreType {
	Physical = "physical",
	Online = "online",
	Hybrid = "hybrid",
}

export type StoreListItem = {
	id: string;
	parentId?: string | null;
	name: string;
	cnpj?: string;
	description?: string | null;
	address?: string;
	bannerUrl: string;
	status: StoreStatus;
	type: StoreType;
	manager: string;
	phone: string;
	email: string;
	area: number;
};
