"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, 
  Image as ImageIcon, 
  Copy, 
  Check, 
  Trash2, 
  Download,
  Loader2,
  FolderOpen,
  Search,
  BarChart3,
  RefreshCw
} from "lucide-react";
import { 
  uploadImageAction, 
  deleteImageAction, 
  getUploadedImagesAction,
  getImageStatsAction 
} from '@/app/actions/cloudinary-actions';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';
import { toast } from "react-hot-toast"

interface UploadedImage {
  _id: string;  
  url: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  publicId: string;
  folder?: string;
  tags?: string[];
  uploadedAt: string;
  updatedAt: string;
}

export default function ImageUploadPage() {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState<{
    totalImages: number;
    totalSize: number;
    imagesByType: Record<string, number>;
    recentUploads: number;
  } | null>(null);
  
  // Delete modal state
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    publicId: string | null;
    fileName: string | null;
    isLoading: boolean;
  }>({
    isOpen: false,
    publicId: null,
    fileName: null,
    isLoading: false,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load images on component mount
  useEffect(() => {
    loadImages();
    loadStats();
  }, []);

  const loadImages = async () => {
    try {
      setIsLoading(true);
      const result = await getUploadedImagesAction({
        search: searchTerm || undefined,
      });
      
      if (result.success && result.data) {
        setUploadedImages(result.data);
      }
    } catch (error) {
      console.error('Error loading images:', error);
      toast.error('Failed to load images');
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const result = await getImageStatsAction();
      if (result.success && result.data) {
        setStats(result.data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  // Open delete confirmation modal
  const openDeleteModal = (publicId: string, fileName: string) => {
    setDeleteModal({
      isOpen: true,
      publicId,
      fileName,
      isLoading: false,
    });
  };

  // Close delete confirmation modal
  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      publicId: null,
      fileName: null,
      isLoading: false,
    });
  };

  // Handle image deletion
  const handleDeleteImage = async () => {
    if (!deleteModal.publicId || !deleteModal.fileName) return;

    setDeleteModal(prev => ({ ...prev, isLoading: true }));

    try {
      const result = await deleteImageAction(deleteModal.publicId);
      
      if (result.success) {
        setUploadedImages(prev => prev.filter(img => img.publicId !== deleteModal.publicId));
        toast.success(`"${deleteModal.fileName}" deleted successfully`);
        loadStats();
      } else {
        toast.error(result.error || 'Delete failed');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete image');
    } finally {
      closeDeleteModal();
    }
  };

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        if (!file.type.startsWith('image/')) {
          toast.error('Please upload only image files');
          continue;
        }

        if (file.size > 10 * 1024 * 1024) {
          toast.error('File size must be less than 10MB');
          continue;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'website-uploads');
        
        const result = await uploadImageAction(formData);
        
        if (result.success && result.data) {
          // Add new image to the beginning of the list
          setUploadedImages(prev => [result.data!, ...prev]);
          toast.success(`"${file.name}" uploaded successfully`);
        } else {
          toast.error(result.error || `Failed to upload ${file.name}`);
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload failed');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      // Reload stats to reflect new uploads
      loadStats();
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleUploadAreaClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      fileInputRef.current?.click();
    }
  };

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2000);
      toast.success('URL copied to clipboard');
    } catch (err) {
      console.error('Failed to copy:', err);
      toast.error('Failed to copy URL');
    }
  };

  const downloadImage = (url: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`"${fileName}" download started`);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#171E21] via-[#171E21] to-slate-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-[#D5D502] to-blue-200 bg-clip-text text-transparent mb-4">
            Cloudinary Image Manager
          </h1>
          <p className="text-gray-300 text-lg">
            Upload, manage, and organize your images with persistent storage
          </p>
        </motion.div>

        {/* Stats Bar */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            {/* ... stats cards remain the same ... */}
          </motion.div>
        )}

        {/* Search and Upload Area */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search images by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && loadImages()}
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:ring-2 focus:ring-[#D5D502] focus:border-transparent text-white placeholder-gray-400"
              />
            </div>
          </div>

          {/* Upload Area */}
          <div className="lg:w-96">
            <div
              className={`
                relative border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-300 cursor-pointer h-full
                ${isDragging 
                  ? 'border-[#D5D502] bg-[#D5D502]/10' 
                  : 'border-gray-600 hover:border-[#D5D502] hover:bg-white/5'
                }
                ${isUploading ? 'opacity-50 pointer-events-none' : ''}
              `}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleUploadAreaClick}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleFileSelect(e.target.files)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              
              <div className="space-y-3">
                <div className="flex justify-center">
                  <div className="p-3 bg-[#D5D502]/10 rounded-full">
                    {isUploading ? (
                     <RefreshCw className="h-12 w-12 animate-spin text-[#D5D502] mx-auto mb-4" />
                    ) : (
                      <Upload className="w-6 h-6 text-[#D5D502]" />
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {isUploading ? 'Uploading...' : 'Upload Images'}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Drag & drop or click to browse
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Images Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
           <RefreshCw className="h-12 w-12 animate-spin text-[#D5D502] mx-auto mb-4" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence>
              {uploadedImages.map((image, index) => (
                <motion.div
                  key={image._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden group hover:border-[#D5D502]/40 transition-all duration-300"
                >
                  <div className="relative aspect-square bg-gray-800 overflow-hidden">
                    <img
                      src={image.url}
                      alt={image.fileName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(image.url);
                        }}
                        className="p-2 bg-[#D5D502] text-gray-900 rounded-full hover:scale-110 transition-transform duration-200"
                        title="Copy URL"
                      >
                        {copiedUrl === image.url ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadImage(image.url, image.fileName);
                        }}
                        className="p-2 bg-blue-500 text-white rounded-full hover:scale-110 transition-transform duration-200"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeleteModal(image.publicId, image.fileName);
                        }}
                        className="p-2 bg-red-500 text-white rounded-full hover:scale-110 transition-transform duration-200"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <h3 className="font-medium text-white text-sm truncate flex-1 mr-2">
                        {image.fileName}
                      </h3>
                      <span className="text-xs text-gray-400 bg-white/10 px-2 py-1 rounded-full whitespace-nowrap">
                        {formatFileSize(image.fileSize)}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs text-gray-400 font-medium">Public URL</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={image.url}
                          readOnly
                          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-gray-300 truncate"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(image.url);
                          }}
                          className="px-3 py-2 bg-[#D5D502] text-gray-900 rounded-lg hover:bg-[#D5D502]/90 transition-colors text-xs font-medium flex items-center gap-1"
                        >
                          {copiedUrl === image.url ? (
                            <>
                              <Check className="w-3 h-3" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              Copy
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{image.fileType.split('/')[1]?.toUpperCase()}</span>
                      <span>{formatDate(image.uploadedAt)}</span>
                    </div>

                    {image.folder && (
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <FolderOpen className="w-3 h-3" />
                        <span>{image.folder}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Empty State */}
        {!isLoading && uploadedImages.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10"
          >
            <ImageIcon className="w-20 h-20 text-gray-600 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-400 mb-2">
              No images found
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {searchTerm 
                ? `No images matching "${searchTerm}" found in your library.`
                : 'Upload your first image to get started with your media library.'
              }
            </p>
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  loadImages();
                }}
                className="px-6 py-2 bg-[#D5D502] text-gray-900 rounded-full hover:bg-[#D5D502]/90 transition-colors font-medium"
              >
                Clear Search
              </button>
            )}
          </motion.div>
        )}

        {/* Delete Confirmation Modal */}
        <ConfirmDeleteModal
          isOpen={deleteModal.isOpen}
          onClose={closeDeleteModal}
          onConfirm={handleDeleteImage}
          title="Delete Image"
          description={`Are you sure you want to delete "${deleteModal.fileName}"? This action cannot be undone and the image will be permanently removed from Cloudinary.`}
          isLoading={deleteModal.isLoading}
        />
      </div>
    </div>
  );
}