import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import UserService from "@/services/user.service";
import { FiUsers, FiEdit, FiTrash2 } from "react-icons/fi";

interface BulkUserOperationsModalProps {
  selectedUsers: string[];
  onSuccess: () => void;
  trigger?: React.ReactNode;
}

const BulkUserOperationsModal: React.FC<BulkUserOperationsModalProps> = ({
  selectedUsers,
  onSuccess,
  trigger,
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [operation, setOperation] = useState<"update" | "delete">("update");
  const [updateData, setUpdateData] = useState({
    isAdmin: false,
    gender: "no_change",
  });

  const handleBulkUpdate = async () => {
    if (selectedUsers.length === 0) {
      toast.error("Please select users first");
      return;
    }

    setLoading(true);
    try {
      const dataToUpdate: Partial<typeof updateData> = {
        isAdmin: updateData.isAdmin,
      };

      if (updateData.gender !== "no_change") {
        dataToUpdate.gender = updateData.gender;
      }

      const result = await UserService.bulkUpdateUsers({
        userIds: selectedUsers,
        updateData: dataToUpdate,
      });
      toast.success(result.message);
      setOpen(false);
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update users");
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedUsers.length === 0) {
      toast.error("Please select users first");
      return;
    }

    setLoading(true);
    try {
      const result = await UserService.bulkDeleteUsers({
        userIds: selectedUsers,
      });
      toast.success(result.message);
      setOpen(false);
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete users");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (operation === "update") {
      handleBulkUpdate();
    } else {
      handleBulkDelete();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="gap-2">
            <FiUsers className="h-4 w-4" />
            Bulk Operations
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Bulk User Operations</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Operation Selection */}
          <div className="space-y-4">
            <Label>Operation Type</Label>
            <div className="flex gap-4">
              <Button
                variant={operation === "update" ? "default" : "outline"}
                onClick={() => setOperation("update")}
                className="flex-1"
              >
                <FiEdit className="h-4 w-4 mr-2" />
                Bulk Update
              </Button>
              <Button
                variant={operation === "delete" ? "destructive" : "outline"}
                onClick={() => setOperation("delete")}
                className="flex-1"
              >
                <FiTrash2 className="h-4 w-4 mr-2" />
                Bulk Delete
              </Button>
            </div>
          </div>

          {/* Selected Users Count */}
          <div className="p-4 bg-muted/50 rounded">
            <p className="text-sm">
              <strong>{selectedUsers.length}</strong> users selected
            </p>
          </div>

          {/* Update Options */}
          {operation === "update" && (
            <div className="space-y-4">
              <Label>Update Options</Label>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isAdmin"
                  checked={updateData.isAdmin}
                  onCheckedChange={(checked) =>
                    setUpdateData((prev) => ({ ...prev, isAdmin: checked }))
                  }
                />
                <Label htmlFor="isAdmin">Make Admin</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={updateData.gender}
                  onValueChange={(value) =>
                    setUpdateData((prev) => ({ ...prev, gender: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no_change">No Change</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Delete Warning */}
          {operation === "delete" && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded">
              <p className="text-sm text-destructive">
                <strong>Warning:</strong> This will permanently delete{" "}
                {selectedUsers.length} users and all their associated data
                including posts, comments, and communities. This action cannot
                be undone.
              </p>
            </div>
          )}

          {/* Action Buttons */}
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
              variant={operation === "delete" ? "destructive" : "default"}
              onClick={handleSubmit}
              disabled={loading || selectedUsers.length === 0}
            >
              {loading
                ? "Processing..."
                : operation === "update"
                ? "Update Users"
                : "Delete Users"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BulkUserOperationsModal;
