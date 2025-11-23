"use client";

import React, { useState, useMemo } from "react";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
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
  Search,
  Filter,
  ArrowUpDown,
  BarChart3,
  TrendingDown,
  AlertTriangle,
  ShoppingCart,
  DollarSign,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface ProductTableProps {
  products?: Product[];
}

type SortField = "name" | "price" | "stock" | "status" | "sku" | "sellCount";
type SortDirection = "asc" | "desc";
type StatusFilter = "all" | "active" | "out_of_stock" | "draft";
type CategoryFilter = "all" | string;

const ProductTable = ({ products }: ProductTableProps) => {
  const router = useRouter();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

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

  // Analytics calculations
  const analytics = useMemo(() => {
    if (!products) return null;

    const totalProducts = products.length;
    const totalStock = products.reduce((sum, product) => sum + product.stock, 0);
    const totalValue = products.reduce((sum, product) => sum + (product.price * product.stock), 0);
    const totalSales = products.reduce((sum, product) => sum + product.sellCount, 0);
    const activeProducts = products.filter(p => p.status === "active").length;
    const outOfStockProducts = products.filter(p => p.stock === 0).length;
    
    const mostSoldProduct = products.reduce((max, product) => 
      product.sellCount > max.sellCount ? product : max, products[0]);
    
    const leastStockProduct = products.reduce((min, product) => 
      product.stock < min.stock ? product : min, products[0]);

    const categories = [...new Set(products.map(p => p.category))];
    const categoryStats = categories.map(category => {
      const categoryProducts = products.filter(p => p.category === category);
      return {
        category,
        count: categoryProducts.length,
        totalStock: categoryProducts.reduce((sum, p) => sum + p.stock, 0),
        totalSales: categoryProducts.reduce((sum, p) => sum + p.sellCount, 0),
      };
    });

    return {
      totalProducts,
      totalStock,
      totalValue,
      totalSales,
      activeProducts,
      outOfStockProducts,
      mostSoldProduct,
      leastStockProduct,
      categories,
      categoryStats,
    };
  }, [products]);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    if (!products) return [];

    let filtered = products.filter((product) => {
      // Search filter
      const matchesSearch = 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.shortDescription?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      // Status filter
      const matchesStatus = statusFilter === "all" || product.status === statusFilter;
      
      // Category filter
      const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });

    // Sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      // Handle specific field types
      if (sortField === "name") {
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
      } else if (sortField === "price" || sortField === "stock" || sortField === "sellCount") {
        aValue = Number(aValue);
        bValue = Number(bValue);
      }

      if (aValue < bValue) {
        return sortDirection === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    });

    return filtered;
  }, [products, searchTerm, statusFilter, categoryFilter, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Simple bar chart component for sales visualization
  const SalesBarChart = ({ products }: { products: Product[] }) => {
    const topProducts = products
      .sort((a, b) => b.sellCount - a.sellCount)
      .slice(0, 5);

    const maxSales = Math.max(...topProducts.map(p => p.sellCount));

    return (
      <div className="space-y-2">
        {topProducts.map((product) => (
          <div key={product._id} className="flex items-center space-x-3">
            <div className="w-32 text-sm text-gray-300 truncate">
              {product.name}
            </div>
            <div className="flex-1">
              <div
                className="bg-gradient-to-r from-[#D5D502] to-yellow-500 rounded-full h-4 transition-all duration-500"
                style={{
                  width: `${(product.sellCount / maxSales) * 100}%`,
                }}
              />
            </div>
            <div className="w-12 text-right text-sm text-white font-medium">
              {product.sellCount}
            </div>
          </div>
        ))}
      </div>
    );
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
      {/* Analytics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Products */}
        <Card className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl">
          <CardContent className="">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Total Products</p>
                <p className="text-2xl font-bold text-white">{analytics?.totalProducts}</p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-full">
                <Package className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Stock */}
        <Card className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl">
          <CardContent className="">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Total Stock</p>
                <p className="text-2xl font-bold text-white">{analytics?.totalStock}</p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-full">
                <Package2 className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Sales */}
        <Card className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl">
          <CardContent className="">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Total Sales</p>
                <p className="text-2xl font-bold text-white">{analytics?.totalSales}</p>
              </div>
              <div className="p-3 bg-[#D5D502]/20 rounded-full">
                <ShoppingCart className="h-6 w-6 text-[#D5D502]" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stock Value */}
        <Card className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl">
          <CardContent className="">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Stock Value</p>
                <p className="text-2xl font-bold text-[#D5D502]">
                  ₹{analytics?.totalValue.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-full">
                <DollarSign className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Highlights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Most Sold Product */}
        <Card className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-400" />
              Most Sold Product
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analytics?.mostSoldProduct && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium truncate">
                    {analytics.mostSoldProduct.name}
                  </span>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    {analytics.mostSoldProduct.sellCount} sold
                  </Badge>
                </div>
                <div className="text-sm text-gray-400">
                  SKU: {analytics.mostSoldProduct.sku}
                </div>
                <div className="text-[#D5D502] font-bold">
                  ₹{analytics.mostSoldProduct.price}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Least Stock Product */}
        <Card className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
              Low Stock Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analytics?.leastStockProduct && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium truncate">
                    {analytics.leastStockProduct.name}
                  </span>
                  <Badge className={`${
                    analytics.leastStockProduct.stock === 0 
                      ? "bg-red-500/20 text-red-400 border-red-500/30"
                      : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                  }`}>
                    {analytics.leastStockProduct.stock} left
                  </Badge>
                </div>
                <div className="text-sm text-gray-400">
                  SKU: {analytics.leastStockProduct.sku}
                </div>
                <div className="text-[#D5D502] font-bold">
                  ₹{analytics.leastStockProduct.price}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sales Chart */}
        <Card className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-400" />
              Top Selling Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SalesBarChart products={products} />
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Controls */}
      <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/20 p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full lg:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/5 border-white/20 text-white placeholder-gray-400 rounded-full"
            />
          </div>

          {/* Filter and Sort Controls */}
          <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
            {/* Status Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="border-white/20 cursor-pointer text-gray-300 bg-white/5 rounded-full hover:bg-white/10 hover:text-white"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Status: {statusFilter === "all" ? "All" : statusFilter.replace("_", " ")}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-slate-800 border border-white/20">
                <DropdownMenuItem
                  onClick={() => setStatusFilter("all")}
                  className="text-gray-300 cursor-pointer hover:bg-white/10 hover:text-white"
                >
                  All Status
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/20" />
                <DropdownMenuItem
                  onClick={() => setStatusFilter("active")}
                  className="text-gray-300 cursor-pointer hover:bg-white/10 hover:text-white"
                >
                  Active
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setStatusFilter("out_of_stock")}
                  className="text-gray-300 cursor-pointer hover:bg-white/10 hover:text-white"
                >
                  Out of Stock
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setStatusFilter("draft")}
                  className="text-gray-300 cursor-pointer hover:bg-white/10 hover:text-white"
                >
                  Draft
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Category Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="border-white/20 cursor-pointer text-gray-300 bg-white/5 rounded-full hover:bg-white/10 hover:text-white"
                >
                  <Tag className="h-4 w-4 mr-2" />
                  Category: {categoryFilter === "all" ? "All" : categoryFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-slate-800 border border-white/20 max-h-60 overflow-y-auto">
                <DropdownMenuItem
                  onClick={() => setCategoryFilter("all")}
                  className="text-gray-300 cursor-pointer hover:bg-white/10 hover:text-white"
                >
                  All Categories
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/20" />
                {analytics?.categories.map((category) => (
                  <DropdownMenuItem
                    key={category}
                    onClick={() => setCategoryFilter(category)}
                    className="text-gray-300 cursor-pointer hover:bg-white/10 hover:text-white capitalize"
                  >
                    {category.replace(/-/g, " ")}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Sort Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="border-white/20 cursor-pointer text-gray-300 bg-white/5 rounded-full hover:bg-white/10 hover:text-white"
                >
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-slate-800 border border-white/20">
                <DropdownMenuItem
                  onClick={() => handleSort("name")}
                  className="text-gray-300 cursor-pointer hover:bg-white/10 hover:text-white"
                >
                  Name {sortField === "name" && (sortDirection === "asc" ? "↑" : "↓")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleSort("price")}
                  className="text-gray-300 cursor-pointer hover:bg-white/10 hover:text-white"
                >
                  Price {sortField === "price" && (sortDirection === "asc" ? "↑" : "↓")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleSort("stock")}
                  className="text-gray-300 cursor-pointer hover:bg-white/10 hover:text-white"
                >
                  Stock {sortField === "stock" && (sortDirection === "asc" ? "↑" : "↓")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleSort("sellCount")}
                  className="text-gray-300 cursor-pointer hover:bg-white/10 hover:text-white"
                >
                  Sales {sortField === "sellCount" && (sortDirection === "asc" ? "↑" : "↓")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleSort("status")}
                  className="text-gray-300 cursor-pointer hover:bg-white/10 hover:text-white"
                >
                  Status {sortField === "status" && (sortDirection === "asc" ? "↑" : "↓")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 text-sm text-gray-400">
          Showing {filteredAndSortedProducts.length} of {products.length} products
          {(searchTerm || statusFilter !== "all" || categoryFilter !== "all") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setCategoryFilter("all");
              }}
              className="ml-2 text-xs text-[#D5D502] hover:text-[#D5D502]/80 hover:bg-[#D5D502]/10"
            >
              Clear filters
            </Button>
          )}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden">
        <div className="p-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="w-[300px] text-gray-300">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("name")}
                      className="p-0 hover:bg-transparent hover:text-gray-400 cursor-pointer text-gray-300 font-semibold"
                    >
                      Product
                      <ArrowUpDown className="h-4 w-4 ml-2" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-gray-300">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("sku")}
                      className="p-0 hover:bg-transparent hover:text-gray-400 cursor-pointer text-gray-300 font-semibold"
                    >
                      SKU
                      <ArrowUpDown className="h-4 w-4 ml-2" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-gray-300">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("price")}
                      className="p-0 hover:bg-transparent hover:text-gray-400 cursor-pointer text-gray-300 font-semibold"
                    >
                      Price
                      <ArrowUpDown className="h-4 w-4 ml-2" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-gray-300">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("stock")}
                      className="p-0 hover:bg-transparent hover:text-gray-400 cursor-pointer text-gray-300 font-semibold"
                    >
                      Stock
                      <ArrowUpDown className="h-4 w-4 ml-2" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-gray-300">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("sellCount")}
                      className="p-0 hover:bg-transparent hover:text-gray-400 cursor-pointer text-gray-300 font-semibold"
                    >
                      Sales
                      <ArrowUpDown className="h-4 w-4 ml-2" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-gray-300">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("status")}
                      className="p-0 hover:bg-transparent hover:text-gray-400 cursor-pointer text-gray-300 font-semibold"
                    >
                      Status
                      <ArrowUpDown className="h-4 w-4 ml-2" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-gray-300">Detail</TableHead>
                  <TableHead className="text-right text-gray-300">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedProducts.map((product) => (
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
                        <div className="text-xs text-gray-500 mt-1 capitalize">
                          {product.category?.replace(/-/g, " ")}
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
                      <div className="flex items-center space-x-2">
                        <span>{product.stock}</span>
                        {product.stock <= 5 && product.stock > 0 && (
                          <AlertTriangle className="h-3 w-3 text-yellow-400" />
                        )}
                        {product.stock === 0 && (
                          <AlertTriangle className="h-3 w-3 text-red-400" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      <div className="flex items-center space-x-2">
                        <span>{product.sellCount}</span>
                        {product.sellCount > 0 && (
                          <TrendingUp className="h-3 w-3 text-green-400" />
                        )}
                      </div>
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

      {/* Rest of your existing dialogs and modals remain the same */}
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