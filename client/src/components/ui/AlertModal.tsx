import React from "react";
import { X, CheckCircle, Info, AlertTriangle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

type AlertType = "success" | "info" | "warning" | "error";

interface AlertModalProps {
  isOpen: boolean;
  type?: AlertType;
  title?: string;
  message: string;
  confirmText?: string;
  onConfirm: () => void;
}

const alertConfig = {
  success: {
    color: "bg-green-600",
    icon: CheckCircle,
    defaultTitle: "Success",
    defaultText: "OK",
  },
  info: {
    color: "bg-blue-600",
    icon: Info,
    defaultTitle: "Information",
    defaultText: "OK",
  },
  warning: {
    color: "bg-yellow-500",
    icon: AlertTriangle,
    defaultTitle: "Warning",
    defaultText: "OK",
  },
  error: {
    color: "bg-red-600",
    icon: AlertCircle,
    defaultTitle: "Error",
    defaultText: "OK",
  },
};

const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  type = "info",
  title,
  message,
  confirmText,
  onConfirm,
}) => {
  const { color, icon: Icon, defaultTitle, defaultText } = alertConfig[type];

  return (
    <Dialog open={isOpen} onOpenChange={onConfirm}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex justify-between items-center">
          <DialogTitle>{title || defaultTitle}</DialogTitle>
        </DialogHeader>

        <div className="mt-2 flex items-start space-x-3">
          <p className="text-gray-700">{message}</p>
        </div>

        <DialogFooter className="mt-6 flex justify-end">
          <Button className={color} onClick={onConfirm}>
            {confirmText || defaultText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AlertModal;
