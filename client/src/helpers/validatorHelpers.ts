// validatorHelpers.ts
import { z } from "zod";

// Common string validators
export const requiredString = (message = "This field is required") =>
  z.string().min(1, message);

export const emailString = (message = "Invalid email address") =>
  z.string().email(message);

export const phoneString = (message = "Phone number is required") =>
  z.string().min(1, message);

// Datetime validator (ISO-ish format: YYYY-MM-DDTHH:MM)
export const dateTimeString = (message = "Invalid datetime format") =>
  z
    .string()
    .min(1, "Date is required")
    .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, message);

// Enum helper
export const statusEnum = z.enum(["pending", "approved", "declined"]);
