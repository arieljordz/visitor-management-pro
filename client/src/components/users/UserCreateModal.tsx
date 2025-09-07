import React, { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { UserRole } from "@/enums/enums";
import type { User } from "@/types/user.types";

interface UserCreateModalProps {
  isOpen: boolean;
  editingUser: User | null;
  onCancel: () => void;
  onSave: (data: Partial<User>) => void;
}

const UserCreateModal: React.FC<UserCreateModalProps> = ({
  isOpen,
  editingUser,
  onCancel,
  onSave,
}) => {
  const [formData, setFormData] = useState<Partial<User>>({
    name: "",
    email: "",
    role: "",
  });

  // Prefill on edit
  useEffect(() => {
    if (editingUser) {
      setFormData({
        name: editingUser.name,
        email: editingUser.email,
        role: editingUser.role,
      });
    } else {
      setFormData({ name: "", email: "", role: "" });
    }
  }, [editingUser]);

  const handleChange = (key: keyof User, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const fields = [
    { key: "name", label: "Full Name", type: "text", placeholder: "Enter name" },
    { key: "email", label: "Email", type: "email", placeholder: "Enter email" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent
        className="sm:max-w-md"
        onInteractOutside={(e) => e.preventDefault()} // prevent accidental close
      >
        <DialogHeader>
          <DialogTitle>
            {editingUser ? "Edit User" : "Create New User"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 🔹 Dynamic Input Fields */}
          {fields.map(({ key, label, type, placeholder }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
              </label>
              <Input
                type={type}
                value={(formData as any)[key] ?? ""}
                onChange={(e) => handleChange(key as keyof User, e.target.value)}
                placeholder={placeholder}
                required
              />
            </div>
          ))}

          {/* 🔹 Role Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <Select
              value={formData.role ?? ""}
              onValueChange={(value) => handleChange("role", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(UserRole).map((role) => (
                  <SelectItem key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 🔹 Footer */}
          <DialogFooter className="mt-6 flex justify-end space-x-3">
            <Button variant="outline" type="button" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" className="flex items-center space-x-2">
              <Save className="h-4 w-4" />
              <span>{editingUser ? "Update" : "Save"}</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserCreateModal;
