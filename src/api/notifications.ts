import { z } from "zod";
import { apiRequest } from "@/api/client";
import type { PaginationMeta } from "@/types/product";

const notificationSchema = z.object({
	id: z.string().uuid(),
	userId: z.string().uuid().nullable(),
	companyId: z.string().uuid().nullable(),
	title: z.string(),
	message: z.string(),
	read: z.boolean(),
	createdAt: z.string(),
	updatedAt: z.string(),
});
const notificationsResponseSchema = z.object({
	notifications: z.array(notificationSchema),
	meta: z.object({ totalPages: z.number(), currentPage: z.number(), totalRecords: z.number() }),
});

export type LocationNotification = z.infer<typeof notificationSchema>;
export type NotificationsResult = {
	notifications: LocationNotification[];
	meta: PaginationMeta;
};

export async function getNotifications(
	companyId: string,
	page = 1,
): Promise<NotificationsResult> {
	const search = new URLSearchParams({ companyId, page: String(page), limit: "10" });
	return apiRequest(`/notification?${search.toString()}`, notificationsResponseSchema);
}
