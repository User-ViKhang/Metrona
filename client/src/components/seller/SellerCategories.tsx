'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Toast from '@/components/ui/Toast';
import { api } from '@/lib/api';

interface Category {
  id: string;
  name: string;
  nameEn: string | null;
  slug: string;
  parentId: string | null;
  icon: string | null;
  order: number;
  isActive: boolean;
  parent?: {
    id: string;
    name: string;
  };
  _count?: {
    children: number;
    products: number;
  };
  createdAt: string;
  updatedAt: string;
}

export default function SellerCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [formData, setFormData] = useState({
    name: '',
    nameEn: '',
    parentId: '',
    order: '0',
  });
  const [filters, setFilters] = useState({
    name: '',
    parentName: '',
    order: '',
    status: '',
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await api.getCategoriesForAdmin();
      setCategories(data as Category[]);
    } catch (error) {
      console.error('Failed to load categories:', error);
      setToastMessage('Không thể tải danh sách danh mục');
      setToastType('error');
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      nameEn: '',
      parentId: '',
      order: '0',
    });
    setShowModal(true);
  };

  const handleAddSubCategory = (parentCategory: Category) => {
    setEditingCategory(null);
    setFormData({
      name: '',
      nameEn: '',
      parentId: parentCategory.id,
      order: (parentCategory.order + 1).toString(),
    });
    setShowModal(true);
  };

  const handleRowClick = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      nameEn: category.nameEn || '',
      parentId: category.parentId || '',
      order: category.order.toString(),
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const dataToSubmit = {
        name: formData.name,
        nameEn: formData.nameEn || undefined,
        parentId: formData.parentId || undefined,
        order: parseInt(formData.order),
      };

      if (editingCategory) {
        await api.updateCategory(editingCategory.id, dataToSubmit);
        setToastMessage('Cập nhật danh mục thành công');
      } else {
        await api.createCategory(dataToSubmit);
        setToastMessage('Thêm danh mục mới thành công');
      }

      setToastType('success');
      setShowToast(true);
      setShowModal(false);
      await loadCategories();
    } catch (error: any) {
      setToastMessage(error.message || 'Có lỗi xảy ra');
      setToastType('error');
      setShowToast(true);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const filteredCategories = categories.filter(category => {
    // Filter by name
    if (filters.name && !category.name.toLowerCase().includes(filters.name.toLowerCase())) {
      return false;
    }
    
    // Filter by parent name
    if (filters.parentName) {
      const parentName = category.parent?.name || '';
      if (!parentName.toLowerCase().includes(filters.parentName.toLowerCase())) {
        return false;
      }
    }
    
    // Filter by order
    if (filters.order && category.order.toString() !== filters.order) {
      return false;
    }
    
    // Filter by status
    if (filters.status) {
      const isActive = filters.status === 'active';
      if (category.isActive !== isActive) {
        return false;
      }
    }
    
    return true;
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'parentId') {
      // Khi chọn danh mục cha, tự động set order = parent.order + 1
      if (value) {
        const parentCategory = categories.find(cat => cat.id === value);
        if (parentCategory) {
          setFormData(prev => ({
            ...prev,
            parentId: value,
            order: (parentCategory.order + 1).toString(),
          }));
          return;
        }
      } else {
        // Khi bỏ chọn danh mục cha, reset order về 0
        setFormData(prev => ({
          ...prev,
          parentId: '',
          order: '0',
        }));
        return;
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-[#0F172A] mb-4">
            {editingCategory ? 'Chỉnh Sửa Danh Mục' : 'Thêm Danh Mục Mới'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Tên danh mục"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              required
              placeholder="Nhập tên danh mục"
            />

            <Input
              label="Tên tiếng Anh (tùy chọn)"
              name="nameEn"
              value={formData.nameEn}
              onChange={handleFormChange}
              placeholder="English name"
            />

            <div>
              <label className="block text-sm font-medium text-[#475569] mb-2">
                Danh mục cha (tùy chọn)
              </label>
              <select
                name="parentId"
                value={formData.parentId}
                onChange={handleFormChange}
                className="w-full px-4 py-3 border border-[#E5E7EB] rounded-sm text-sm focus:border-[#F97316] focus:outline-none focus:ring-0 text-[#0F172A]"
              >
                <option value="">=== Không có ===</option>
                {categories
                  .filter(cat => cat.id !== editingCategory?.id)
                  .map((category) => {
                    const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
                    const dashes = '---'.repeat(category.order + 1);
                    const level = romanNumerals[category.order] || 'I';
                    return (
                      <option key={category.id} value={category.id}>
                        {`${dashes} ${level} ${category.name}`}
                      </option>
                    );
                  })}
              </select>
            </div>

            {!formData.parentId && (
              <div>
                <label className="block text-sm font-medium text-[#475569] mb-2">
                  Phân cấp
                </label>
                <select
                  name="order"
                  value={formData.order}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 border border-[#E5E7EB] rounded-sm text-sm focus:border-[#F97316] focus:outline-none focus:ring-0 text-[#0F172A]"
                >
                  <option value="0">I</option>
                  <option value="1">II</option>
                  <option value="2">III</option>
                  <option value="3">IV</option>
                  <option value="4">V</option>
                  <option value="5">VI</option>
                  <option value="6">VII</option>
                  <option value="7">VIII</option>
                  <option value="8">IX</option>
                  <option value="9">X</option>
                </select>
              </div>
            )}

            <div className="flex gap-3 justify-end pt-4">
              <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                Hủy
              </Button>
              <Button type="submit" variant="primary">
                {editingCategory ? 'Cập Nhật' : 'Thêm Mới'}
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] mb-2">Quản Lý Danh Mục</h1>
          <p className="text-[#64748B]">Quản lý danh mục sản phẩm</p>
        </div>
        <Button variant="primary" onClick={handleAddNew}>
          + Thêm Danh Mục
        </Button>
      </div>

      {categories.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <svg className="w-16 h-16 mx-auto text-[#94A3B8] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <p className="text-[#94A3B8]">Chưa có danh mục nào</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#F8FAFC] border-b border-[#E5E7EB]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#64748B] uppercase tracking-wider whitespace-nowrap border-r border-[#E5E7EB]">
                  Tên danh mục
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#64748B] uppercase tracking-wider whitespace-nowrap border-r border-[#E5E7EB]">
                  Danh mục cha
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-[#64748B] uppercase tracking-wider whitespace-nowrap border-r border-[#E5E7EB]">
                  Danh mục con
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-[#64748B] uppercase tracking-wider whitespace-nowrap border-r border-[#E5E7EB]">
                  Sản phẩm
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-[#64748B] uppercase tracking-wider whitespace-nowrap border-r border-[#E5E7EB]">
                  Phân cấp
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-[#64748B] uppercase tracking-wider whitespace-nowrap">
                  Trạng thái
                </th>
              </tr>
              {/* Filter Row */}
              <tr className="bg-white border-b border-[#E5E7EB]">
                <th className="px-4 py-2 border-r border-[#E5E7EB]">
                  <input
                    type="text"
                    name="name"
                    value={filters.name}
                    onChange={handleFilterChange}
                    placeholder="Lọc tên..."
                    className="w-full px-3 py-1.5 border border-[#E5E7EB] rounded text-xs focus:border-[#F97316] focus:outline-none"
                  />
                </th>
                <th className="px-4 py-2 border-r border-[#E5E7EB]">
                  <input
                    type="text"
                    name="parentName"
                    value={filters.parentName}
                    onChange={handleFilterChange}
                    placeholder="Lọc danh mục cha..."
                    className="w-full px-3 py-1.5 border border-[#E5E7EB] rounded text-xs focus:border-[#F97316] focus:outline-none"
                  />
                </th>
                <th className="px-4 py-2 border-r border-[#E5E7EB]">
                  {/* Empty for children count */}
                </th>
                <th className="px-4 py-2 border-r border-[#E5E7EB]">
                  {/* Empty for products count */}
                </th>
                <th className="px-4 py-2 border-r border-[#E5E7EB]">
                  <select
                    name="order"
                    value={filters.order}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-1.5 border border-[#E5E7EB] rounded text-xs focus:border-[#F97316] focus:outline-none"
                  >
                    <option value="">Tất cả</option>
                    <option value="0">I</option>
                    <option value="1">II</option>
                    <option value="2">III</option>
                    <option value="3">IV</option>
                    <option value="4">V</option>
                    <option value="5">VI</option>
                    <option value="6">VII</option>
                    <option value="7">VIII</option>
                    <option value="8">IX</option>
                    <option value="9">X</option>
                  </select>
                </th>
                <th className="px-4 py-2">
                  <select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-1.5 border border-[#E5E7EB] rounded text-xs focus:border-[#F97316] focus:outline-none"
                  >
                    <option value="">Tất cả</option>
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Tạm dừng</option>
                  </select>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {filteredCategories.map((category) => (
                <tr 
                  key={category.id} 
                  className="group hover:bg-[#FFF7ED] transition-colors"
                  onClick={() => handleRowClick(category)}
                >
                  <td className="px-4 py-4 cursor-pointer border-r border-[#E5E7EB]">
                    <div>
                      <p className="text-sm font-medium text-[#0F172A]">{category.name}</p>
                      {category.nameEn && (
                        <p className="text-xs text-[#94A3B8]">{category.nameEn}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-[#475569] cursor-pointer border-r border-[#E5E7EB]">
                    {category.parent ? category.parent.name : '-'}
                  </td>
                  <td className="px-4 py-4 text-center text-sm text-[#475569] cursor-pointer border-r border-[#E5E7EB]">
                    {category._count?.children || 0}
                  </td>
                  <td className="px-4 py-4 text-center text-sm text-[#475569] cursor-pointer border-r border-[#E5E7EB]">
                    {category._count?.products || 0}
                  </td>
                  <td className="px-4 py-4 text-center text-sm text-[#475569] cursor-pointer border-r border-[#E5E7EB]">
                    {['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'][category.order] || 'I'}
                  </td>
                  <td className="py-4 cursor-pointer relative">
                    <div className="flex items-center justify-center pr-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        category.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {category.isActive ? 'Hoạt động' : 'Tạm dừng'}
                      </span>
                    </div>
                    {/* Nút + chèn vào bên phải cột Trạng thái */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddSubCategory(category);
                      }}
                      className="absolute right-0 top-0 h-full w-0 opacity-0 group-hover:w-12 group-hover:opacity-100 transition-all duration-300 ease-in-out bg-[#F97316] text-white flex items-center justify-center hover:bg-[#EA580C]"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
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
