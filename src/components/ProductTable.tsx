"use client";

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Product } from "@/types";
import { deleteProduct } from "@/app/actions/product.actions";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Package,
  TrendingUp,
  Tag,
  Package2,
  Calculator,
  Settings,
  Hash,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface ProductTableProps {
  products?: Product[];
}

const ProductTable = ({ products }: ProductTableProps) => {
  const router = useRouter();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleViewDetail = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
  };

  const handleEdit = (productId: string) => {
    router.push(`/admin/products/edit/${productId}`);
  };

  const handleDeleteClick = (productId: string) => {
    setProductToDelete(productId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;

    setIsDeleting(true);
    try {
      const result = await deleteProduct(productToDelete);

      if (result.success) {
        router.refresh();
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      alert("Error deleting product");
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  if (!products || products.length === 0) {
    return (
      <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/20 p-8 text-center">
        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-400 text-lg">No products found</p>
        <p className="text-gray-500 mt-2">
          Get started by adding your first product
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden">
        <div className="p-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="w-[300px] text-gray-300">
                    Product
                  </TableHead>
                  <TableHead className="text-gray-300">SKU</TableHead>
                  <TableHead className="text-gray-300">Price</TableHead>
                  <TableHead className="text-gray-300">Stock</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Detail</TableHead>
                  <TableHead className="text-right text-gray-300">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow
                    key={product._id}
                    className="border-white/10 hover:bg-white/5"
                  >
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-medium text-white">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-400 line-clamp-1">
                          {product.shortDescription}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {product.sku}
                    </TableCell>
                    <TableCell className="text-[#D5D502] font-semibold">
                      ₹{product.price}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {product.stock}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          product.status === "active"
                            ? "bg-green-500/20 text-green-400 border-green-500/30"
                            : product.status === "out_of_stock"
                            ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                            : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                        }`}
                      >
                        {product.status.replace("_", " ")}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetail(product)}
                        className="border-white/20 text-gray-300 bg-gray-600 rounded-full cursor-pointer hover:bg-white/10 hover:text-white"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 rounded-full cursor-pointer hover:bg-white/10"
                          >
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4 text-gray-300" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-slate-800 border border-white/20"
                        >
                          <DropdownMenuItem
                            onClick={() => handleViewDetail(product)}
                            className="text-gray-300 cursor-pointer hover:bg-white/10 hover:text-white"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEdit(product._id!)}
                            className="text-gray-300 cursor-pointer hover:bg-white/10 hover:text-white"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-400 cursor-pointer hover:bg-red-500/10 hover:text-red-300"
                            onClick={() => handleDeleteClick(product._id!)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent className="bg-slate-800 border border-white/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Are you sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              This action cannot be undone. This will permanently delete the
              product and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isDeleting}
              className="border-white/20 text-gray-900 cursor-pointer rounded-full hover:bg-white/10"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 cursor-pointer rounded-full text-white"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-6xl w-full max-h-[95vh] overflow-y-auto bg-gradient-to-br from-[#0F1416] via-[#171E21] to-[#1a2630] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 backdrop-blur-xl">
          {/* Header with Gradient */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#D5D502] via-[#D5D502]  rounded-t-2xl" />
            <DialogHeader className="relative p-6 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 bg-clip-text text-transparent">
                    Product Details
                  </DialogTitle>
                  <DialogDescription className="text-gray-900 mt-1">
                    Complete overview and specifications
                  </DialogDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge
                    variant="outline"
                    className={`border-l-2 ${
                      selectedProduct?.status === "active"
                        ? "border-green-500 bg-green-500/10 text-green-400"
                        : selectedProduct?.status === "out_of_stock"
                        ? "border-yellow-500 bg-yellow-500/10 text-yellow-400"
                        : "border-gray-500 bg-gray-500/10 text-gray-400"
                    }`}
                  >
                    {selectedProduct?.status.replace("_", " ")}
                  </Badge>
                  {selectedProduct?.isFeatured && (
                    <Badge className="bg-gradient-to-r from-[#D5D502] to-yellow-500 text-gray-900 border-0">
                      Featured
                    </Badge>
                  )}
                </div>
              </div>
            </DialogHeader>
          </div>

          {selectedProduct && (
            <div className="p-6 space-y-8">
              {/* Product Header Section */}
              <div className="grid grid-cols-1 gap-8">
                {/* Basic Info Card */}
                <Card className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl lg:col-span-2">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                      <Package className="h-5 w-5 text-[#D5D502]" />
                      Product Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-400">
                          Product Name
                        </label>
                        <p className="text-white font-semibold text-lg">
                          {selectedProduct.name}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-400">
                          SKU
                        </label>
                        <p className="text-[#D5D502] font-mono font-semibold bg-white/5 px-3 py-1 rounded-lg border border-white/10">
                          {selectedProduct.sku}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-400">
                        Description
                      </label>
                      <p className="text-gray-300 leading-relaxed bg-white/5 p-3 rounded-lg border border-white/10">
                        {selectedProduct.description}
                      </p>
                    </div>

                    {selectedProduct.shortDescription && (
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-400">
                          Short Description
                        </label>
                        <p className="text-gray-300 italic bg-white/5 p-3 rounded-lg border border-white/10">
                          {selectedProduct.shortDescription}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Pricing & Analytics Card */}
                <Card className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-[#D5D502]" />
                      Pricing & Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/10">
                        <span className="text-gray-400">Current Price</span>
                        <span className="text-[#D5D502] font-bold text-xl">
                          ₹{selectedProduct.price}
                        </span>
                      </div>

                      {selectedProduct.comparePrice && (
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/10">
                          <span className="text-gray-400">Compare Price</span>
                          <span className="text-gray-300 line-through">
                            ₹{selectedProduct.comparePrice}
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/10">
                        <span className="text-gray-400">Cost Price</span>
                        <span className="text-gray-300">
                          ₹{selectedProduct.costPrice}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="text-center p-3 bg-white/5 rounded-lg border border-white/10">
                        <div className="text-2xl font-bold text-white">
                          {selectedProduct.viewCount}
                        </div>
                        <div className="text-xs text-gray-400">Views</div>
                      </div>
                      <div className="text-center p-3 bg-white/5 rounded-lg border border-white/10">
                        <div className="text-2xl font-bold text-white">
                          {selectedProduct.sellCount}
                        </div>
                        <div className="text-xs text-gray-400">Sales</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Second Row */}
              <div className="grid grid-cols-1  gap-8">
                {/* Category & Brand Card */}
                <Card className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                      <Tag className="h-5 w-5 text-[#D5D502]" />
                      Classification
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-400">
                          Category
                        </label>
                        <div className="text-white bg-white/5 px-3 py-2 rounded-lg border border-white/10 capitalize">
                          {selectedProduct.category?.replace(/-/g, " ")}
                        </div>
                      </div>

                      {selectedProduct.subcategory && (
                        <div className="space-y-1">
                          <label className="text-sm font-medium text-gray-400">
                            Subcategory
                          </label>
                          <div className="text-gray-300 bg-white/5 px-3 py-2 rounded-lg border border-white/10">
                            {selectedProduct.subcategory.replace(/-/g, " ")}
                          </div>
                        </div>
                      )}

                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-400">
                          Brand
                        </label>
                        <div className="text-white bg-white/5 px-3 py-2 rounded-lg border border-white/10">
                          {selectedProduct.brand}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Inventory Card */}
                <Card className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                      <Package2 className="h-5 w-5 text-[#D5D502]" />
                      Inventory
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/10">
                        <span className="text-gray-400">Stock Quantity</span>
                        <span
                          className={`text-xl font-bold ${
                            selectedProduct.stock > 10
                              ? "text-green-400"
                              : selectedProduct.stock > 0
                              ? "text-yellow-400"
                              : "text-red-400"
                          }`}
                        >
                          {selectedProduct.stock}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">
                          Stock Status
                        </label>
                        <div
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
                            selectedProduct.stock > 10
                              ? "bg-green-500/20 text-green-400 border-green-500/30"
                              : selectedProduct.stock > 0
                              ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                              : "bg-red-500/20 text-red-400 border-red-500/30"
                          }`}
                        >
                          {selectedProduct.stock > 10
                            ? "In Stock"
                            : selectedProduct.stock > 0
                            ? "Low Stock"
                            : "Out of Stock"}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Profit Margin Card */}
                <Card className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                      <Calculator className="h-5 w-5 text-[#D5D502]" />
                      Profit Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/10">
                        <span className="text-gray-400">Profit Margin</span>
                        <span className="text-green-400 font-bold">
                          {(
                            ((selectedProduct.price -
                              selectedProduct.costPrice) /
                              selectedProduct.costPrice) *
                            100
                          ).toFixed(1)}
                          %
                        </span>
                      </div>

                      <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/10">
                        <span className="text-gray-400">Profit per Unit</span>
                        <span className="text-green-400 font-bold">
                          ₹{selectedProduct.price - selectedProduct.costPrice}
                        </span>
                      </div>

                      <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/10">
                        <span className="text-gray-400">Total Revenue</span>
                        <span className="text-[#D5D502] font-bold">
                          ₹{selectedProduct.sellCount * selectedProduct.price}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Specifications & Tags */}
              {(selectedProduct.specifications ||
                selectedProduct.tags?.length > 0) && (
                <div className="grid grid-cols-1 gap-8">
                  {/* Specifications */}
                  {selectedProduct.specifications && (
                    <Card className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                          <Settings className="h-5 w-5 text-[#D5D502]" />
                          Specifications
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          {selectedProduct.specifications.color && (
                            <div className="space-y-1">
                              <label className="text-sm font-medium text-gray-400">
                                Color
                              </label>
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-4 h-4 rounded-full border border-white/20"
                                  style={{
                                    backgroundColor:
                                      selectedProduct.specifications.color.toLowerCase(),
                                  }}
                                />
                                <span className="text-white capitalize">
                                  {selectedProduct.specifications.color}
                                </span>
                              </div>
                            </div>
                          )}
                          {selectedProduct.specifications.material && (
                            <div className="space-y-1">
                              <label className="text-sm font-medium text-gray-400">
                                Material
                              </label>
                              <span className="text-white capitalize">
                                {selectedProduct.specifications.material}
                              </span>
                            </div>
                          )}
                          {selectedProduct.specifications.size && (
                            <div className="space-y-1">
                              <label className="text-sm font-medium text-gray-400">
                                Size
                              </label>
                              <span className="text-white">
                                {selectedProduct.specifications.size}
                              </span>
                            </div>
                          )}
                          {selectedProduct.specifications.penType && (
                            <div className="space-y-1">
                              <label className="text-sm font-medium text-gray-400">
                                Pen Type
                              </label>
                              <span className="text-white capitalize">
                                {selectedProduct.specifications.penType}
                              </span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {selectedProduct.tags && selectedProduct.tags.length > 0 && (
                    <Card className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                          <Hash className="h-5 w-5 text-[#D5D502]" />
                          Product Tags
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {selectedProduct.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-gradient-to-r from-[#D5D502]/20 to-yellow-500/20 text-[#D5D502] border border-[#D5D502]/30 backdrop-blur-sm"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductTable;
