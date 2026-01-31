import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { login, register, logout, getCurrentUser } from "@/services/auth.service";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { type LoginSchema } from "@/schemas/login.schema";
import { type RegisterSchema } from "@/schemas/register.schema";

export function useLogout() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: logout,
        onSuccess: () => {
            // Clear all cached data on logout
            queryClient.clear();
        },
    });
}

export function useGetCurrentUser() {
    const pathname = usePathname();
    const isAuthPage = ["/login", "/register"].includes(pathname);

    return useQuery({
        queryKey: ["auth", "currentUser"],
        queryFn: getCurrentUser,
        retry: false, // Don't retry on 401
        staleTime: 5 * 60 * 1000, // Consider fresh for 5 minutes
        enabled: !isAuthPage, // Don't fetch user on auth pages
    });
}

export const useLogin = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: LoginSchema) => login(data.email, data.password),
        onSuccess: (data) => {
            // Set user data immediately to avoid redirect loop
            queryClient.setQueryData(["auth", "currentUser"], data);
            toast.success("Login successful!");
            router.push("/");
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Login failed");
        },
    });
};

export const useRegister = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: RegisterSchema) => register(data.email, data.name, data.password),
        onSuccess: (data) => {
            // Set user data immediately to avoid redirect loop
            queryClient.setQueryData(["auth", "currentUser"], data);
            toast.success("Registration successful!");
            router.push("/");
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Registration failed");
        },
    });
};
