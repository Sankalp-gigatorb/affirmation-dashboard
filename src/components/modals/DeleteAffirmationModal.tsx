import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteAffirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  affirmationContent?: string;
}

const DeleteAffirmationModal: React.FC<DeleteAffirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  affirmationContent,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Affirmation</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this affirmation?
            {affirmationContent && (
              <div className="mt-2 p-3 bg-muted rounded-md">
                <p className="text-sm text-muted-foreground">
                  {affirmationContent}
                </p>
              </div>
            )}
            <p className="mt-2 text-sm text-destructive">
              This action cannot be undone.
            </p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteAffirmationModal;
