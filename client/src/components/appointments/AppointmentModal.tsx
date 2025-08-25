import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useAppointmentsStore } from "@/stores/appointmentStore";
import { useUserStore } from "@/stores/userStore";
import { useToast } from "@/hooks/use-toast";
import { Appointment } from "@/types/appointment";
import { toLocalDatetimeString, toUTCISOString } from "@/helpers/commonHelpers";
import { createSchema } from "@/helpers/schemaHelpers";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { FieldForm } from "@/components/common/FieldForm";

// ---------------------------
// Schema
// ---------------------------
export const appointmentSchema = createSchema({
  name: { type: "string", message: "Visitor name is required" },
  email: { type: "email" },
  phone: { type: "phone" },
  company: { type: "optionalString" },
  hostName: { type: "string", message: "Host is required" },
  purpose: { type: "string", message: "Purpose is required" },
  visitDate: { type: "datetime" },
  status: { type: "enumStatus", optional: true },
});

type FormData = z.infer<typeof appointmentSchema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  appointment?: Appointment | null;
  mode: "add" | "edit";
}

export const AppointmentModal: React.FC<Props> = ({
  isOpen,
  onClose,
  appointment,
  mode,
}) => {
  const { addAppointment, updateAppointment, fetchAppointments } =
    useAppointmentsStore();
  const { user, isAdmin } = useUserStore();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(appointmentSchema),
  });

  // Reset form when modal opens
  useEffect(() => {
    if (!isOpen) return;

    const now = new Date().toISOString().slice(0, 16);

    if (appointment && mode === "edit") {
      reset({
        ...appointment,
        visitDate: toLocalDatetimeString(appointment.visitDate),
      });
    } else {
      reset({
        name: "",
        email: "",
        phone: "",
        company: "",
        hostName: user?.name || "",
        purpose: "",
        visitDate: now,
        status: "pending",
      });
    }
  }, [isOpen, appointment, mode, reset, user]);

  const onSubmit = async (data: FormData) => {
    const payload: any = {
      ...data,
      company: data.company ?? "",
      visitDate: data.visitDate
        ? toUTCISOString(data.visitDate as string)
        : new Date().toISOString(),
      appointmentDate: new Date().toISOString(),
    };

    try {
      if (mode === "add") {
        await addAppointment(payload);
        toast({
          title: "Appointment requested",
          description: "Waiting for approval.",
        });
      } else if (mode === "edit" && appointment) {
        await updateAppointment({ ...appointment, ...payload });
        toast({ title: "Appointment updated" });
      }
      await fetchAppointments();
      onClose();
    } catch {
      toast({ title: "Failed to save appointment", variant: "destructive" });
    }
  };

  // ---------------------------
  // Fields Config
  // ---------------------------
  const fields = [
    {
      name: "name",
      label: "Visitor Name",
      placeholder: "Enter visitor name",
      readOnly: isAdmin,
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "Enter email",
      readOnly: isAdmin,
    },
    {
      name: "phone",
      label: "Phone",
      placeholder: "Enter phone number",
      readOnly: true, 
    },
    {
      name: "company",
      label: "Company",
      placeholder: "Enter company name",
      readOnly: true, 
    },
    {
      name: "hostName",
      label: "Host",
      placeholder: "Enter host name",
      readOnly: true, 
    },
    {
      name: "purpose",
      label: "Purpose",
      placeholder: "Enter purpose",
    },
    {
      name: "visitDate",
      label: "Visit Date",
      type: "datetime-local",
    },
  ] as const;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Request Appointment" : "Edit Appointment"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Fill out the form below to request an appointment."
              : "Update the appointment details below."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map((field) => (
              <FieldForm
                key={field.name}
                {...field}
                register={register}
                errors={errors}
              />
            ))}

            {isAdmin && mode === "edit" && (
              <FieldForm
                name="status"
                label="Status"
                as="select"
                register={register}
                errors={errors}
                options={[
                  { value: "pending", label: "Pending" },
                  { value: "approved", label: "Approved" },
                  { value: "declined", label: "Declined" },
                ]}
              />
            )}
          </div>

          <DialogFooter className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{mode === "add" ? "Request" : "Save"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
