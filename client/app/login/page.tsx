"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loginSchema, type LoginSchema } from "@/schemas/login.schema";
import { useLogin } from "@/hooks/use-auth";
import NextLink from "next/link"; // Fallback if custom Link doesn't exist

export default function LoginPage() {
    const form = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const { mutate: loginUser, isPending } = useLogin();

    function onSubmit(values: LoginSchema) {
        loginUser(values);
    }

    function onDemoLogin() {
        form.setValue("email", "demo@example.com");
        form.setValue("password", "password123");
        loginUser({ email: "demo@example.com", password: "password123" });
    }

    function onTestLogin() {
        form.setValue("email", "john@doe.com");
        form.setValue("password", "john@doe");
        loginUser({ email: "john@doe.com", password: "john@doe" });
    }

    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px] px-4">
                <div className="flex flex-col space-y-2 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Welcome back
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Enter your email to sign in to your account
                    </p>
                </div>

                <div className="grid gap-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="name@example.com"
                                                type="email"
                                                autoCapitalize="none"
                                                autoComplete="email"
                                                autoCorrect="off"
                                                disabled={isPending}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Password"
                                                type="password"
                                                autoComplete="current-password"
                                                disabled={isPending}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button disabled={isPending} type="submit" className="w-full">
                                {isPending && (
                                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                )}
                                Sign In
                            </Button>
                        </form>
                    </Form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Button
                            variant="outline"
                            type="button"
                            disabled={isPending}
                            onClick={onDemoLogin}
                            className="w-full"
                        >
                            Demo Account
                        </Button>
                        <Button
                            variant="outline"
                            type="button"
                            disabled={isPending}
                            onClick={onTestLogin}
                            className="w-full"
                        >
                            Test Account
                        </Button>
                    </div>
                </div>

                <p className="px-8 text-center text-sm text-muted-foreground">
                    <NextLink
                        href="/register"
                        className="hover:text-brand underline underline-offset-4"
                    >
                        Don&apos;t have an account? Sign Up
                    </NextLink>
                </p>
            </div>
        </div>
    );
}
