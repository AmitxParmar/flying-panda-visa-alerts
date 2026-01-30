import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login, register } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { type LoginSchema } from "@/schemas/login.schema";
import { type RegisterSchema } from "@/schemas/register.schema";

export const useLogin = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: LoginSchema) => {
            return await login(data.email, data.password);
        },
        onSuccess: (data) => {
            toast.success("Login successful");
            queryClient.setQueryData(["authUser"], data.data.user);
            router.push("/");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to login");
        },
    });
};

export const useRegister = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: RegisterSchema) => {
            return await register(data.email, data.name, data.password);
        },
        onSuccess: (data) => {
            toast.success("Account created successfully");
            queryClient.setQueryData(["authUser"], data.data.user);
            router.push("/");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to register");
        },
    });
};
