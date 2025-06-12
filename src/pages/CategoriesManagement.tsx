import React, { useState } from "react";
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
import type { Category, CategoryFormData } from "../types/category";

const CategoriesManagement = () => {
  const [categories, setCategories] = useState<Category[]>([
    {
      id: 1,
      name: "Daily Affirmations",
      type: "Affirmation",
      itemCount: 150,
      description: "Positive daily affirmations for personal growth",
    },
    {
      id: 2,
      name: "Success Stories",
      type: "Post",
      itemCount: 45,
      description: "User success stories and testimonials",
    },
    {
      id: 3,
      name: "Community Challenges",
      type: "Community",
      itemCount: 12,
      description: "Monthly community challenges and activities",
    },
  ]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  const handleCreateCategory = (data: CategoryFormData) => {
    const newCategory: Category = {
      id: categories.length + 1,
      name: data.name,
      type: data.type,
      itemCount: 0,
      description: data.description,
    };
    setCategories([...categories, newCategory]);
    setIsCreateModalOpen(false);
  };

  const handleEditCategory = (data: CategoryFormData) => {
    if (selectedCategory) {
      setCategories(
        categories.map((cat) =>
          cat.id === selectedCategory.id
            ? {
                ...cat,
                name: data.name,
                type: data.type,
                description: data.description,
              }
            : cat
        )
      );
      setIsEditModalOpen(false);
    }
  };

  const handleDeleteCategory = () => {
    if (selectedCategory) {
      setCategories(categories.filter((cat) => cat.id !== selectedCategory.id));
      setIsDeleteModalOpen(false);
    }
  };

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
              <TableHead>Type</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>{category.type}</TableCell>
                <TableCell>{category.itemCount}</TableCell>
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
                type: selectedCategory.type as
                  | "Affirmation"
                  | "Post"
                  | "Community",
              }
            : {
                name: "",
                description: "",
                type: "Affirmation",
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
