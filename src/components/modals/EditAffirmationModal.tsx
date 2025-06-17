import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { Category, Affirmation } from "@/types";

interface EditAffirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    content: string;
    audioUrl?: string;
    categoryId?: string;
    isPremium: boolean;
  }) => void;
  categories: Category[];
  affirmation: Affirmation | null;
}

const EditAffirmationModal: React.FC<EditAffirmationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  categories,
  affirmation,
}) => {
  const [formData, setFormData] = React.useState({
    content: "",
    audioUrl: "",
    categoryId: "",
    isPremium: false,
  });

  useEffect(() => {
    if (affirmation) {
      setFormData({
        content: affirmation.content,
        audioUrl: affirmation.audioUrl || "",
        categoryId: affirmation.categoryId || "",
        isPremium: affirmation.isPremium,
      });
    }
  }, [affirmation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      audioUrl: formData.audioUrl || undefined,
      categoryId: formData.categoryId || undefined,
    });
  };

  if (!affirmation) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card">
        <DialogHeader>
          <DialogTitle>Edit Affirmation</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              placeholder="Enter your affirmation"
              required
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="audioUrl">Audio URL (optional)</Label>
            <Input
              id="audioUrl"
              type="url"
              value={formData.audioUrl}
              onChange={(e) =>
                setFormData({ ...formData, audioUrl: e.target.value })
              }
              placeholder="https://example.com/audio/affirmation.mp3"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category (optional)</Label>
            <Select
              value={formData.categoryId}
              onValueChange={(value) =>
                setFormData({ ...formData, categoryId: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isPremium"
              checked={formData.isPremium}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isPremium: checked })
              }
            />
            <Label htmlFor="isPremium">Premium Content</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditAffirmationModal;
