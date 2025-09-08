// VisitorCreateModal.tsx
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

import type { Visitor } from "@/types/visitor.types";

interface VisitorCreateModalProps {
  isOpen: boolean;
  editingVisitor: Visitor | null;
  onCancel: () => void;
  onSave: (data: Partial<Visitor>) => void;
}

const VisitorCreateModal: React.FC<VisitorCreateModalProps> = ({
  isOpen,
  editingVisitor,
  onCancel,
  onSave,
}) => {
  const [formData, setFormData] = useState<Partial<Visitor>>({
    firstname: "",
    middlename: "",
    lastname: "",
    email: "",
    phone: "",
    address: "",
    company: "",
  });

  // Prefill on edit
  useEffect(() => {
    if (editingVisitor) {
      setFormData({
        firstname: editingVisitor.firstname,
        middlename: editingVisitor.middlename,
        lastname: editingVisitor.lastname,
        email: editingVisitor.email,
        phone: editingVisitor.phone,
        address: editingVisitor.address,
        company: editingVisitor.company,
      });
    } else {
      setFormData({
        firstname: "",
        middlename: "",
        lastname: "",
        email: "",
        phone: "",
        address: "",
        company: "",
      });
    }
  }, [editingVisitor]);

  const handleChange = (key: keyof Visitor, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const fields = [
    { key: "firstname", label: "First Name", type: "text", required: true },
    { key: "middlename", label: "Middle Name", type: "text", required: false },
    { key: "lastname", label: "Last Name", type: "text", required: true },
    { key: "email", label: "Email", type: "email", required: true },
    { key: "phone", label: "Phone", type: "text", required: true },
    { key: "address", label: "Address", type: "text", required: true },
    { key: "company", label: "Company", type: "text", required: false },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent
        className="sm:max-w-md"
        onInteractOutside={(e) => e.preventDefault()} // prevent accidental close
      >
        <DialogHeader>
          <DialogTitle>
            {editingVisitor ? "Edit Visitor" : "Create New Visitor"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 🔹 Dynamic Input Fields */}
          {fields.map(({ key, label, type, required }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
              </label>
              <Input
                type={type}
                value={(formData as any)[key] ?? ""}
                onChange={(e) =>
                  handleChange(key as keyof Visitor, e.target.value)
                }
                placeholder={`Enter ${label.toLowerCase()}`}
                required={required}
              />
            </div>
          ))}

          {/* 🔹 Footer */}
          <DialogFooter className="mt-6 flex justify-end space-x-3">
            <Button variant="outline" type="button" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" className="flex items-center space-x-2">
              <Save className="h-4 w-4" />
              <span>{editingVisitor ? "Update" : "Save"}</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default VisitorCreateModal;
