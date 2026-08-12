import { StoreStatus, StoreType } from "@/types/store";

export const defaultStoreImage =
	"https://cdn.leroymerlin.com.br/contents/rio_barra_c340_880x480.jpg";
export const defaultStoreMapImage = "/store-map.png";

export const storeStatusLabels: Record<StoreStatus, string> = {
	[StoreStatus.Open]: "Aberta",
	[StoreStatus.Closed]: "Fechada",
};

export const storeTypeLabels: Record<StoreType, string> = {
	[StoreType.Physical]: "Física",
	[StoreType.Online]: "Online",
	[StoreType.Hybrid]: "Híbrida",
};

export const defaultStoreMetadata = {
	bannerUrl: defaultStoreImage,
	storeMapUrl: defaultStoreMapImage,
	status: StoreStatus.Open,
	type: StoreType.Physical,
	manager: "Equipe Leroy Merlin",
	phone: "(11) 3000-0000",
	email: "lojas@leroymerlin.com.br",
	area: 10000,
} as const;
