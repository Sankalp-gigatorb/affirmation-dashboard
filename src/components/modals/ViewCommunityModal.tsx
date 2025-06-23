import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Community } from "@/types";
import { FiEye, FiUsers, FiLock, FiGlobe } from "react-icons/fi";

interface ViewCommunityModalProps {
  community: Community;
  trigger?: React.ReactNode;
}

const ViewCommunityModal: React.FC<ViewCommunityModalProps> = ({
  community,
  trigger,
}) => {
  const [open, setOpen] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const memberCount = community.members?.length || 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-primary/10 hover:text-primary/80"
          >
            <FiEye className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {community.name}
            {community.isPrivate ? (
              <FiLock className="h-4 w-4 text-muted-foreground" />
            ) : (
              <FiGlobe className="h-4 w-4 text-muted-foreground" />
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Community Info */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground mb-2">
                Description
              </h3>
              <p className="text-sm">
                {community.description || "No description provided"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground mb-1">
                  Created By
                </h3>
                <p className="text-sm">
                  {community.createdBy
                    ? `${community.createdBy.firstName} ${community.createdBy.lastName}`
                    : "Unknown"}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground mb-1">
                  Created
                </h3>
                <p className="text-sm">{formatDate(community.createdAt)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground mb-1">
                  Last Updated
                </h3>
                <p className="text-sm">{formatDate(community.updatedAt)}</p>
              </div>
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground mb-1">
                  Posts
                </h3>
                <p className="text-sm">{community.posts?.length || 0} posts</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant={community.isPrivate ? "secondary" : "default"}>
                {community.isPrivate ? "Private" : "Public"}
              </Badge>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <FiUsers className="h-4 w-4" />
                <span>{memberCount} members</span>
              </div>
            </div>
          </div>

          {/* Members List */}
          <div>
            <h3 className="font-semibold text-sm text-muted-foreground mb-3">
              Members
            </h3>
            {memberCount > 0 ? (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {community.members?.slice(0, 10).map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-2 bg-muted/50 rounded"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {member.user?.username || `User ${member.userId}`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Joined {formatDate(member.joinedAt)}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {member.role}
                    </Badge>
                  </div>
                ))}
                {memberCount > 10 && (
                  <p className="text-xs text-muted-foreground text-center">
                    +{memberCount - 10} more members
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No members yet</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewCommunityModal;
