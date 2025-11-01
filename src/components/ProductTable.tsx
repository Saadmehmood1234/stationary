"use client";

import React, { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Product } from '@/types'
import { deleteProduct } from '@/app/actions/product.actions'
import { MoreHorizontal, Eye, Edit, Trash2, Package } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ProductTableProps {
  products?: Product[]
}

const ProductTable = ({ products }: ProductTableProps) => {
  const router = useRouter()
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleViewDetail = (product: Product) => {
    setSelectedProduct(product)
    setIsDetailModalOpen(true)
  }

  const handleEdit = (productId: string) => {
    router.push(`/admin/products/edit/${productId}`)
  }

  const handleDeleteClick = (productId: string) => {
    setProductToDelete(productId)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return

    setIsDeleting(true)
    try {
      const result = await deleteProduct(productToDelete)
      
      if (result.success) {
        router.refresh()
      } else {
        alert(`Error: ${result.error}`)
      }
    } catch (error) {
      alert('Error deleting product')
    } finally {
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
      setProductToDelete(null)
    }
  }

  if (!products || products.length === 0) {
    return (
      <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/20 p-8 text-center">
        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-400 text-lg">No products found</p>
        <p className="text-gray-500 mt-2">Get started by adding your first product</p>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden">
        <div className="p-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="w-[300px] text-gray-300">Product</TableHead>
                  <TableHead className="text-gray-300">SKU</TableHead>
                  <TableHead className="text-gray-300">Price</TableHead>
                  <TableHead className="text-gray-300">Stock</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Detail</TableHead>
                  <TableHead className="text-right text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product._id} className="border-white/10 hover:bg-white/5">
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-medium text-white">{product.name}</div>
                        <div className="text-sm text-gray-400 line-clamp-1">
                          {product.shortDescription}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">{product.sku}</TableCell>
                    <TableCell className="text-[#D5D502] font-semibold">₹{product.price}</TableCell>
                    <TableCell className="text-gray-300">{product.stock}</TableCell>
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
                        {product.status.replace('_', ' ')}
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
                          <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-white/10">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4 text-gray-300" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-slate-800 border border-white/20">
                          <DropdownMenuItem 
                            onClick={() => handleViewDetail(product)}
                            className="text-gray-300 hover:bg-white/10 hover:text-white"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleEdit(product._id!)}
                            className="text-gray-300 hover:bg-white/10 hover:text-white"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-400 hover:bg-red-500/10 hover:text-red-300"
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

      {/* Product Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-[#171E21] via-[#171E21] to-slate-900 border border-white/20">
          <DialogHeader>
            <DialogTitle className="text-white">Product Details</DialogTitle>
            <DialogDescription className="text-gray-400">
              Complete information about the product
            </DialogDescription>
          </DialogHeader>
          
          {selectedProduct && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Basic Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-400">Name</label>
                    <p className="text-white">{selectedProduct.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400">SKU</label>
                    <p className="text-white font-mono">{selectedProduct.sku}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400">Description</label>
                    <p className="text-gray-300">{selectedProduct.description}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400">Short Description</label>
                    <p className="text-gray-300">{selectedProduct.shortDescription}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Pricing & Stock</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-400">Price</label>
                      <p className="text-[#D5D502] font-semibold">₹{selectedProduct.price}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-400">Compare Price</label>
                      <p className="text-gray-300">{selectedProduct.comparePrice ? `₹${selectedProduct.comparePrice}` : 'N/A'}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-400">Cost Price</label>
                      <p className="text-gray-300">₹{selectedProduct.costPrice}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-400">Stock</label>
                      <p className="text-gray-300">{selectedProduct.stock}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Category & Brand</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-400">Category</label>
                    <p className="text-gray-300 capitalize">{selectedProduct.category?.replace(/-/g, ' ')}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400">Subcategory</label>
                    <p className="text-gray-300">{selectedProduct.subcategory ? selectedProduct.subcategory.replace(/-/g, ' ') : 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400">Brand</label>
                    <p className="text-gray-300">{selectedProduct.brand}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Status & Analytics</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-400">Status</label>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          selectedProduct.status === "active"
                            ? "bg-green-500/20 text-green-400 border-green-500/30"
                            : selectedProduct.status === "out_of_stock"
                            ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                            : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                        }`}
                      >
                        {selectedProduct.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-400">Featured</label>
                      <p className="text-gray-300">{selectedProduct.isFeatured ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-400">Views</label>
                      <p className="text-gray-300">{selectedProduct.viewCount}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-400">Sales</label>
                      <p className="text-gray-300">{selectedProduct.sellCount}</p>
                    </div>
                  </div>
                </div>
              </div>

              {selectedProduct.specifications && (
                <div className="md:col-span-2 space-y-4">
                  <h3 className="text-lg font-semibold text-white">Specifications</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {selectedProduct.specifications.color && (
                      <div>
                        <label className="text-sm font-medium text-gray-400">Color</label>
                        <p className="text-gray-300 capitalize">{selectedProduct.specifications.color}</p>
                      </div>
                    )}
                    {selectedProduct.specifications.material && (
                      <div>
                        <label className="text-sm font-medium text-gray-400">Material</label>
                        <p className="text-gray-300 capitalize">{selectedProduct.specifications.material}</p>
                      </div>
                    )}
                    {selectedProduct.specifications.size && (
                      <div>
                        <label className="text-sm font-medium text-gray-400">Size</label>
                        <p className="text-gray-300">{selectedProduct.specifications.size}</p>
                      </div>
                    )}
                    {selectedProduct.specifications.penType && (
                      <div>
                        <label className="text-sm font-medium text-gray-400">Pen Type</label>
                        <p className="text-gray-300 capitalize">{selectedProduct.specifications.penType}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {selectedProduct.tags && selectedProduct.tags.length > 0 && (
                <div className="md:col-span-2 space-y-4">
                  <h3 className="text-lg font-semibold text-white">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#D5D502]/20 text-[#D5D502] border border-[#D5D502]/30"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-slate-800 border border-white/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              This action cannot be undone. This will permanently delete the product
              and remove it from our servers.
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
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default ProductTable