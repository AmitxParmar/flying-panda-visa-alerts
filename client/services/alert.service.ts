import api from "@/lib/api";
import {
    ApiSuccessResponse,
    VisaAlert,
    CreateAlertPayload,
    UpdateAlertPayload,
} from "@/types";

const API_BASE = "/alerts";

export interface GetAlertsResponse {
    items: VisaAlert[];
    nextCursor: string | null;
}

export async function getAlerts({ pageParam }: { pageParam?: string }): Promise<ApiSuccessResponse<GetAlertsResponse>> {
    const response = await api.get<ApiSuccessResponse<GetAlertsResponse>>(API_BASE, {
        params: {
            cursor: pageParam,
            limit: 10,
        }
    });
    return response.data;
}

export async function createAlert(
    data: CreateAlertPayload
): Promise<ApiSuccessResponse<VisaAlert>> {
    const response = await api.post<ApiSuccessResponse<VisaAlert>>(API_BASE, data);
    return response.data;
}

export async function updateAlert(
    id: string,
    data: UpdateAlertPayload
): Promise<ApiSuccessResponse<VisaAlert>> {
    const response = await api.put<ApiSuccessResponse<VisaAlert>>(
        `${API_BASE}/${id}`,
        data
    );
    return response.data;
}

export async function deleteAlert(
    id: string
): Promise<ApiSuccessResponse<VisaAlert>> {
    const response = await api.delete<ApiSuccessResponse<VisaAlert>>(
        `${API_BASE}/${id}`
    );
    return response.data;
}
