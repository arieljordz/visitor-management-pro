import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { FieldForm } from "@/components/common/FieldForm";
import { useVisitorStore } from "@/stores/visitorStore";
import { useToast } from "@/hooks/use-toast";
import { Visitor } from "@/types/visitor";
import { createSchema } from "@/helpers/schemaHelpers";

// ---------------------------
// Schema
// ---------------------------
export const visitorSchema = createSchema({
  firstname: { type: "string", message: "First name is required" },
  middlename: { type: "optionalString" },
  lastname: { type: "string", message: "Last name is required" },
  email: { type: "email" },
  phone: { type: "phone" },
  address: { type: "string", message: "Address is required" },
  company: { type: "optionalString" },
});

type FormData = z.infer<typeof visitorSchema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  visitor?: Visitor | null;
  mode: "add" | "edit";
}

export const VisitorModal: React.FC<Props> = ({
  isOpen,
  onClose,
  visitor,
  mode,
}) => {
  const { addVisitor, updateVisitor, fetchVisitors } = useVisitorStore();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(visitorSchema),
  });

  // Reset form values when modal opens
  useEffect(() => {
    if (!isOpen) return;

    if (visitor && mode === "edit") {
      reset({
        firstname: visitor.firstname,
        middlename: visitor.middlename ?? "",
        lastname: visitor.lastname,
        email: visitor.email,
        phone: visitor.phone ?? "",
        address: visitor.address ?? "",
        company: visitor.company ?? "",
      });
    } else {
      reset({
        firstname: "",
        middlename: "",
        lastname: "",
        email: "",
        phone: "",
        address: "",
        company: "",
      });
    }
  }, [isOpen, visitor, mode, reset]);

  const onSubmit = async (data: FormData) => {
    const payload: any = {
      ...data,
      company: data.company ?? "",
    };

    try {
      if (mode === "add") {
        await addVisitor(payload);
        toast({ title: "Visitor added successfully" });
      } else if (mode === "edit" && visitor) {
        await updateVisitor({ ...visitor, ...data });
        toast({ title: "Visitor updated successfully" });
      }
      await fetchVisitors();
      onClose();
    } catch {
      toast({ title: "Failed to save visitor", variant: "destructive" });
    }
  };

  // ---------------------------
  // Fields Config
  // ---------------------------
  const fields = [
    { name: "firstname", label: "First Name", placeholder: "Enter first name" },
    {
      name: "middlename",
      label: "Middle Name",
      placeholder: "Enter middle name",
    },
    { name: "lastname", label: "Last Name", placeholder: "Enter last name" },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "Enter email",
    },
    { name: "phone", label: "Phone", placeholder: "Enter phone number" },
    { name: "address", label: "Address", placeholder: "Enter address" },
    { name: "company", label: "Company", placeholder: "Enter company name" },
  ] as const;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add Visitor" : "Edit Visitor"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Fill out the form below to add a new visitor."
              : "Update the visitor details below."}
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
          </div>

          <DialogFooter className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{mode === "add" ? "Add" : "Save"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
