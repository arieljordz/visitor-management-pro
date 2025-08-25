// schemaHelpers.ts
import { z, ZodTypeAny } from "zod";
import {
  requiredString,
  emailString,
  phoneString,
  dateTimeString,
  statusEnum,
} from "@/helpers/validatorHelpers";

type FieldType =
  | "string"
  | "email"
  | "phone"
  | "datetime"
  | "enumStatus"
  | "optionalString";

interface FieldConfig {
  type: FieldType;
  message?: string; // optional custom message
  optional?: boolean;
}

// Map field configs to Zod validators
const fieldTypeMap: Record<FieldType, (message?: string) => ZodTypeAny> = {
  string: (msg) => requiredString(msg),
  email: (msg) => emailString(msg),
  phone: (msg) => phoneString(msg),
  datetime: (msg) => dateTimeString(msg),
  enumStatus: () => statusEnum,
  optionalString: () => z.string().optional(),
};

export const createSchema = (fields: Record<string, FieldConfig>) => {
  const shape: Record<string, ZodTypeAny> = {};

  for (const key in fields) {
    const config = fields[key];
    let validator = fieldTypeMap[config.type](config.message);

    if (config.optional) {
      validator = validator.optional();
    }

    shape[key] = validator;
  }

  return z.object(shape);
};
