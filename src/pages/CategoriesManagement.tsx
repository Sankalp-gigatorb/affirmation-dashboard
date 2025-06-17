import React, { useState, useEffect } from "react";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CreateCategoryModal from "@/components/modals/CreateCategoryModal";
import EditCategoryModal from "@/components/modals/EditCategoryModal";
import DeleteCategoryModal from "@/components/modals/DeleteCategoryModal";
import type {
  Category as UICategory,
  CategoryFormData,
} from "../types/category";
import type { Category as APICategory } from "../types";
import CategoryService from "@/services/category.service";
import { toast } from "sonner";

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface APIResponse<T> {
  success: boolean;
  data: T;
}

interface CategoriesResponse {
  categories: APICategory[];
  pagination: PaginationInfo;
}

const CategoriesManagement = () => {
  const [categories, setCategories] = useState<UICategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<UICategory | null>(
    null
  );

  // console.log(selectedCategory, "selectedCategory"); 

  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  const mapAPICategoryToUICategory = (
    apiCategory: APICategory
  ): UICategory => ({
    id: apiCategory.id,
    name: apiCategory.name,
    postCount:
      (apiCategory._count?.posts || 0) +
      (apiCategory._count?.communityPosts || 0),
    affirmations: apiCategory._count?.affirmations || 0,
    description: apiCategory.description,
    isPremium: apiCategory.isPremium,
  });

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response =
        (await CategoryService.getAllCategories()) as unknown as APIResponse<CategoriesResponse>;
      if (response.success) {
        setCategories(response.data.categories.map(mapAPICategoryToUICategory));
        setPagination(response.data.pagination);
      } else {
        toast.error("Failed to fetch categories");
      }
    } catch (error) {
      toast.error("Failed to fetch categories");
      console.error("Error fetching categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateCategory = async (data: CategoryFormData) => {
    try {
      const response = (await CategoryService.createCategory({
        name: data.name,
        description: data.description,
        isPremium: data.isPremium,
      })) as unknown as APIResponse<APICategory>;

      if (response.success) {
        setCategories([
          ...categories,
          mapAPICategoryToUICategory(response.data),
        ]);
        setIsCreateModalOpen(false);
        toast.success("Category created successfully");
      } else {
        toast.error("Failed to create category");
      }
    } catch (error) {
      toast.error("Failed to create category");
      console.error("Error creating category:", error);
    }
  };

  const handleEditCategory = async (data: CategoryFormData) => {
    // console.log(selectedCategory);

    if (selectedCategory) {
      try {
        const response = (await CategoryService.updateCategory(
          selectedCategory.id.toString(),
          {
            name: data.name,
            description: data.description,
            isPremium: data.isPremium,
          }
        )) as unknown as APIResponse<APICategory>;

        if (response.success) {
          setCategories(
            categories.map((cat) =>
              cat.id === selectedCategory.id
                ? mapAPICategoryToUICategory(response.data)
                : cat
            )
          );
          setIsEditModalOpen(false);
          toast.success("Category updated successfully");
        } else {
          toast.error("Failed to update category");
        }
      } catch (error) {
        toast.error("Failed to update category");
        console.error("Error updating category:", error);
      }
    }
  };

  const handleDeleteCategory = async () => {
    if (selectedCategory) {
      try {
        await CategoryService.deleteCategory(selectedCategory.id.toString());
        setCategories(
          categories.filter((cat) => cat.id !== selectedCategory.id)
        );
        setSelectedCategory(null);
        setIsDeleteModalOpen(false);
        toast.success("Category deleted successfully");
      } catch (error) {
        toast.error("Failed to delete category");
        console.error("Error deleting category:", error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-background flex items-center justify-center">
        <div className="text-lg">Loading categories...</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-background">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Categories Management</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          Add New Category
        </Button>
      </div>

      <div className="bg-card rounded-lg shadow border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Name</TableHead>
              <TableHead>Posts</TableHead>
              <TableHead>affirmations</TableHead>
              <TableHead>Is Premium</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>{category.postCount}</TableCell>
                <TableCell>{category.affirmations}</TableCell>
                <TableCell>
                  {category.isPremium ? "premium" : "non-premium"}
                </TableCell>
                <TableCell>{category.description}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    className="mr-2"
                    onClick={() => {
                      setSelectedCategory(category);
                      setIsEditModalOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setSelectedCategory(category);
                      setIsDeleteModalOpen(true);
                    }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <CreateCategoryModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateCategory}
      />

      <EditCategoryModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditCategory}
        initialData={
          selectedCategory
            ? {
                name: selectedCategory.name,
                description: selectedCategory.description || "",
                isPremium: selectedCategory.isPremium,
              }
            : {
                name: "",
                description: "",
                isPremium: false,
              }
        }
      />

      <DeleteCategoryModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteCategory}
        categoryName={selectedCategory?.name || ""}
      />
    </div>
  );
};

export default CategoriesManagement;
