import React, { useState, useEffect } from "react";
import { FiPlus, FiEye, FiEdit2, FiTrash2, FiMusic } from "react-icons/fi";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CreateAffirmationModal from "@/components/modals/CreateAffirmationModal";
import EditAffirmationModal from "@/components/modals/EditAffirmationModal";
import DeleteAffirmationModal from "@/components/modals/DeleteAffirmationModal";
import AffirmationService from "@/services/affirmation.service";
import CategoryService from "@/services/category.service";
import type { Affirmation, Category } from "@/types";
import { toast } from "sonner";

interface CategoryResponse {
  success: boolean;
  data: {
    categories: Category[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

const ManageAffirmations = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAffirmation, setSelectedAffirmation] =
    useState<Affirmation | null>(null);
  const [affirmations, setAffirmations] = useState<Affirmation[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [affirmationsData, categoriesResponse] = await Promise.all([
        AffirmationService.getAllAffirmations(),
        CategoryService.getAllCategories(),
      ]);

      setAffirmations(Array.isArray(affirmationsData) ? affirmationsData : []);
      const categoriesData = (categoriesResponse as unknown as CategoryResponse)
        ?.data?.categories;
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (error) {
      toast.error("Failed to fetch data");
      console.error("Error fetching data:", error);
      setAffirmations([]);
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateAffirmation = async (data: {
    content: string;
    audioUrl?: string;
    categoryId?: string;
    isPremium: boolean;
  }) => {
    try {
      const newAffirmation = await AffirmationService.createAffirmation({
        content: data.content,
        audioUrl: data.audioUrl,
        categoryId: data.categoryId || "",
        isPremium: data.isPremium,
      });
      setAffirmations((prev) => [...prev, newAffirmation]);
      setIsCreateModalOpen(false);
      toast.success("Affirmation created successfully");
    } catch (error) {
      toast.error("Failed to create affirmation");
      console.error("Error creating affirmation:", error);
    }
  };

  const handleEditAffirmation = async (data: {
    content: string;
    audioUrl?: string;
    categoryId?: string;
    isPremium: boolean;
  }) => {
    if (!selectedAffirmation) return;

    try {
      const updatedAffirmation = await AffirmationService.updateAffirmation(
        selectedAffirmation.id,
        data
      );
      setAffirmations((prev) =>
        prev.map((a) =>
          a.id === selectedAffirmation.id ? updatedAffirmation : a
        )
      );
      setIsEditModalOpen(false);
      setSelectedAffirmation(null);
      toast.success("Affirmation updated successfully");
    } catch (error) {
      toast.error("Failed to update affirmation");
      console.error("Error updating affirmation:", error);
    }
  };

  const handleView = async (id: string) => {
    try {
      const affirmation = await AffirmationService.getAffirmationById(id);
      console.log("View affirmation:", affirmation);
      // TODO: Implement view modal or navigation
    } catch (error) {
      toast.error("Failed to fetch affirmation details");
      console.error("Error fetching affirmation:", error);
    }
  };

  const handleEdit = async (id: string) => {
    try {
      const affirmation = await AffirmationService.getAffirmationById(id);
      setSelectedAffirmation(affirmation);
      setIsEditModalOpen(true);
    } catch (error) {
      toast.error("Failed to fetch affirmation details");
      console.error("Error fetching affirmation:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const affirmation = await AffirmationService.getAffirmationById(id);
      setSelectedAffirmation(affirmation);
      setIsDeleteModalOpen(true);
    } catch (error) {
      toast.error("Failed to fetch affirmation details");
      console.error("Error fetching affirmation:", error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedAffirmation) return;

    try {
      await AffirmationService.deleteAffirmation(selectedAffirmation.id);
      setAffirmations((prev) =>
        prev.filter((a) => a.id !== selectedAffirmation.id)
      );
      setIsDeleteModalOpen(false);
      setSelectedAffirmation(null);
      toast.success("Affirmation deleted successfully");
    } catch (error) {
      toast.error("Failed to delete affirmation");
      console.error("Error deleting affirmation:", error);
    }
  };

  const handleBulkImport = () => {
    console.log("Bulk import");
  };

  // Filter affirmations based on search query, category, and status
  const filteredAffirmations = affirmations.filter((affirmation) => {
    const matchesSearch = affirmation.content
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All Categories" ||
      affirmation.categoryId === selectedCategory;
    const matchesStatus =
      selectedStatus === "All" ||
      (selectedStatus === "Premium" && affirmation.isPremium) ||
      (selectedStatus === "Free" && !affirmation.isPremium);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="p-6 bg-background flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-background">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Affirmations</h1>
        <div className="flex gap-2">
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-primary hover:bg-primary/90"
          >
            <FiPlus className="w-4 h-4 mr-2" />
            Add New
          </Button>
          {/* <Button
            onClick={handleBulkImport}
            variant="outline"
            className="border-primary text-primary hover:bg-primary/10"
          >
            Bulk Import
          </Button> */}
        </div>
      </div>

      <CreateAffirmationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateAffirmation}
        categories={categories}
      />

      <EditAffirmationModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedAffirmation(null);
        }}
        onSubmit={handleEditAffirmation}
        categories={categories}
        affirmation={selectedAffirmation}
      />

      <DeleteAffirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedAffirmation(null);
        }}
        onConfirm={handleConfirmDelete}
        affirmationContent={selectedAffirmation?.content}
      />

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <Input
          placeholder="Search affirmations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All Categories">All Categories</SelectItem>
            {Array.isArray(categories) &&
              categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Premium">Premium</SelectItem>
            <SelectItem value="Free">Free</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Content</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Audio</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAffirmations.map((affirmation) => (
              <TableRow key={affirmation.id}>
                <TableCell className="font-medium">
                  {affirmation.content}
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      affirmation.isPremium
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {affirmation.isPremium ? "Premium" : "Free"}
                  </span>
                </TableCell>
                <TableCell>
                  {affirmation.category?.name || "Uncategorized"}
                </TableCell>
                <TableCell>
                  {affirmation.audioUrl ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        window.open(affirmation.audioUrl, "_blank")
                      }
                    >
                      <FiMusic className="w-4 h-4" />
                    </Button>
                  ) : (
                    <span className="text-muted-foreground">No audio</span>
                  )}
                </TableCell>
                <TableCell>
                  {new Date(affirmation.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(affirmation.updatedAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleView(affirmation.id)}
                    >
                      <FiEye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(affirmation.id)}
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(affirmation.id)}
                    >
                      <FiTrash2 className="w-4 h-4" />
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
