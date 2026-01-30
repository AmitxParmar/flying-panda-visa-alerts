import { z } from "zod";

export const createAlertSchema = z.object({
    country: z.string().min(1, "Country is required"),
    city: z.string().min(1, "City is required"),
    visaType: z.enum(["Tourist", "Business", "Student"]),
});

export const updateAlertSchema = z.object({
    status: z.enum(["Active", "Booked", "Expired"]),
});

export type CreateAlertSchema = z.infer<typeof createAlertSchema>;
export type UpdateAlertSchema = z.infer<typeof updateAlertSchema>;
