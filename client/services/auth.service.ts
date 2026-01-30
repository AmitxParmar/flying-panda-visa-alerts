import api from "@/lib/api";
import type {
  ApiSuccessResponse,
  AuthUserResponse,
  User,
} from "@/types";

const API_BASE = "/auth";

/**
 * Register a new user
 */
export async function register(
  email: string,
  name: string,
  password: string
): Promise<ApiSuccessResponse<AuthUserResponse>> {
  const response = await api.post<ApiSuccessResponse<AuthUserResponse>>(
    `${API_BASE}/register`,
    {
      email,
      name,
      password,
    }
  );
  return response.data;
}

/**
 * Login user
 */
export async function login(
  email: string,
  password: string
): Promise<ApiSuccessResponse<AuthUserResponse>> {
  const response = await api.post<ApiSuccessResponse<AuthUserResponse>>(
    `${API_BASE}/login`,
    { email, password }
  );
  return response.data;
}

/**
 * Logout user
 */
export async function logout(): Promise<ApiSuccessResponse<null>> {
  const response = await api.post<ApiSuccessResponse<null>>(`${API_BASE}/logout`);
  return response.data;
}

/**
 * Refresh access token
 */
export async function refreshToken(): Promise<ApiSuccessResponse<AuthUserResponse>> {
  const response = await api.post<ApiSuccessResponse<AuthUserResponse>>(
    `${API_BASE}/refresh-token`
  );
  return response.data;
}

/**
 * Get current authenticated user profile
 */
export async function getProfile(): Promise<ApiSuccessResponse<User>> {
  const response = await api.get<ApiSuccessResponse<User>>(`${API_BASE}/profile`);
  return response.data;
}

/**
 * Update current authenticated user profile
 */
export async function updateProfile(profileData: {
  name?: string;
}): Promise<ApiSuccessResponse<AuthUserResponse>> {
  const response = await api.put<ApiSuccessResponse<AuthUserResponse>>(
    `${API_BASE}/profile`,
    profileData
  );
  return response.data;
}

/**
 * Change user password
 */
export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<ApiSuccessResponse<null>> {
  const response = await api.put<ApiSuccessResponse<null>>(
    `${API_BASE}/change-password`,
    {
      currentPassword,
      newPassword,
    }
  );
  return response.data;
}
