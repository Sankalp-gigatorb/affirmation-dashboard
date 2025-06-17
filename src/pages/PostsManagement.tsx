import React, { useState, useEffect } from "react";
import {
  FiPlus,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiImage,
  FiVideo,
} from "react-icons/fi";
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
import CreatePostModal from "@/components/modals/CreatePostModal";
import EditPostModal from "@/components/modals/EditPostModal";
import DeletePostModal from "@/components/modals/DeletePostModal";
import PostService from "@/services/post.service";
import CategoryService from "@/services/category.service";
import type { Post, Category } from "@/types";
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

interface PostResponse {
  success: boolean;
  data: Post;
}

const PostsManagement = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPrivacy, setSelectedPrivacy] = useState("all");

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [postsData, categoriesResponse] = await Promise.all([
        PostService.getAllPosts(),
        CategoryService.getAllCategories(),
      ]);

      setPosts(Array.isArray(postsData) ? postsData : []);
      const categoriesData = (categoriesResponse as unknown as CategoryResponse)
        ?.data?.categories;
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (error) {
      toast.error("Failed to fetch data");
      console.error("Error fetching data:", error);
      setPosts([]);
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreatePost = async (data: {
    content: string;
    mediaUrl?: string;
    postType: "IMAGE" | "VIDEO" | "TEXT";
    categoryId?: string;
    privacy: "PUBLIC" | "PRIVATE";
    tags?: string[];
  }) => {
    try {
      const response = (await PostService.createPost(
        data
      )) as unknown as PostResponse;
      if (response.success && response.data) {
        setPosts((prev) => [...prev, response.data]);
        setIsCreateModalOpen(false);
        toast.success("Post created successfully");
      } else {
        throw new Error("Failed to create post");
      }
    } catch (error) {
      toast.error("Failed to create post");
      console.error("Error creating post:", error);
    }
  };

  const handleEditPost = async (data: {
    content: string;
    mediaUrl?: string;
    postType: "IMAGE" | "VIDEO" | "TEXT";
    categoryId?: string;
    privacy: "PUBLIC" | "PRIVATE";
    tags?: string[];
  }) => {
    if (!selectedPost) return;

    try {
      const updatedPost = await PostService.updatePost(selectedPost.id, data);
      setPosts((prev) =>
        prev.map((p) => (p.id === selectedPost.id ? updatedPost : p))
      );
      setIsEditModalOpen(false);
      setSelectedPost(null);
      toast.success("Post updated successfully");
    } catch (error) {
      toast.error("Failed to update post");
      console.error("Error updating post:", error);
    }
  };

  const handleView = async (id: string) => {
    try {
      const post = await PostService.getPostById(id);
      console.log("View post:", post);
      // TODO: Implement view modal or navigation
    } catch (error) {
      toast.error("Failed to fetch post details");
      console.error("Error fetching post:", error);
    }
  };

  const handleEdit = async (id: string) => {
    console.log(id, "id");

    try {
      const post = await PostService.getPostById(id);
      console.log(post?.data);

      setSelectedPost(post?.data);
      setIsEditModalOpen(true);
    } catch (error) {
      toast.error("Failed to fetch post details");
      console.error("Error fetching post:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = (await PostService.getPostById(
        id
      )) as unknown as PostResponse;

      if (response.success) {
        setSelectedPost(response.data);
        setIsDeleteModalOpen(true);
      } else {
        throw new Error("Failed to fetch post details");
      }
    } catch (error) {
      toast.error("Failed to fetch post details");
      console.error("Error fetching post:", error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedPost) return;

    try {
      const response = await PostService.deletePost(selectedPost.id);
      console.log(response, "response.success de");

      if (response.success) {
        setPosts((prev) => prev.filter((p) => p.id !== selectedPost.id));
        toast.success(response.data.message || "Post deleted successfully");
        setIsDeleteModalOpen(false);
        setSelectedPost(null);
      } else {
        throw new Error("Failed to delete post");
      }
    } catch (error) {
      toast.error("Failed to delete post");
      console.error("Error deleting post:", error);
    }
  };

  // Filter posts based on search query, category, and privacy
  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.content
      ? post.content.toLowerCase().includes(searchQuery.toLowerCase())
      : false;
    const matchesCategory =
      selectedCategory === "all" || post.categoryId === selectedCategory;
    const matchesPrivacy =
      selectedPrivacy === "all" || post.privacy === selectedPrivacy;

    return matchesSearch && matchesCategory && matchesPrivacy;
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
        <h1 className="text-2xl font-bold">Manage Posts</h1>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-primary hover:bg-primary/90"
        >
          <FiPlus className="w-4 h-4 mr-2" />
          Add New
        </Button>
      </div>

      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePost}
        categories={categories}
      />

      <EditPostModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedPost(null);
        }}
        onSubmit={handleEditPost}
        categories={categories}
        post={selectedPost}
      />

      <DeletePostModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedPost(null);
        }}
        onConfirm={handleConfirmDelete}
        postTitle={selectedPost?.content}
      />

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <Input
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {Array.isArray(categories) &&
              categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        <Select value={selectedPrivacy} onValueChange={setSelectedPrivacy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select privacy" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="PUBLIC">Public</SelectItem>
            <SelectItem value="PRIVATE">Private</SelectItem>
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
              <TableHead>Media</TableHead>
              <TableHead>Privacy</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPosts.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="font-medium max-w-[200px] truncate">
                  {post.content}
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      post.postType === "IMAGE"
                        ? "bg-blue-100 text-blue-800"
                        : post.postType === "VIDEO"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {post.postType}
                  </span>
                </TableCell>
                <TableCell>{post.category?.name || "Uncategorized"}</TableCell>
                <TableCell>
                  {post.mediaUrl ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => window.open(post.mediaUrl, "_blank")}
                    >
                      {post.postType === "IMAGE" ? (
                        <FiImage className="w-4 h-4" />
                      ) : (
                        <FiVideo className="w-4 h-4" />
                      )}
                    </Button>
                  ) : (
                    <span className="text-muted-foreground">No media</span>
                  )}
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      post.privacy === "PUBLIC"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {post.privacy}
                  </span>
                </TableCell>
                <TableCell>
                  {post.author ? (
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {post.author.firstName} {post.author.lastName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        @{post.author.username}
                      </span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Unknown</span>
                  )}
                </TableCell>
                <TableCell>
                  {new Date(post.createdAt).toLocaleDateString()}
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleView(post.id)}
                    >
                      <FiEye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(post.id)}
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(post.id)}
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

export default PostsManagement;
