"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createAlertSchema, updateAlertSchema } from "@/schemas/alert.schema";
import { VisaAlert } from "@/types";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";

type CreateFormData = z.infer<typeof createAlertSchema>;
type UpdateFormData = z.infer<typeof updateAlertSchema>;

interface AlertFormProps {
    initialData?: VisaAlert;
    onSubmit: (data: CreateFormData | UpdateFormData) => void;
    isLoading?: boolean;
    onCancel?: () => void;
}

export function AlertForm({
    initialData,
    onSubmit,
    isLoading,
    onCancel,
}: AlertFormProps) {
    const isEditing = !!initialData;
    const schema = isEditing ? updateAlertSchema : createAlertSchema;

    const form = useForm<CreateFormData | UpdateFormData>({
        resolver: zodResolver(schema),
        defaultValues: isEditing
            ? { status: initialData.status }
            : {
                country: "",
                city: "",
                visaType: "Tourist",
            },
    });

    useEffect(() => {
        if (initialData) {
            form.reset({ status: initialData.status });
        } else {
            form.reset({
                country: "",
                city: "",
                visaType: "Tourist",
            });
        }
    }, [initialData, form]);

    const handleSubmit = (data: CreateFormData | UpdateFormData) => {
        onSubmit(data);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                {!isEditing && (
                    <>
                        <FormField
                            control={form.control}
                            name="country"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Country</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Germany" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>City</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Berlin" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="visaType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Visa Type</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value as string}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select visa type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Tourist">Tourist</SelectItem>
                                            <SelectItem value="Business">Business</SelectItem>
                                            <SelectItem value="Student">Student</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </>
                )}

                {isEditing && (
                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Status</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value as string}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Active">Active</SelectItem>
                                        <SelectItem value="Booked">Booked</SelectItem>
                                        <SelectItem value="Expired">Expired</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Saving..." : isEditing ? "Update Alert" : "Create Alert"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
