// AppointmentCreateModal.tsx
import React, { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type {
  Appointment,
  AppointmentFormData,
} from "@/types/appointment.types";
import { Visitor } from "@/types/visitor.types";

interface AppointmentCreateModalProps {
  isOpen: boolean;
  editingAppointment: Appointment | null;
  visitors: Visitor[];
  onCancel: () => void;
  onSave: (appointment: AppointmentFormData) => void | Promise<void>;
}

const AppointmentCreateModal: React.FC<AppointmentCreateModalProps> = ({
  isOpen,
  editingAppointment,
  visitors,
  onCancel,
  onSave,
}) => {
  const [formData, setFormData] = useState<AppointmentFormData>({
    visitorId: "",
    purpose: "",
    visitDate: "",
    status: "pending" as "pending" | "approved" | "declined",
  });

  // Prefill when editing
  useEffect(() => {
    if (editingAppointment) {
      setFormData({
        visitorId: editingAppointment.visitorId.id, // ✅ store id only
        purpose: editingAppointment.purpose,
        visitDate: editingAppointment.visitDate.split("T")[0], // ✅ date only
        status: editingAppointment.status,
      });
    } else {
      setFormData({
        visitorId: "",
        purpose: "",
        visitDate: "",
        status: "pending",
      });
    }
  }, [editingAppointment]);

  const handleChange = (key: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent
        className="sm:max-w-md"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>
            {editingAppointment ? "Edit Appointment" : "Create New Appointment"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 🔹 Select Visitor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Visitor
            </label>
            <Select
              value={formData.visitorId}
              onValueChange={(val) => handleChange("visitorId", val)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a visitor" />
              </SelectTrigger>
              <SelectContent>
                {visitors.map((v) => (
                  <SelectItem key={v.id} value={v.id}>
                    {v.fullname}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 🔹 Purpose */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Purpose
            </label>
            <Input
              type="text"
              value={formData.purpose}
              onChange={(e) => handleChange("purpose", e.target.value)}
              placeholder="Enter purpose of visit"
              required
            />
          </div>

          {/* 🔹 Visit Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Visit Date
            </label>
            <Input
              type="date"
              value={formData.visitDate}
              onChange={(e) => handleChange("visitDate", e.target.value)}
              required
            />
          </div>

          {/* 🔹 Status (only on edit) */}
          {editingAppointment && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <Select
                value={formData.status}
                onValueChange={(val) =>
                  handleChange(
                    "status",
                    val as "pending" | "approved" | "declined"
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="declined">Declined</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* 🔹 Footer */}
          <DialogFooter className="mt-6 flex justify-end space-x-3">
            <Button variant="outline" type="button" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" className="flex items-center space-x-2">
              <Save className="h-4 w-4" />
              <span>{editingAppointment ? "Update" : "Save"}</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentCreateModal;
