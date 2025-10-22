"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus, X, Upload } from "lucide-react";
import { createProduct } from "@/app/actions/product.actions";
import toast from "react-hot-toast";

const CATEGORIES = [
  "Writing Instruments",
  "Paper Products",
  "Office Supplies",
  "Art Supplies",
  "School Supplies",
  "Desk Accessories",
];

const PEN_TYPES = ["ballpoint", "gel", "fountain", "marker"];
const PAPER_TYPES = ["lined", "blank", "grid", "dot"];
const BINDING_TYPES = ["spiral", "perfect", "hardcover"];
const STATUS_OPTIONS = ["active", "inactive", "out_of_stock", "discontinued"];

export default function CreateProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const [formData, setFormData] = useState({
    sku: "",
    name: "",
    description: "",
    shortDescription: "",
    price: 0,
    comparePrice: 0,
    costPrice: 0,
    stock: 0,
    lowStockAlert: 10,
    trackQuantity: true,
    category: "",
    subcategory: "",
    brand: "",
    primaryImage: "",
    specifications: {
      color: "",
      material: "",
      size: "",
      weight: 0,
      dimensions: {
        length: 0,
        width: 0,
        height: 0,
      },
      penType: undefined as
        | "ballpoint"
        | "gel"
        | "fountain"
        | "marker"
        | undefined,
      inkColor: "",
      pointSize: "",
      paperType: undefined as "lined" | "blank" | "grid" | "dot" | undefined,
      pageCount: 0,
      binding: undefined as "spiral" | "perfect" | "hardcover" | undefined,
    },
    status: "active" as "active" | "inactive" | "out_of_stock" | "discontinued",
    isFeatured: false,
    isBestSeller: false,
    slug: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (name.startsWith("specifications.")) {
      const specField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [specField]: type === "number" ? parseFloat(value) || 0 : value,
        },
      }));
    } else if (name.startsWith("dimensions.")) {
      const dimField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          dimensions: {
            ...prev.specifications.dimensions,
            [dimField]: parseFloat(value) || 0,
          },
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "number" ? parseFloat(value) || 0 : value,
      }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name.startsWith("specifications.")) {
      const specField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [specField]: value === "" ? undefined : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const addImageUrl = () => {
    if (formData.primaryImage && !imageUrls.includes(formData.primaryImage)) {
      setImageUrls((prev) => [...prev, formData.primaryImage]);
      setFormData((prev) => ({ ...prev, primaryImage: "" }));
    }
  };

  const removeImageUrl = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags((prev) => [...prev, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (index: number) => {
    setTags((prev) => prev.filter((_, i) => i !== index));
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        ...formData,
        images: imageUrls,
        tags: tags,
        primaryImage: imageUrls[0] || "",
        slug: formData.slug || generateSlug(formData.name),
        viewCount: 0,
        sellCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await createProduct(productData);

      if (result.success) {
        toast.success("Product created successfully!");
        setFormData({
          sku: "",
          name: "",
          description: "",
          shortDescription: "",
          price: 0,
          comparePrice: 0,
          costPrice: 0,
          stock: 0,
          lowStockAlert: 10,
          trackQuantity: true,
          category: "",
          subcategory: "",
          brand: "",
          primaryImage: "",
          specifications: {
            color: "",
            material: "",
            size: "",
            weight: 0,
            dimensions: {
              length: 0,
              width: 0,
              height: 0,
            },
            penType: undefined as
              | "ballpoint"
              | "gel"
              | "fountain"
              | "marker"
              | undefined,
            inkColor: "",
            pointSize: "",
            paperType: undefined as
              | "lined"
              | "blank"
              | "grid"
              | "dot"
              | undefined,
            pageCount: 0,
            binding: undefined as
              | "spiral"
              | "perfect"
              | "hardcover"
              | undefined,
          },
          status: "active",
          isFeatured: false,
          isBestSeller: false,
          slug: "",
        });

        setImageUrls([]);
        setTags([]);
        setTagInput("");

        console.log("Product created with ID:", result.productId);
      } else {
        console.error("Error:", result.error);
        toast.error(
          result.error || "Failed to create product. Please try again."
        );
      }
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">
          Create New Product
        </h1>
        <p className="text-muted-foreground mt-2">
          Add a new product to your stationery store
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Essential product details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Natraj Premium Pencil"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sku">SKU *</Label>
                <Input
                  id="sku"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  placeholder="e.g., NAT-PB2-2024"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="shortDescription">Short Description *</Label>
              <Input
                id="shortDescription"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleInputChange}
                placeholder="Brief description (max 200 characters)"
                maxLength={200}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Full Description *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Detailed product description with features and benefits"
                rows={4}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Pricing & Inventory */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing & Inventory</CardTitle>
            <CardDescription>
              Product pricing and stock management
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="costPrice">Cost Price (₹) *</Label>
                <Input
                  id="costPrice"
                  name="costPrice"
                  type="number"
                  step="0.01"
                  value={formData.costPrice}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Selling Price (₹) *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="comparePrice">Compare Price (₹)</Label>
                <Input
                  id="comparePrice"
                  name="comparePrice"
                  type="number"
                  step="0.01"
                  value={formData.comparePrice}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stock">Stock Quantity *</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  value={formData.stock}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lowStockAlert">Low Stock Alert</Label>
                <Input
                  id="lowStockAlert"
                  name="lowStockAlert"
                  type="number"
                  value={formData.lowStockAlert}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.trackQuantity}
                onCheckedChange={(checked: any) =>
                  handleSwitchChange("trackQuantity", checked)
                }
              />
              <Label htmlFor="trackQuantity">Track Quantity</Label>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Category & Organization</CardTitle>
            <CardDescription>Product categorization</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    handleSelectChange("category", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subcategory">Subcategory</Label>
                <Input
                  id="subcategory"
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleInputChange}
                  placeholder="e.g., Pencils, Notebooks"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand">Brand *</Label>
              <Input
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                placeholder="e.g., Natraj, Pilot"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add tags..."
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                />
                <Button type="button" onClick={addTag} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Product Images</CardTitle>
            <CardDescription>Add product images</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Add Image URL</Label>
              <div className="flex gap-2">
                <Input
                  value={formData.primaryImage}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      primaryImage: e.target.value,
                    }))
                  }
                  placeholder="https://example.com/image.jpg"
                />
                <Button type="button" onClick={addImageUrl} variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Add Image
                </Button>
              </div>
            </div>

            {imageUrls.length > 0 && (
              <div className="space-y-2">
                <Label>Product Images</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Product image ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImageUrl(index)}
                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Product Specifications</CardTitle>
            <CardDescription>Detailed product specifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="specifications.color">Color</Label>
                <Input
                  id="specifications.color"
                  name="specifications.color"
                  value={formData.specifications.color}
                  onChange={handleInputChange}
                  placeholder="e.g., Blue, Black, Red"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specifications.material">Material</Label>
                <Input
                  id="specifications.material"
                  name="specifications.material"
                  value={formData.specifications.material}
                  onChange={handleInputChange}
                  placeholder="e.g., Plastic, Metal, Paper"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="specifications.penType">Pen Type</Label>
                <Select
                  value={formData.specifications.penType}
                  onValueChange={(value) =>
                    handleSelectChange("specifications.penType", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Pen Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {PEN_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="specifications.inkColor">Ink Color</Label>
                <Input
                  id="specifications.inkColor"
                  name="specifications.inkColor"
                  value={formData.specifications.inkColor}
                  onChange={handleInputChange}
                  placeholder="e.g., Blue, Black, Red"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="specifications.pointSize">Point Size</Label>
                <Input
                  id="specifications.pointSize"
                  name="specifications.pointSize"
                  value={formData.specifications.pointSize}
                  onChange={handleInputChange}
                  placeholder="e.g., 0.7mm, 1.0mm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specifications.paperType">Paper Type</Label>
                <Select
                  value={formData.specifications.paperType}
                  onValueChange={(value) =>
                    handleSelectChange("specifications.paperType", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Paper Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {PAPER_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="specifications.pageCount">Page Count</Label>
                <Input
                  id="specifications.pageCount"
                  name="specifications.pageCount"
                  type="number"
                  value={formData.specifications.pageCount}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specifications.binding">Binding Type</Label>
                <Select
                  value={formData.specifications.binding}
                  onValueChange={(value) =>
                    handleSelectChange("specifications.binding", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Binding" />
                  </SelectTrigger>
                  <SelectContent>
                    {BINDING_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>SEO & Status</CardTitle>
            <CardDescription>
              Product visibility and SEO settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug *</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  placeholder="e.g., natraj-premium-pencil"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status
                          .split("_")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(" ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.isFeatured}
                  onCheckedChange={(checked: any) =>
                    handleSwitchChange("isFeatured", checked)
                  }
                />
                <Label htmlFor="isFeatured">Featured Product</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.isBestSeller}
                  onCheckedChange={(checked: any) =>
                    handleSwitchChange("isBestSeller", checked)
                  }
                />
                <Label htmlFor="isBestSeller">Best Seller</Label>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Product...
              </>
            ) : (
              "Create Product"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
