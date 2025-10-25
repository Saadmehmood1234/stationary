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
import { Loader2, ArrowLeft, Save, AlertCircle } from 'lucide-react'

interface EditProductFormProps {
  product: Product
}

interface FormErrors {
  [key: string]: string
}

const EditProductForm = ({ product }: EditProductFormProps) => {
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
        router.refresh()
      } else {
        setServerError(result.error || 'Failed to update product')
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
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
          <p className="text-gray-600 mt-1">Update product information and inventory details</p>
        </div>
      </div>
      {serverError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Essential product details and identification
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-1">
                  Product Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  className={errors.name ? 'border-red-500' : ''}
                  disabled={isLoading}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="sku" className="flex items-center gap-1">
                  SKU <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="sku"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  placeholder="Enter SKU"
                  className={errors.sku ? 'border-red-500' : ''}
                  disabled={isLoading}
                />
                {errors.sku && <p className="text-sm text-red-500">{errors.sku}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="shortDescription" className="flex items-center gap-1">
                Short Description <span className="text-red-500">*</span>
              </Label>
              <Input
                id="shortDescription"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                placeholder="Brief description for product listings"
                className={errors.shortDescription ? 'border-red-500' : ''}
                disabled={isLoading}
              />
              {errors.shortDescription && <p className="text-sm text-red-500">{errors.shortDescription}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="flex items-center gap-1">
                Full Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Detailed product description"
                rows={4}
                className={errors.description ? 'border-red-500' : ''}
                disabled={isLoading}
              />
              {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pricing & Inventory</CardTitle>
            <CardDescription>
              Product pricing, costs, and stock management
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price" className="flex items-center gap-1">
                  Price <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={handleNumberChange}
                    className={`pl-8 ${errors.price ? 'border-red-500' : ''}`}
                    disabled={isLoading}
                  />
                </div>
                {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="comparePrice">Compare Price</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                  <Input
                    id="comparePrice"
                    name="comparePrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.comparePrice}
                    onChange={handleNumberChange}
                    className={`pl-8 ${errors.comparePrice ? 'border-red-500' : ''}`}
                    disabled={isLoading}
                  />
                </div>
                {errors.comparePrice && <p className="text-sm text-red-500">{errors.comparePrice}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="costPrice" className="flex items-center gap-1">
                  Cost Price <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                  <Input
                    id="costPrice"
                    name="costPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.costPrice}
                    onChange={handleNumberChange}
                    className={`pl-8 ${errors.costPrice ? 'border-red-500' : ''}`}
                    disabled={isLoading}
                  />
                </div>
                {errors.costPrice && <p className="text-sm text-red-500">{errors.costPrice}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stock" className="flex items-center gap-1">
                  Stock Quantity <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={handleNumberChange}
                  className={errors.stock ? 'border-red-500' : ''}
                  disabled={isLoading}
                />
                {errors.stock && <p className="text-sm text-red-500">{errors.stock}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="flex items-center gap-1">
                  Status <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange('status', value)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                    <SelectItem value="discontinued">Discontinued</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Category & Brand</CardTitle>
            <CardDescription>
              Product categorization and brand information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category" className="flex items-center gap-1">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="Enter category"
                  className={errors.category ? 'border-red-500' : ''}
                  disabled={isLoading}
                />
                {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="brand" className="flex items-center gap-1">
                  Brand <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  placeholder="Enter brand"
                  className={errors.brand ? 'border-red-500' : ''}
                  disabled={isLoading}
                />
                {errors.brand && <p className="text-sm text-red-500">{errors.brand}</p>}
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="flex gap-4 justify-end pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} className="min-w-32">
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Updating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Update Product
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default EditProductForm