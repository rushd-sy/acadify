import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './dialog';

type FormDialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  children: React.ReactNode;
};

export function FormDialog({
  open,
  onClose,
  title,
  description,
  children,
}: FormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {children}
      </DialogContent>
    </Dialog>
  );
}
