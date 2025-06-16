import React, { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FiPlus,
  FiUpload,
  FiSearch,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiStar,
} from "react-icons/fi";

// Mock data - replace with actual data from your API
const affirmations = [
  {
    id: 1,
    text: "I am capable of achieving great things",
    type: "Free",
    category: "Motivation",
    createdBy: "Admin",
    status: "Active",
  },
  {
    id: 2,
    text: "I choose to be confident and self-assured",
    type: "Paid",
    category: "Self-love",
    createdBy: "User",
    status: "Active",
  },
  {
    id: 3,
    text: "My body is healthy and strong",
    type: "Free",
    category: "Health",
    createdBy: "Admin",
    status: "Hidden",
  },
];

const categories = [
  "All Categories",
  "Self-love",
  "Motivation",
  "Health",
  "Success",
  "Relationships",
  "Career",
];

const ManageAffirmations = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const handleView = (id: number) => {
    console.log("View affirmation:", id);
  };

  const handleEdit = (id: number) => {
    console.log("Edit affirmation:", id);
  };

  const handleDelete = (id: number) => {
    console.log("Delete affirmation:", id);
  };

  const handleFeature = (id: number) => {
    console.log("Feature affirmation:", id);
  };

  const handleAddNew = () => {
    console.log("Add new affirmation");
  };

  const handleBulkImport = () => {
    console.log("Bulk import");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Manage Affirmations</h1>
        <div className="flex gap-2">
          <Button
            onClick={handleAddNew}
            className="bg-primary hover:bg-primary/90"
          >
            <FiPlus className="w-4 h-4 mr-2" />
            Add New
          </Button>
          <Button variant="outline" onClick={handleBulkImport}>
            <FiUpload className="w-4 h-4 mr-2" />
            Bulk Import
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search affirmations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Status</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Hidden">Hidden</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Title/Text</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {affirmations.map((affirmation) => (
              <TableRow key={affirmation.id}>
                <TableCell className="font-medium">{affirmation.id}</TableCell>
                <TableCell>{affirmation.text}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      affirmation.type === "Paid"
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {affirmation.type}
                  </span>
                </TableCell>
                <TableCell>{affirmation.category}</TableCell>
                <TableCell>{affirmation.createdBy}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      affirmation.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {affirmation.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleView(affirmation.id)}
                      className="hover:bg-primary/10 hover:text-primary"
                    >
                      <FiEye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(affirmation.id)}
                      className="hover:bg-primary/10 hover:text-primary"
                    >
                      <FiEdit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(affirmation.id)}
                      className="hover:bg-destructive/10 hover:text-destructive"
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleFeature(affirmation.id)}
                      className="hover:bg-primary/10 hover:text-primary"
                    >
                      <FiStar className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ManageAffirmations;
