export type StoreMapReferencePoint = {
	x: number;
	y: number;
	latitude: number;
	longitude: number;
};

export type StoreMap = {
	id: string;
	companyId: string;
	name: string;
	imageUrl: string;
	referencePoints: StoreMapReferencePoint[] | null;
	createdAt: string;
	updatedAt: string;
};
