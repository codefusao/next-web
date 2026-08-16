"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/api/query-keys";
import {
	createStoreMap,
	getStoreMapByCompany,
	updateStoreMap,
} from "@/api/store-map";
import type { StoreMap, StoreMapReferencePoint } from "@/types/store-map";

export function useStoreMapQuery(companyId: string) {
	return useQuery({
		queryKey: queryKeys.companies.storeMap(companyId),
		queryFn: () => getStoreMapByCompany(companyId),
		enabled: Boolean(companyId),
	});
}

type SaveStoreMapVariables = {
	companyId: string;
	storeMap: StoreMap | null;
	imageUrl: string;
};

export function useSaveStoreMapMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ companyId, storeMap, imageUrl }: SaveStoreMapVariables) =>
			storeMap
				? updateStoreMap(storeMap.id, { imageUrl })
				: createStoreMap({ companyId, imageUrl }),
		onSuccess: (storeMap) => {
			queryClient.setQueryData(
				queryKeys.companies.storeMap(storeMap.companyId),
				storeMap,
			);
		},
	});
}

type SaveStoreMapReferencePointsVariables = {
	storeMap: StoreMap;
	referencePoints: StoreMapReferencePoint[];
};

export function useSaveStoreMapReferencePointsMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ storeMap, referencePoints }: SaveStoreMapReferencePointsVariables) =>
			updateStoreMap(storeMap.id, { referencePoints }),
		onSuccess: (storeMap) => {
			queryClient.setQueryData(
				queryKeys.companies.storeMap(storeMap.companyId),
				storeMap,
			);
		},
	});
}
