import React, { useState } from "react";
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
import type { CreateCommunityData } from "@/types";

interface CreateCommunityModalProps {
  onSuccess: () => void;
  trigger?: React.ReactNode;
}

const CreateCommunityModal: React.FC<CreateCommunityModalProps> = ({
  onSuccess,
  trigger,
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateCommunityData>({
    name: "",
    description: "",
    isPrivate: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await CommunityService.createCommunity(formData);
      toast.success("Community created successfully!");
      setOpen(false);
      setFormData({ name: "", description: "", isPrivate: false });
      onSuccess();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to create community"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    field: keyof CreateCommunityData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-primary hover:bg-primary/90">
            Create Community
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Community</DialogTitle>
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
              placeholder="Enter community description (optional)"
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
              {loading ? "Creating..." : "Create Community"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCommunityModal;
