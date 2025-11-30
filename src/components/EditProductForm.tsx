"use client";

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Product, ProductFormData } from '@/types'
import { updateProduct } from '@/app/actions/product.actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, ArrowLeft, Save, AlertCircle, RefreshCw } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast';
interface EditProductFormProps {
  product: Product
}

interface FormErrors {
  [key: string]: string
}

export const EditProductForm = ({ product }: EditProductFormProps) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [serverError, setServerError] = useState<string>('')
  
  const [formData, setFormData] = useState({
    name: product.name,
    sku: product.sku,
    description: product.description,
    shortDescription: product.shortDescription,
    price: product.price,
    comparePrice: product.comparePrice || 0,
    costPrice: product.costPrice,
    stock: product.stock,
    category: product.category,
    brand: product.brand,
    status: product.status,
  })

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Product name is required'
    if (!formData.sku.trim()) newErrors.sku = 'SKU is required'
    if (!formData.shortDescription.trim()) newErrors.shortDescription = 'Short description is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    if (!formData.category.trim()) newErrors.category = 'Category is required'
    if (!formData.brand.trim()) newErrors.brand = 'Brand is required'
    if (formData.price <= 0) newErrors.price = 'Price must be greater than 0'
    if (formData.costPrice <= 0) newErrors.costPrice = 'Cost price must be greater than 0'
    if (formData.stock < 0) newErrors.stock = 'Stock cannot be negative'
    if (formData.comparePrice && formData.comparePrice < formData.price) {
      newErrors.comparePrice = 'Compare price should be greater than regular price'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setServerError('')

    if (!validateForm()) {
      return
    }

    if (!product._id) {
      setServerError('Product ID is missing')
      return
    }

    setIsLoading(true)

    try {
      const result = await updateProduct(product._id, formData)
      
      if (result.success) {
        router.push('/admin/products')
        toast.success("Product Updated Successfully!")
        router.refresh()
      } else {
        setServerError(result.error || 'Failed to update product')
        toast.success("Error in Updating the product")
      }
    } catch (error) {
      setServerError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('Price') || name === 'stock' ? Number(value) : value
    }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const numValue = value === '' ? 0 : Number(value)
    setFormData(prev => ({
      ...prev,
      [name]: numValue
    }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.back()}
          disabled={isLoading}
          className="border-white/20 text-white hover:bg-white/10 rounded-xl"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-[#D5D502] to-[#DACF00] bg-clip-text text-transparent">
            Edit Product
          </h1>
          <p className="text-gray-300 mt-1">Update product information and inventory details</p>
        </div>
      </motion.div>

      {serverError && (
        <Alert variant="destructive" className="bg-red-500/10 border-red-500/30 text-red-300">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-white/5 backdrop-blur-lg border border-white/20 rounded-3xl overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-[#D5D502] to-[#DACF00]"></div>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-white">Basic Information</CardTitle>
              <CardDescription className="text-gray-300">
                Essential product details and identification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-1 text-gray-200">
                    Product Name <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter product name"
                    className={`bg-white/10 border-white/20 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-[#D5D502]/50 ${
                      errors.name ? 'border-red-400' : ''
                    }`}
                    disabled={isLoading}
                  />
                  {errors.name && <p className="text-sm text-red-400">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sku" className="flex items-center gap-1 text-gray-200">
                    SKU <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="sku"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    placeholder="Enter SKU"
                    className={`bg-white/10 border-white/20 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-[#D5D502]/50 ${
                      errors.sku ? 'border-red-400' : ''
                    }`}
                    disabled={isLoading}
                  />
                  {errors.sku && <p className="text-sm text-red-400">{errors.sku}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shortDescription" className="flex items-center gap-1 text-gray-200">
                  Short Description <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="shortDescription"
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleChange}
                  placeholder="Brief description for product listings"
                  className={`bg-white/10 border-white/20 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-[#D5D502]/50 ${
                    errors.shortDescription ? 'border-red-400' : ''
                  }`}
                  disabled={isLoading}
                />
                {errors.shortDescription && <p className="text-sm text-red-400">{errors.shortDescription}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="flex items-center gap-1 text-gray-200">
                  Full Description <span className="text-red-400">*</span>
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Detailed product description"
                  rows={4}
                  className={`bg-white/10 border-white/20 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-[#D5D502]/50 ${
                    errors.description ? 'border-red-400' : ''
                  }`}
                  disabled={isLoading}
                />
                {errors.description && <p className="text-sm text-red-400">{errors.description}</p>}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Pricing & Inventory Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-white/5 backdrop-blur-lg border border-white/20 rounded-3xl overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-[#DACF00] to-[#D5D502]"></div>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-white">Pricing & Inventory</CardTitle>
              <CardDescription className="text-gray-300">
                Product pricing, costs, and stock management
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price" className="flex items-center gap-1 text-gray-200">
                    Price <span className="text-red-400">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-400">₹</span>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={handleNumberChange}
                      className={`bg-white/10 border-white/20 text-white pl-8 rounded-xl focus:ring-2 focus:ring-[#D5D502]/50 ${
                        errors.price ? 'border-red-400' : ''
                      }`}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.price && <p className="text-sm text-red-400">{errors.price}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="comparePrice" className="text-gray-200">Compare Price</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-400">₹</span>
                    <Input
                      id="comparePrice"
                      name="comparePrice"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.comparePrice}
                      onChange={handleNumberChange}
                      className={`bg-white/10 border-white/20 text-white pl-8 rounded-xl focus:ring-2 focus:ring-[#D5D502]/50 ${
                        errors.comparePrice ? 'border-red-400' : ''
                      }`}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.comparePrice && <p className="text-sm text-red-400">{errors.comparePrice}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="costPrice" className="flex items-center gap-1 text-gray-200">
                    Cost Price <span className="text-red-400">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-400">₹</span>
                    <Input
                      id="costPrice"
                      name="costPrice"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.costPrice}
                      onChange={handleNumberChange}
                      className={`bg-white/10 border-white/20 text-white pl-8 rounded-xl focus:ring-2 focus:ring-[#D5D502]/50 ${
                        errors.costPrice ? 'border-red-400' : ''
                      }`}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.costPrice && <p className="text-sm text-red-400">{errors.costPrice}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stock" className="flex items-center gap-1 text-gray-200">
                    Stock Quantity <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={handleNumberChange}
                    className={`bg-white/10 border-white/20 text-white rounded-xl focus:ring-2 focus:ring-[#D5D502]/50 ${
                      errors.stock ? 'border-red-400' : ''
                    }`}
                    disabled={isLoading}
                  />
                  {errors.stock && <p className="text-sm text-red-400">{errors.stock}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status" className="flex items-center gap-1 text-gray-200">
                    Status <span className="text-red-400">*</span>
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleSelectChange('status', value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white rounded-xl cursor-pointer focus:ring-2 focus:ring-[#D5D502]/50">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1f2937] text-white cursor-pointer   border-white/20">
                      <SelectItem value="active" className="focus:text-gray-900 cursor-pointer focus:bg-gradient-to-b focus:from-[#EFB200] focus:to-[#D8D200]">Active</SelectItem>
                      <SelectItem value="inactive" className="focus:text-gray-900 cursor-pointer focus:bg-gradient-to-b focus:from-[#EFB200] focus:to-[#D8D200]">Inactive</SelectItem>
                      <SelectItem value="out_of_stock" className="focus:text-gray-900 cursor-pointer focus:bg-gradient-to-b focus:from-[#EFB200] focus:to-[#D8D200]">Out of Stock</SelectItem>
                      <SelectItem value="discontinued" className="focus:text-gray-900 cursor-pointer focus:bg-gradient-to-b focus:from-[#EFB200] focus:to-[#D8D200]">Discontinued</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Category & Brand Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-white/5 backdrop-blur-lg border border-white/20 rounded-3xl overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-[#D5D502] to-[#DACF00]"></div>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-white">Category & Brand</CardTitle>
              <CardDescription className="text-gray-300">
                Product categorization and brand information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category" className="flex items-center gap-1 text-gray-200">
                    Category <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="Enter category"
                    className={`bg-white/10 border-white/20 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-[#D5D502]/50 ${
                      errors.category ? 'border-red-400' : ''
                    }`}
                    disabled={isLoading}
                  />
                  {errors.category && <p className="text-sm text-red-400">{errors.category}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brand" className="flex items-center gap-1 text-gray-200">
                    Brand <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="brand"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    placeholder="Enter brand"
                    className={`bg-white/10 border-white/20 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-[#D5D502]/50 ${
                      errors.brand ? 'border-red-400' : ''
                    }`}
                    disabled={isLoading}
                  />
                  {errors.brand && <p className="text-sm text-red-400">{errors.brand}</p>}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex gap-4 justify-end pt-6 border-t border-white/10"
        >
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
            className="border-white/20 bg-gray-700 hover:text-gray-200 text-white hover:bg-white/10 rounded-full cursor-pointer"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading}
            className="bg-gradient-to-r from-[#D5D502] to-[#DACF00] hover:from-[#c4c401] hover:to-[#DACF00] text-gray-900 cursor-pointer font-semibold rounded-full transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-[#D5D502]/20 border-0 min-w-32"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-12 w-12 animate-spin text-[#D5D502] mx-auto mb-4" />
                Updating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Update Product
              </>
            )}
          </Button>
        </motion.div>
      </form>
    </div>
  );
};