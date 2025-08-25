import React from "react";
import { FieldValues, Path, UseFormRegister } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Option {
  value: string;
  label: string;
}

interface FormFieldProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  type?: string;
  placeholder?: string;
  register: UseFormRegister<T>;
  errors: Partial<Record<string, any>>;
  readOnly?: boolean;
  as?: "input" | "select";
  options?: Option[];
}

export const AppointmentForm = <T extends FieldValues>({
  name,
  label,
  type = "text",
  placeholder,
  register,
  errors,
  readOnly = false,
  as = "input",
  options,
}: FormFieldProps<T>) => {
  return (
    <div>
      <Label>{label}</Label>
      {as === "select" ? (
        <select
          {...register(name)}
          className="w-full border rounded px-2 py-1"
        >
          {options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <Input
          type={type}
          {...register(name)}
          placeholder={placeholder}
          readOnly={readOnly}
        />
      )}
      {errors[name] && (
        <p className="text-destructive text-sm">{errors[name]?.message}</p>
      )}
    </div>
  );
};
