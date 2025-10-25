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
import { MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react'
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
      <div className="card">
        <div className="p-6 text-center text-gray-500">
          No products found
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="card">
        <div className="p-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Detail</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product._id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-gray-600">
                          {product.shortDescription}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell>${product.price}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          product.status === "active"
                            ? "bg-green-100 text-green-800"
                            : product.status === "out_of_stock"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {product.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleViewDetail(product)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetail(product)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(product._id!)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600"
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
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
            <DialogDescription>
              Complete information about the product
            </DialogDescription>
          </DialogHeader>
          
          {selectedProduct && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Information</h3>
                <div className="space-y-2">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Name</label>
                    <p className="text-sm">{selectedProduct.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">SKU</label>
                    <p className="text-sm">{selectedProduct.sku}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Description</label>
                    <p className="text-sm">{selectedProduct.description}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Short Description</label>
                    <p className="text-sm">{selectedProduct.shortDescription}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Pricing & Stock</h3>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Price</label>
                      <p className="text-sm">${selectedProduct.price}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Compare Price</label>
                      <p className="text-sm">${selectedProduct.comparePrice || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Cost Price</label>
                      <p className="text-sm">${selectedProduct.costPrice}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Stock</label>
                      <p className="text-sm">{selectedProduct.stock}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Category & Brand</h3>
                <div className="space-y-2">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Category</label>
                    <p className="text-sm">{selectedProduct.category}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Subcategory</label>
                    <p className="text-sm">{selectedProduct.subcategory || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Brand</label>
                    <p className="text-sm">{selectedProduct.brand}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Status & Analytics</h3>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Status</label>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          selectedProduct.status === "active"
                            ? "bg-green-100 text-green-800"
                            : selectedProduct.status === "out_of_stock"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {selectedProduct.status}
                      </span>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Featured</label>
                      <p className="text-sm">{selectedProduct.isFeatured ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Views</label>
                      <p className="text-sm">{selectedProduct.viewCount}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Sales</label>
                      <p className="text-sm">{selectedProduct.sellCount}</p>
                    </div>
                  </div>
                </div>
              </div>
              {selectedProduct.specifications && (
                <div className="md:col-span-2 space-y-4">
                  <h3 className="text-lg font-semibold">Specifications</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {selectedProduct.specifications.color && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Color</label>
                        <p className="text-sm">{selectedProduct.specifications.color}</p>
                      </div>
                    )}
                    {selectedProduct.specifications.material && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Material</label>
                        <p className="text-sm">{selectedProduct.specifications.material}</p>
                      </div>
                    )}
                    {selectedProduct.specifications.size && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Size</label>
                        <p className="text-sm">{selectedProduct.specifications.size}</p>
                      </div>
                    )}
                    {selectedProduct.specifications.penType && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Pen Type</label>
                        <p className="text-sm">{selectedProduct.specifications.penType}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {selectedProduct.tags.length > 0 && (
                <div className="md:col-span-2 space-y-4">
                  <h3 className="text-lg font-semibold">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
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
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product
              and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
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