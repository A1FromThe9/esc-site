import { z } from "zod";

export const requestBookingSchema = z
  .object({
    providerSlug: z.string().min(1),
    date: z.string().refine((v) => !Number.isNaN(Date.parse(v)), "Invalid date"),
    startTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time"),
    endTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time"),
    locationType: z.enum(["incall", "outcall"]),
    note: z.string().max(500).optional().or(z.literal("")),
  })
  .refine((d) => `${d.date}T${d.startTime}` < `${d.date}T${d.endTime}`, {
    message: "End time must be after start time",
    path: ["endTime"],
  })
  .refine((d) => new Date(`${d.date}T${d.startTime}:00`) > new Date(), {
    message: "Booking must be in the future",
    path: ["date"],
  });

export type RequestBookingInput = z.infer<typeof requestBookingSchema>;
