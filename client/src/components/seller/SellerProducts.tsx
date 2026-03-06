'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Toast from '@/components/ui/Toast';
import { api } from '@/lib/api';

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  comparePrice?: number;
  stock: number;
  sold: number;
  status: 'ACTIVE' | 'INACTIVE';
  rating: number;
  ratingCount: number;
  images: { url: string; order: number }[];
  categories?: { category: { id: string; name: string } }[];
  createdAt: string;
  updatedAt: string;
}

export default function SellerProducts() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [hasShop, setHasShop] = useState(true);

  // Format number with dots as thousand separator
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      console.log('Loading products...');
      const response: any = await api.getMyProducts();
      console.log('Products response:', response);
      console.log('Response type:', typeof response);
      console.log('Response.data:', response?.data);
      console.log('Is response.data array?', Array.isArray(response?.data));
      
      // Handle paginated response: { data: [], meta: {} }
      const productData = response?.data || [];
      console.log('Product data:', productData);
      console.log('Product data length:', productData.length);
      
      setProducts(Array.isArray(productData) ? productData : []);
      setHasShop(true);
    } catch (error: any) {
      console.error('Failed to load products:', error);
      if (error.message?.includes('do not have a shop')) {
        setHasShop(false);
        setToastMessage('Bạn cần tạo cửa hàng trước khi thêm sản phẩm');
        setToastType('error');
        setShowToast(true);
      }
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNew = () => {
    router.push('/seller/products/new');
  };

  const handleEdit = (product: Product) => {
    router.push(`/seller/products/edit/${product.id}`);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    
    try {
      await api.deleteProduct(deleteId);
      await loadProducts();
      setToastMessage('Đã xóa sản phẩm thành công');
      setToastType('success');
      setShowToast(true);
    } catch (error) {
      setToastMessage('Không thể xóa sản phẩm');
      setToastType('error');
      setShowToast(true);
    } finally {
      setShowDeleteModal(false);
      setDeleteId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[#94A3B8]">Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
            <Button variant="primary" onClick={handleDeleteConfirm}>
              Xóa
            </Button>
          </div>
        </div>
      </Modal>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] mb-2">Quản Lý Sản Phẩm</h1>
          <p className="text-[#64748B]">Quản lý tất cả sản phẩm của cửa hàng</p>
        </div>
        <Button variant="primary" onClick={handleAddNew}>
          + Thêm Sản Phẩm
        </Button>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <svg className="w-16 h-16 mx-auto text-[#94A3B8] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <p className="text-[#94A3B8] mb-4">
            {hasShop ? 'Chưa có sản phẩm nào' : 'Bạn cần tạo cửa hàng trước'}
          </p>
          {!hasShop && (
            <Button variant="primary" onClick={() => router.push('/seller/dashboard')}>
              Tạo Cửa Hàng
            </Button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] overflow-hidden">
          <table className="w-full table-fixed">
            <colgroup>
              <col className="w-auto" />
              <col className="w-40" />
              <col className="w-32" />
              <col className="w-32" />
              <col className="w-24" />
              <col className="w-25" />
              <col className="w-32" />
            </colgroup>
            <thead className="bg-[#F8FAFC] border-b border-[#E5E7EB]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#64748B] uppercase tracking-wider border-r border-[#E5E7EB]">
                  Sản phẩm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#64748B] uppercase tracking-wider border-r border-[#E5E7EB]">
                  Danh mục
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-[#64748B] uppercase tracking-wider border-r border-[#E5E7EB]">
                  Giá gốc
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-[#64748B] uppercase tracking-wider border-r border-[#E5E7EB]">
                  Giá bán
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#64748B] uppercase tracking-wider border-r border-[#E5E7EB]">
                  Kho
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#64748B] uppercase tracking-wider border-r border-[#E5E7EB]">
                  Đã bán
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#64748B] uppercase tracking-wider">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {products.map((product) => (
                <tr 
                  key={product.id} 
                  onClick={() => handleEdit(product)}
                  className="group hover:bg-[#FFF7ED] transition-colors cursor-pointer"
                >
                  <td className="px-6 py-3 border-r border-[#E5E7EB]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#F1F5F9] rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                        {product.images && product.images.length > 0 ? (
                          <img 
                            src={product.images.sort((a, b) => (a.order || 0) - (b.order || 0))[0].url} 
                            alt={product.name} 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <svg className="w-5 h-5 text-[#94A3B8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-[#0F172A] truncate group-hover:font-medium">{product.name}</p>
                        {product.images && product.images.length > 1 && (
                          <p className="text-xs text-[#94A3B8]">+{product.images.length - 1} ảnh</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3 border-r border-[#E5E7EB]">
                    {product.categories && product.categories.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {product.categories.slice(0, 2).map((cat, idx) => (
                          <span key={idx} className="inline-flex px-2 py-1 text-xs bg-[#F1F5F9] text-[#475569] rounded">
                            {cat.category.name}
                          </span>
                        ))}
                        {product.categories.length > 2 && (
                          <span className="inline-flex px-2 py-1 text-xs text-[#94A3B8]">
                            +{product.categories.length - 2}
                          </span>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-[#94A3B8]">-</p>
                    )}
                  </td>
                  <td className="px-6 py-3 border-r border-[#E5E7EB] text-right">
                    {product.comparePrice ? (
                      <p className="text-sm text-[#0F172A] group-hover:font-medium">
                        {formatPrice(product.comparePrice)}đ
                      </p>
                    ) : (
                      <p className="text-sm text-[#94A3B8]">-</p>
                    )}
                  </td>
                  <td className="px-6 py-3 border-r border-[#E5E7EB] text-right">
                    <p className="text-sm text-[#0F172A] group-hover:font-medium">
                      {formatPrice(product.price || 0)}đ
                    </p>
                  </td>
                  <td className="px-6 py-3 text-sm text-[#0F172A] border-r border-[#E5E7EB] group-hover:font-medium">
                    {product.stock || 0}
                  </td>
                  <td className="px-6 py-3 text-sm text-[#0F172A] border-r border-[#E5E7EB] group-hover:font-medium">
                    {product.sold || 0}
                  </td>
                  <td className="px-6 py-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      product.status === 'ACTIVE'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {product.status === 'ACTIVE' ? 'Đang bán' : 'Ngừng bán'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
