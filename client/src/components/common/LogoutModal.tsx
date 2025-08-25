import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/common/LogoutButton";

interface LogoutModalProps {
  onConfirm: () => void;
  iconOnly?: boolean;
}

export const LogoutModal: React.FC<LogoutModalProps> = ({
  onConfirm,
  iconOnly = false,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <LogoutButton onClick={() => {}} iconOnly={iconOnly} />
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Logout</DialogTitle>
          <DialogDescription>
            Are you sure you want to sign out of your account?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-2">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="destructive" onClick={onConfirm}>
              Yes, Sign Out
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
