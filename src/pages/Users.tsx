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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  FiEye,
  FiTrash2,
  FiEdit,
  FiSearch,
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiUsers,
  FiMessageSquare,
  FiTarget,
  FiToggleRight,
} from "react-icons/fi";
import { FaCrown } from "react-icons/fa";
import UserService from "@/services/user.service";
import CreateUserModal from "@/components/modals/CreateUserModal";
import EditUserModal from "@/components/modals/EditUserModal";
import DeleteUserModal from "@/components/modals/DeleteUserModal";
import ViewUserModal from "@/components/modals/ViewUserModal";

const Users = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState<any>(null);
  const [filters, setFilters] = useState({
    search: "",
    isAdmin: "all",
    gender: "all",
    hasSubscription: "all",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    loadUsers();
    loadStatistics();
  }, [pagination.page, pagination.limit, filters]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const params: any = {
        page: pagination.page,
        limit: pagination.limit,
      };

      if (filters.search) params.search = filters.search;
      if (filters.isAdmin !== "all")
        params.isAdmin = filters.isAdmin === "true";
      if (filters.gender !== "all") params.gender = filters.gender;
      if (filters.hasSubscription !== "all")
        params.hasSubscription = filters.hasSubscription === "true";

      const response = await UserService.getAllUsers(params);
      setUsers(response.users);
      setPagination((prev) => ({
        ...prev,
        total: response.pagination.total,
        totalPages: response.pagination.totalPages,
      }));
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const stats = await UserService.getUserStatistics();
      setStatistics(stats);
    } catch (error: any) {
      console.error("Failed to load statistics:", error);
    }
  };

  const handleToggleAdmin = async (userId: string) => {
    try {
      await UserService.toggleAdminStatus(userId);
      toast.success("Admin status updated successfully!");
      loadUsers();
      loadStatistics();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to update admin status"
      );
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatGender = (gender: string) => {
    return gender.charAt(0).toUpperCase() + gender.slice(1);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-muted-foreground">
          User Management
        </h1>
        <CreateUserModal onSuccess={loadUsers} />
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <FiUsers className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.totalUsers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Admin Users</CardTitle>
              <FaCrown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.adminUsers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                With Subscription
              </CardTitle>
              <FiTarget className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statistics.usersWithSubscription}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                New This Month
              </CardTitle>
              <FiUser className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statistics.newUsersThisMonth}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search users..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          value={filters.isAdmin}
          onValueChange={(value) => handleFilterChange("isAdmin", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Admin Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="true">Admin</SelectItem>
            <SelectItem value="false">User</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filters.gender}
          onValueChange={(value) => handleFilterChange("gender", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filters.hasSubscription}
          onValueChange={(value) =>
            handleFilterChange("hasSubscription", value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Subscription" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="true">With Subscription</SelectItem>
            <SelectItem value="false">Without Subscription</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Users Table */}
      <div className="rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-muted-foreground">User</TableHead>
              <TableHead className="text-muted-foreground">Contact</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-muted-foreground">Activity</TableHead>
              <TableHead className="text-muted-foreground">Joined</TableHead>
              <TableHead className="text-right text-muted-foreground">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Loading users...
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {user.isAdmin && (
                          <FaCrown className="h-4 w-4 text-yellow-500" />
                        )}
                        <div>
                          <p className="font-medium">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            @{user.username}
                          </p>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <FiMail className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{user.email}</span>
                      </div>
                      {user.phone && (
                        <div className="flex items-center gap-2">
                          <FiPhone className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{user.phone}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Badge variant={user.isAdmin ? "default" : "secondary"}>
                        {user.isAdmin ? "Admin" : "User"}
                      </Badge>
                      {user.subscription && (
                        <Badge
                          variant={
                            user.subscription.isActive ? "default" : "secondary"
                          }
                          className="ml-1"
                        >
                          {user.subscription.plan}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {user._count && (
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <FiMessageSquare className="h-3 w-3" />
                          <span>{user._count.posts}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FiUsers className="h-3 w-3" />
                          <span>{user._count.communities}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FiTarget className="h-3 w-3" />
                          <span>{user._count.affirmations}</span>
                        </div>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(user.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <ViewUserModal
                        userId={user.id}
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
                      <EditUserModal
                        userId={user.id}
                        userData={user}
                        onSuccess={loadUsers}
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
                      {/* <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleAdmin(user.id)}
                        className="hover:bg-primary/10 hover:text-primary/80"
                        title={user.isAdmin ? "Remove Admin" : "Make Admin"}
                      >
                        <FiToggleRight className="h-4 w-4" />
                      </Button> */}
                      <DeleteUserModal
                        userId={user.id}
                        userName={`${user.firstName} ${user.lastName}`}
                        onSuccess={loadUsers}
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
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
            {pagination.total} users
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
              }
              disabled={pagination.page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
              }
              disabled={pagination.page === pagination.totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
