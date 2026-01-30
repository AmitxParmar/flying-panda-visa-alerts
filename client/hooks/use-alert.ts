import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getAlerts,
    createAlert,
    updateAlert,
    deleteAlert,
    GetAlertsResponse,
} from "@/services/alert.service";
import { CreateAlertPayload, UpdateAlertPayload, ApiSuccessResponse } from "@/types";
import { toast } from "sonner";

const ALERT_KEYS = {
    all: ["alerts"] as const,
};

export function useGetAlerts() {
    return useInfiniteQuery({
        queryKey: ALERT_KEYS.all,
        queryFn: ({ pageParam }) => getAlerts({ pageParam: pageParam as string | undefined }),
        initialPageParam: undefined as string | undefined, // Explicit type for TS
        getNextPageParam: (lastPage: ApiSuccessResponse<GetAlertsResponse>) => lastPage.data.nextCursor ?? undefined,
    });
}

export function useCreateAlert() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateAlertPayload) => createAlert(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ALERT_KEYS.all });
            toast.success("Alert created successfully");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to create alert");
        },
    });
}

export function useUpdateAlert() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateAlertPayload }) =>
            updateAlert(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ALERT_KEYS.all });
            toast.success("Alert updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to update alert");
        },
    });
}

export function useDeleteAlert() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteAlert(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ALERT_KEYS.all });
            toast.success("Alert deleted successfully");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to delete alert");
        },
    });
}
