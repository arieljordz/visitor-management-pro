import React from "react";
import { X, Check, Trash, LogOut, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

type ActionType = "logout" | "delete" | "archive" | "custom";

interface ActionConfirmModalProps {
  isOpen: boolean;
  type?: ActionType;
  message: string;
  confirmText?: string; // optional override
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
}

const actionConfig = {
  logout: {
    color: "bg-yellow-500 hover:bg-yellow-600",
    icon: LogOut,
    defaultText: "Logout",
    defaultTitle: "Logout Confirmation",
  },
  delete: {
    color: "bg-red-600 hover:bg-red-700",
    icon: Trash,
    defaultText: "Delete",
    defaultTitle: "Delete Confirmation",
  },
  archive: {
    color: "bg-blue-600 hover:bg-blue-700",
    icon: Archive,
    defaultText: "Archive",
    defaultTitle: "Archive Confirmation",
  },
  custom: {
    color: "bg-gray-600 hover:bg-gray-700",
    icon: Check,
    defaultText: "Confirm",
    defaultTitle: "Confirmation",
  },
};

const ActionConfirmModal: React.FC<ActionConfirmModalProps> = ({
  isOpen,
  type = "custom",
  message,
  confirmText,
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  title,
}) => {
  const { color, icon: Icon, defaultText, defaultTitle } = actionConfig[type];

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex justify-between items-center">
          <DialogTitle>{title || defaultTitle}</DialogTitle>
        </DialogHeader>

        <div className="mt-2 text-gray-700">{message}</div>

        <DialogFooter className="mt-6 flex justify-end space-x-3">
          <Button variant="outline" onClick={onCancel}>
            {cancelText}
          </Button>
          <Button className={`${color} flex items-center space-x-2`} onClick={onConfirm}>
            <Icon className="h-4 w-4" />
            <span>{confirmText || defaultText}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ActionConfirmModal;
