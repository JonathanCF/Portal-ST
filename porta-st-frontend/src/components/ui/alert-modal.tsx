import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from "lucide-react";

type ModalType = "success" | "error" | "warning" | "info";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: ModalType;
}

export function AlertModal({
  isOpen,
  onClose,
  title,
  message,
  type = "info",
}: AlertModalProps) {
  const icons = {
    success: <CheckCircle2 className="w-16 h-16 text-green-500" />,
    error: <XCircle className="w-16 h-16 text-red-500" />,
    warning: <AlertTriangle className="w-16 h-16 text-yellow-500" />,
    info: <AlertCircle className="w-16 h-16 text-blue-500" />,
  };

  const bgColors = {
    success: "bg-green-50",
    error: "bg-red-50",
    warning: "bg-yellow-50",
    info: "bg-blue-50",
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <div
          className={`flex flex-col items-center text-center p-6 ${bgColors[type]} rounded-t-lg -mt-6 -mx-6`}
        >
          {icons[type]}
          <DialogHeader className="mt-4">
            <DialogTitle className="text-2xl">{title}</DialogTitle>
          </DialogHeader>
        </div>

        <DialogDescription className="text-center text-base py-4">
          {message}
        </DialogDescription>

        <DialogFooter className="sm:justify-center">
          <Button onClick={onClose} className="w-full sm:w-auto">
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
