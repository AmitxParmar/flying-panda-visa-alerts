
export type User = {
    id: string;
    email: string;
    name?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};

export type Participant = {
    email: string;
    name: string;
    profilePicture?: string;
};

export type LastMessage = {
    text: string;
    timestamp: number;
    from: string;
    status: "pending" | "sent" | "delivered" | "read" | "failed";
};

export type Conversation = {
    id: string;
    conversationId: string;
    participants: Participant[];
    lastMessage: LastMessage;
    unreadCount: number;
    isArchived: boolean;
    createdAt: string | Date;
    updatedAt: string | Date;
};

export type Message = {
    id: string;
    conversationId: string;
    from: string;
    to: string;
    text: string;
    timestamp: number;
    status: "pending" | "sent" | "delivered" | "read" | "failed";
    type: "text" | "image" | "document" | "audio" | "video";
    email: string;
    direction: "incoming" | "outgoing";
    contact: {
        name: string;
        email: string;
    };
    createdAt: string | Date;
    updatedAt: string | Date;
};

// Contact type based on the provided array of objects
export type Contact = {
    id: string;
    email: string;
    name: string;
    createdAt: string;
    updatedAt: string;
};

// ============================================
// API Response Types (matching server structure)
// ============================================

/**
 * Success response structure from the server
 * Server returns: { message: string, data: T }
 */
export interface ApiSuccessResponse<T> {
    message: string;
    data: T;
}

/**
 * Error response structure from the server error handler
 * Server returns: { success: false, message, code?, rawErrors?, stack? }
 */
export interface ApiErrorResponse {
    success: false;
    message: string;
    rawErrors?: string[];
    code?: AuthErrorCode;
    stack?: string;
}

/**
 * Auth-specific error codes returned by the server
 */
export type AuthErrorCode =
    | "ACCESS_TOKEN_MISSING"
    | "ACCESS_TOKEN_EXPIRED"
    | "ACCESS_TOKEN_INVALID"
    | "REFRESH_TOKEN_MISSING"
    | "REFRESH_TOKEN_EXPIRED"
    | "REFRESH_TOKEN_INVALID"
    | "REFRESH_TOKEN_REVOKED"
    | "USER_NOT_FOUND";

/**
 * Auth response with user data (login, register, refresh)
 */
export interface AuthUserResponse {
    user: User;
}

/**
 * Axios error with typed response data
 */
export interface AxiosAuthError {
    response?: {
        status: number;
        data?: ApiErrorResponse;
    };
    message?: string;
}



// ============================================
// Visa Alert Types
// ============================================

export type VisaType = 'Tourist' | 'Business' | 'Student';

export type AlertStatus = 'Active' | 'Booked' | 'Expired';

export interface VisaAlert {
    id: string;
    country: string;
    city: string;
    visaType: VisaType;
    status: AlertStatus;
    createdAt: string;
}

export interface CreateAlertPayload {
    country: string;
    city: string;
    visaType: VisaType;
}

export interface UpdateAlertPayload {
    status?: AlertStatus;
}
