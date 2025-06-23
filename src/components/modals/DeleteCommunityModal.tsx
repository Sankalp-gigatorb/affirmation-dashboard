import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import CommunityService from "@/services/community.service";
import type { Community } from "@/types";
import { FiTrash2 } from "react-icons/fi";

interface DeleteCommunityModalProps {
  community: Community;
  onSuccess: () => void;
  trigger?: React.ReactNode;
}

const DeleteCommunityModal: React.FC<DeleteCommunityModalProps> = ({
  community,
  onSuccess,
  trigger,
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);

    try {
      await CommunityService.deleteCommunity(community.id);
      toast.success("Community deleted successfully!");
      setOpen(false);
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete community");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-destructive/10 hover:text-destructive/80"
          >
            <FiTrash2 className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Community</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Are you sure you want to delete the community "{community.name}"? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete Community"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteCommunityModal; 