import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import CommunityService from "@/services/community.service";
import type { Community, UpdateCommunityData } from "@/types";
import { FiEdit } from "react-icons/fi";

interface EditCommunityModalProps {
  community: Community;
  onSuccess: () => void;
  trigger?: React.ReactNode;
}

const EditCommunityModal: React.FC<EditCommunityModalProps> = ({
  community,
  onSuccess,
  trigger,
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<UpdateCommunityData>({
    name: "",
    description: "",
    isPrivate: false,
  });

  useEffect(() => {
    if (community) {
      setFormData({
        name: community.name,
        description: community.description,
        isPrivate: community.isPrivate,
      });
    }
  }, [community]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await CommunityService.updateCommunity(community.id, formData);
      toast.success("Community updated successfully!");
      setOpen(false);
      onSuccess();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to update community"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    field: keyof UpdateCommunityData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-primary/10 hover:text-primary/80"
          >
            <FiEdit className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Community</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Community Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter community name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Enter community description"
              required
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="isPrivate"
              checked={formData.isPrivate}
              onCheckedChange={(checked) =>
                handleInputChange("isPrivate", checked)
              }
            />
            <Label htmlFor="isPrivate">Private Community</Label>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Community"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCommunityModal;
