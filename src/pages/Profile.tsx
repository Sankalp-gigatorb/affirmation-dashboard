import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AuthService from "@/services/auth.service";
import UserService from "@/services/user.service";
import { toast } from "sonner";

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone?: string;
  gender?: string;
  dob?: string;
  isAdmin: boolean;
}

const Profile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
    gender: "",
    dob: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setIsLoadingProfile(true);
      const userProfile = await UserService.getCurrentUserProfile();
      setProfile(userProfile);
      setFormData({
        firstName: userProfile.firstName || "",
        lastName: userProfile.lastName || "",
        username: userProfile.username || "",
        email: userProfile.email || "",
        phone: userProfile.phone || "",
        gender: userProfile.gender || "",
        dob: userProfile.dob
          ? new Date(userProfile.dob).toISOString().split("T")[0]
          : "",
      });
    } catch (error) {
      console.error("Error loading profile:", error);
      toast.error("Failed to load profile");
      // Fallback to local storage data
      const user = AuthService.getCurrentUser();
      if (user) {
        setProfile(user);
        setFormData({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          username: user.username || "",
          email: user.email || "",
          phone: user.phone || "",
          gender: user.gender || "",
          dob: user.dob ? new Date(user.dob).toISOString().split("T")[0] : "",
        });
      }
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      gender: value,
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Format the date properly for the API
      const updateData = {
        ...formData,
        dob: formData.dob
          ? new Date(formData.dob + "T00:00:00.000Z").toISOString()
          : undefined,
      };

      const updatedProfile = await UserService.updateCurrentUserProfile(
        updateData
      );
      setProfile(updatedProfile);
      setIsEditing(false);

      // Update local storage with new data
      const currentUser = AuthService.getCurrentUser();
      if (currentUser) {
        const updatedUser = { ...currentUser, ...updatedProfile };
        localStorage.setItem("user_data", JSON.stringify(updatedUser));
      }

      toast.success("Profile updated successfully");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.error || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        username: profile.username || "",
        email: profile.email || "",
        phone: profile.phone || "",
        gender: profile.gender || "",
        dob: profile.dob
          ? new Date(profile.dob).toISOString().split("T")[0]
          : "",
      });
    }
    setIsEditing(false);
  };

  if (isLoadingProfile) {
    return (
      <div className="p-6">
        <div className="text-center">Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-6">
        <div className="text-center text-destructive">
          Failed to load profile
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Profile Information</span>
              {!isEditing && (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  size="sm"
                >
                  Edit Profile
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={handleSelectChange}
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  id="dob"
                  name="dob"
                  type="date"
                  value={formData.dob}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label>Role</Label>
                <Input
                  value={profile.isAdmin ? "Admin" : "User"}
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
