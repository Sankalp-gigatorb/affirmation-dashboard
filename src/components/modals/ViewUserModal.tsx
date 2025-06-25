import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import UserService from "@/services/user.service";
import {
  FiEye,
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiUsers,
  FiMessageSquare,
  FiTarget,
} from "react-icons/fi";
import { FaCrown } from "react-icons/fa";

interface ViewUserModalProps {
  userId: string;
  trigger?: React.ReactNode;
}

const ViewUserModal: React.FC<ViewUserModalProps> = ({ userId, trigger }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    if (open && userId) {
      loadUserDetails();
    }
  }, [open, userId]);

  const loadUserDetails = async () => {
    setLoading(true);
    try {
      const data = await UserService.getUserById(userId);
      setUserData(data);
    } catch (error: any) {
      toast.error("Failed to load user details");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatGender = (gender: string) => {
    return gender.charAt(0).toUpperCase() + gender.slice(1);
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
            <FiEye className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {userData
              ? `${userData.firstName} ${userData.lastName}`
              : "User Details"}
            {userData?.isAdmin && (
              <FaCrown className="h-4 w-4 text-yellow-500" />
            )}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">Loading user details...</p>
          </div>
        ) : userData ? (
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-muted-foreground">
                Basic Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <FiUser className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <strong>Username:</strong> {userData.username}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FiMail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <strong>Email:</strong> {userData.email}
                  </span>
                </div>
                {userData.phone && (
                  <div className="flex items-center gap-2">
                    <FiPhone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      <strong>Phone:</strong> {userData.phone}
                    </span>
                  </div>
                )}
                {userData.gender && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm">
                      <strong>Gender:</strong> {formatGender(userData.gender)}
                    </span>
                  </div>
                )}
                {userData.dob && (
                  <div className="flex items-center gap-2">
                    <FiCalendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      <strong>Date of Birth:</strong> {formatDate(userData.dob)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Status & Subscription */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-muted-foreground">
                Status & Subscription
              </h3>
              <div className="flex items-center gap-4">
                <Badge variant={userData.isAdmin ? "default" : "secondary"}>
                  {userData.isAdmin ? "Admin" : "User"}
                </Badge>
                {userData.subscription && (
                  <Badge
                    variant={
                      userData.subscription.isActive ? "default" : "secondary"
                    }
                  >
                    {userData.subscription.plan}{" "}
                    {userData.subscription.isActive ? "Active" : "Inactive"}
                  </Badge>
                )}
                <span className="text-sm text-muted-foreground">
                  Member since {formatDate(userData.createdAt)}
                </span>
              </div>
            </div>

            {/* Statistics */}
            {userData._count && (
              <div className="space-y-4">
                <h3 className="font-semibold text-sm text-muted-foreground">
                  Activity Statistics
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center gap-2 p-3 bg-muted/50 rounded">
                    <FiMessageSquare className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-sm font-medium">
                        {userData._count.posts}
                      </p>
                      <p className="text-xs text-muted-foreground">Posts</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-muted/50 rounded">
                    <FiUsers className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-sm font-medium">
                        {userData._count.communities}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Communities
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-muted/50 rounded">
                    <FiTarget className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-sm font-medium">
                        {userData._count.affirmations}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Affirmations
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Subscription Details */}
            {userData.subscription && (
              <div className="space-y-4">
                <h3 className="font-semibold text-sm text-muted-foreground">
                  Subscription Details
                </h3>
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded">
                  <div>
                    <p className="text-sm font-medium">Plan</p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {userData.subscription.plan}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Status</p>
                    <p className="text-sm text-muted-foreground">
                      {userData.subscription.isActive ? "Active" : "Inactive"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Start Date</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(userData.subscription.startDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">End Date</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(userData.subscription.endDate)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default ViewUserModal;
