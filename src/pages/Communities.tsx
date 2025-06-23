import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  FiEye,
  FiTrash2,
  FiEdit,
  FiSearch,
  FiUsers,
  FiLock,
  FiGlobe,
} from "react-icons/fi";
import CommunityService from "@/services/community.service";
import type { Community } from "@/types";
import CreateCommunityModal from "@/components/modals/CreateCommunityModal";
import EditCommunityModal from "@/components/modals/EditCommunityModal";
import DeleteCommunityModal from "@/components/modals/DeleteCommunityModal";
import ViewCommunityModal from "@/components/modals/ViewCommunityModal";

const Communities = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadCommunities();
  }, []);

  const loadCommunities = async () => {
    setLoading(true);
    try {
      const data = await CommunityService.getAllCommunities();
      console.log(data, "data");

      setCommunities(data);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to load communities"
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredCommunities = communities.filter(
    (community) =>
      community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      community.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleJoinCommunity = async (communityId: string) => {
    try {
      await CommunityService.joinCommunity(communityId);
      toast.success("Successfully joined community!");
      loadCommunities(); // Refresh to update member count
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to join community");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-muted-foreground">
          Communities
        </h1>
        <CreateCommunityModal onSuccess={loadCommunities} />
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search communities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-muted-foreground">
                Community Name
              </TableHead>
              <TableHead className="text-muted-foreground">
                Description
              </TableHead>
              <TableHead className="text-muted-foreground">Type</TableHead>
              <TableHead className="text-muted-foreground">
                Created By
              </TableHead>
              <TableHead className="text-muted-foreground">Created</TableHead>
              <TableHead className="text-muted-foreground">Members</TableHead>
              <TableHead className="text-right text-muted-foreground">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Loading communities...
                </TableCell>
              </TableRow>
            ) : filteredCommunities.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  {searchTerm
                    ? "No communities found matching your search."
                    : "No communities found."}
                </TableCell>
              </TableRow>
            ) : (
              filteredCommunities.map((community) => (
                <TableRow key={community.id}>
                  <TableCell className="font-medium text-foreground/80">
                    <div className="flex items-center gap-2">
                      {community.name}
                      {community.isPrivate ? (
                        <FiLock className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <FiGlobe className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-foreground/70 max-w-xs truncate">
                    {community.description}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={community.isPrivate ? "secondary" : "default"}
                    >
                      {community.isPrivate ? "Private" : "Public"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-foreground/70">
                    {community.createdBy
                      ? `${community.createdBy.firstName} ${community.createdBy.lastName}`
                      : "Unknown"}
                  </TableCell>
                  <TableCell className="text-foreground/70">
                    {formatDate(community.createdAt)}
                  </TableCell>
                  <TableCell className="text-foreground/70">
                    <div className="flex items-center gap-1">
                      <FiUsers className="h-4 w-4" />
                      <span>{community.members?.length || 0}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <ViewCommunityModal
                        community={community}
                        trigger={
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-primary/10 hover:text-primary/80"
                          >
                            <FiEye className="h-4 w-4" />
                          </Button>
                        }
                      />
                      <EditCommunityModal
                        community={community}
                        onSuccess={loadCommunities}
                        trigger={
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-primary/10 hover:text-primary/80"
                          >
                            <FiEdit className="h-4 w-4" />
                          </Button>
                        }
                      />
                      <DeleteCommunityModal
                        community={community}
                        onSuccess={loadCommunities}
                        trigger={
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-destructive/10 hover:text-destructive/80"
                          >
                            <FiTrash2 className="h-4 w-4" />
                          </Button>
                        }
                      />
                      {/* <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleJoinCommunity(community.id)}
                        className="hover:bg-primary/10 hover:text-primary/80"
                      >
                        Join
                      </Button> */}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Communities;
