'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import SellerSidebar from '@/components/seller/SellerSidebar';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import PriceInput from '@/components/ui/PriceInput';
import Toast from '@/components/ui/Toast';
import Modal from '@/components/ui/Modal';
import { api } from '@/lib/api';

interface Category {
  id: string;
  name: string;
  nameEn: string | null;
  slug: string;
  parentId: string | null;
  icon: string | null;
  order: number;
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [productImage, setProductImage] = useState<string | null>(null);
  const [detailImages, setDetailImages] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    comparePrice: '',
    stock: '',
    status: 'ACTIVE',
  });

  useEffect(() => {
    fetchCategories();
    loadProduct();
  }, [productId]);

  const fetchCategories = async () => {
    try {
      const data = await api.getCategories();
      setCategories(data as Category[]);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const loadProduct = async () => {
    try {
      const data: any = await api.getProduct(productId);
      setFormData({
        name: data.name || '',
        description: data.description || '',
        price: data.price?.toString() || '',
        comparePrice: data.comparePrice?.toString() || '',
        stock: data.stock?.toString() || '',
        status: data.status || 'ACTIVE',
      });
      if (data.categories && data.categories.length > 0) {
        setSelectedCategories(data.categories.map((c: any) => c.categoryId || c.id));
      }
      if (data.images && data.images.length > 0) {
        // Sort images by order
        const sortedImages = [...data.images].sort((a, b) => (a.order || 0) - (b.order || 0));
        setProductImage(sortedImages[0].url);
        if (sortedImages.length > 1) {
          setDetailImages(sortedImages.slice(1).map((img: any) => img.url));
        }
      }
    } catch (error) {
      console.error('Failed to load product:', error);
      setToastMessage('Không thể tải thông tin sản phẩm');
      setToastType('error');
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleImageClick = () => {
    setToastMessage('Tính năng upload hình ảnh đang được phát triển');
    setToastType('error');
    setShowToast(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const dataToSubmit = {
        name: formData.name,
        description: formData.description || undefined,
        price: parseFloat(formData.price),
        comparePrice: formData.comparePrice ? parseFloat(formData.comparePrice) : undefined,
        stock: parseInt(formData.stock),
        status: formData.status,
        categoryIds: selectedCategories.length > 0 ? selectedCategories : undefined,
      };

      await api.updateProduct(productId, dataToSubmit);
      
      // Show success modal instead of toast
      setShowSuccessModal(true);
      
      // Reload product data
      await loadProduct();
    } catch (error) {
      setToastMessage('Có lỗi xảy ra. Vui lòng thử lại');
      setToastType('error');
      setShowToast(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoToProductList = () => {
    router.push('/seller/products');
  };

  const handleContinueEditing = () => {
    setShowSuccessModal(false);
  };

  const handleGoBack = () => {
    router.push('/seller/products');
  };

  const handleDelete = async () => {
    try {
      await api.deleteProduct(productId);
      setToastMessage('Đã xóa sản phẩm thành công');
      setToastType('success');
      setShowToast(true);
      
      // Navigate back after a short delay
      setTimeout(() => {
        router.push('/seller/dashboard?tab=products');
      }, 1000);
    } catch (error) {
      setToastMessage('Không thể xóa sản phẩm');
      setToastType('error');
      setShowToast(true);
    } finally {
      setShowDeleteModal(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex">
        <SellerSidebar activeTab="products" />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-[#94A3B8]">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}

      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-[#0F172A] mb-4">Xác nhận xóa sản phẩm</h3>
          <p className="text-[#475569] mb-6">Bạn có chắc muốn xóa sản phẩm này không?</p>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Hủy
            </Button>
            <Button variant="primary" onClick={handleDelete}>
              Xóa
            </Button>
          </div>
        </div>
      </Modal>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Darker Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowSuccessModal(false)}
          />

          {/* Modal Content */}
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 animate-slide-in">
            <div className="p-8 text-center">
              {/* Success Icon */}
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h3 className="text-xl font-semibold text-[#0F172A] mb-2">Cập nhật thành công</h3>
              <p className="text-[#64748B] mb-6">Sản phẩm đã được cập nhật thành công</p>
              
              <div className="flex gap-3 justify-center">
                <Button 
                  variant="outline" 
                  onClick={handleContinueEditing}
                  className="min-w-[160px]"
                >
                  Tiếp tục chỉnh sửa
                </Button>
                <Button 
                  variant="primary" 
                  onClick={handleGoToProductList}
                  className="min-w-[160px]"
                >
                  Danh sách sản phẩm
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex h-screen overflow-hidden">
        <SellerSidebar activeTab="products" />
        
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Fixed Header */}
          <div className="flex-shrink-0 p-6 bg-[#F8FAFC] border-b border-[#E5E7EB]">
            <button
              onClick={handleGoBack}
              className="flex items-center gap-2 text-[#64748B] hover:text-[#0F172A] transition-colors mb-4"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="text-sm font-medium">Quay lại</span>
            </button>
            <h1 className="text-2xl font-bold text-[#0F172A]">Chi Tiết Sản Phẩm</h1>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 bg-[#F8FAFC]">
            <form onSubmit={handleSubmit} className="max-w-5xl mx-auto">
              <div className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] p-6 space-y-6">
              {/* Product Images */}
              <div className="grid grid-cols-10 gap-6">
                {/* Main Image - 3/10 */}
                <div className="col-span-3">
                  <label className="block text-sm font-medium text-[#475569] mb-3">
                    Ảnh Trưng Bày
                  </label>
                  <button
                    type="button"
                    onClick={handleImageClick}
                    className="w-full aspect-square rounded-lg border-2 border-dashed border-[#E5E7EB] hover:border-[#F97316] transition-colors flex items-center justify-center bg-[#F8FAFC] overflow-hidden group"
                  >
                    {productImage ? (
                      <img src={productImage} alt="Product" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center">
                        <svg className="w-12 h-12 mx-auto text-[#94A3B8] group-hover:text-[#F97316] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <p className="text-xs text-[#94A3B8] mt-2">Thêm ảnh chính</p>
                      </div>
                    )}
                  </button>
                </div>

                {/* Detail Images - 7/10 */}
                <div className="col-span-7">
                  <label className="block text-sm font-medium text-[#475569] mb-3">
                    Ảnh Chi Tiết
                  </label>
                  <div className="space-y-3">
                    {/* Add button */}
                    <button
                      type="button"
                      onClick={handleImageClick}
                      className="w-32 h-32 rounded-lg border-2 border-dashed border-[#E5E7EB] hover:border-[#F97316] transition-colors flex items-center justify-center bg-[#F8FAFC] group"
                    >
                      <div className="text-center">
                        <svg className="w-8 h-8 mx-auto text-[#94A3B8] group-hover:text-[#F97316] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <p className="text-xs text-[#94A3B8] mt-1">Thêm ảnh</p>
                      </div>
                    </button>
                    
                    {/* Display detail images if any */}
                    {detailImages.length > 0 && (
                      <div className="grid grid-cols-5 gap-3">
                        {detailImages.map((image, index) => (
                          <div key={index} className="relative group/img">
                            <div className="aspect-square rounded-lg overflow-hidden border border-[#E5E7EB]">
                              <img src={image} alt={`Detail ${index + 1}`} className="w-full h-full object-cover" />
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const newImages = detailImages.filter((_, i) => i !== index);
                                setDetailImages(newImages);
                              }}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Basic Info */}
              <div className="space-y-4">
                <Input
                  label="Tên sản phẩm"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                  placeholder="Nhập tên sản phẩm"
                />

                <div>
                  <label className="block text-sm font-medium text-[#475569] mb-2">
                    Mô tả sản phẩm
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    rows={5}
                    className="w-full px-4 py-3 border border-[#E5E7EB] rounded-sm text-sm focus:border-[#F97316] focus:outline-none focus:ring-0 text-[#0F172A]"
                    placeholder="Mô tả chi tiết về sản phẩm"
                  />
                </div>
              </div>

              {/* Price & Stock */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid grid-cols-2 gap-4 col-span-2">
                  <PriceInput
                    label="Giá bán (VNĐ)"
                    name="price"
                    value={formData.price}
                    onChange={handleFormChange}
                    required
                    placeholder="0"
                  />

                  <div>
                    <label className="block text-sm font-medium text-[#475569] mb-2">
                      Danh mục
                    </label>
                    <select
                      multiple
                      value={selectedCategories}
                      onChange={(e) => {
                        const selected = Array.from(e.target.selectedOptions, option => option.value);
                        setSelectedCategories(selected);
                      }}
                      className="w-full px-4 py-3 border border-[#E5E7EB] rounded-sm text-sm focus:border-[#F97316] focus:outline-none focus:ring-0 text-[#0F172A] h-[120px]"
                    >
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-[#94A3B8] mt-1">Giữ Ctrl để chọn nhiều</p>
                  </div>

                  <PriceInput
                    label="Giá gốc (VNĐ)"
                    name="comparePrice"
                    value={formData.comparePrice}
                    onChange={handleFormChange}
                    placeholder="0"
                  />

                  <Input
                    label="Số lượng trong kho"
                    name="stock"
                    type="number"
                    value={formData.stock}
                    onChange={handleFormChange}
                    required
                    placeholder="0"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#475569] mb-2">
                    Trạng thái
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 border border-[#E5E7EB] rounded-sm text-sm focus:border-[#F97316] focus:outline-none focus:ring-0 text-[#0F172A]"
                  >
                    <option value="ACTIVE">Đang bán</option>
                    <option value="INACTIVE">Ngừng bán</option>
                  </select>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 justify-end pt-4 border-t border-[#E5E7EB]">
                <Button 
                  type="submit" 
                  variant="primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Đang lưu...' : 'Cập Nhật'}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
    </div>
  );
}
