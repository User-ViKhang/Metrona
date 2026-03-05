'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Toast from '@/components/ui/Toast';
import { api } from '@/lib/api';

interface Address {
  id: string;
  fullName: string;
  phone: string;
  address: string;
  ward: string;
  district: string;
  province: string;
  isDefault: boolean;
}

interface AddressFormData {
  fullName: string;
  phone: string;
  address: string;
  ward: string;
  province: string;
}

interface Province {
  code: number;
  name: string;
}

interface Ward {
  code: string;
  name: string;
}

export default function AddressList() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [formData, setFormData] = useState<AddressFormData>({
    fullName: '',
    phone: '',
    address: '',
    ward: '',
    province: ''
  });
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [loadingWards, setLoadingWards] = useState(false);

  useEffect(() => {
    loadAddresses();
    loadProvinces();
  }, []);

  useEffect(() => {
    if (formData.province) {
      loadWards(formData.province);
    } else {
      setWards([]);
    }
  }, [formData.province]);

  const loadProvinces = async () => {
    try {
      const response = await fetch('https://provinces.open-api.vn/api/p/');
      const data = await response.json();
      setProvinces(data);
    } catch (error) {
      console.error('Failed to load provinces:', error);
    }
  };

  const loadWards = async (provinceCode: string) => {
    setLoadingWards(true);
    try {
      const response = await fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=3`);
      const data = await response.json();
      const allWards: Ward[] = [];
      
      if (data.districts) {
        data.districts.forEach((district: any) => {
          if (district.wards) {
            district.wards.forEach((ward: any) => {
              allWards.push({ 
                code: ward.code.toString(), 
                name: ward.name 
              });
            });
          }
        });
      }
      
      setWards(allWards);
    } catch (error) {
      console.error('Failed to load wards:', error);
      setWards([]);
    } finally {
      setLoadingWards(false);
    }
  };

  const loadAddresses = async () => {
    try {
      const data = await api.getAddresses();
      setAddresses(data as Address[]);
    } catch (error) {
      console.error('Failed to load addresses:', error);
      setAddresses([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await api.setDefaultAddress(id);
      await loadAddresses();
      setToastMessage('Đã đặt làm địa chỉ mặc định');
      setToastType('success');
      setShowToast(true);
    } catch (error) {
      setToastMessage('Không thể đặt địa chỉ mặc định');
      setToastType('error');
      setShowToast(true);
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    
    try {
      await api.deleteAddress(deleteId);
      await loadAddresses();
      setToastMessage('Đã xóa địa chỉ thành công');
      setToastType('success');
      setShowToast(true);
    } catch (error) {
      setToastMessage('Không thể xóa địa chỉ');
      setToastType('error');
      setShowToast(true);
    } finally {
      setShowDeleteModal(false);
      setDeleteId(null);
    }
  };

  const handleAddNew = () => {
    setEditingId(null);
    setFormData({
      fullName: '',
      phone: '',
      address: '',
      ward: '',
      province: ''
    });
    setShowFormModal(true);
  };

  const handleEdit = (address: Address) => {
    setEditingId(address.id);
    // Tìm code của tỉnh từ tên
    const province = provinces.find(p => p.name === address.province);
    setFormData({
      fullName: address.fullName,
      phone: address.phone,
      address: address.address,
      ward: address.ward,
      province: province ? province.code.toString() : ''
    });
    setShowFormModal(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Tìm tên tỉnh từ code
      const selectedProvince = provinces.find(p => p.code.toString() === formData.province);
      const provinceName = selectedProvince ? selectedProvince.name : formData.province;
      
      const dataToSubmit = {
        fullName: formData.fullName,
        phone: formData.phone,
        address: formData.address,
        ward: formData.ward,
        district: 'không tồn tại',
        province: provinceName
      };
      
      if (editingId) {
        await api.updateAddress(editingId, dataToSubmit);
        setToastMessage('Cập nhật địa chỉ thành công');
      } else {
        await api.createAddress(dataToSubmit);
        setToastMessage('Thêm địa chỉ mới thành công');
      }
      
      await loadAddresses();
      setToastType('success');
      setShowToast(true);
      setShowFormModal(false);
    } catch (error) {
      setToastMessage('Có lỗi xảy ra. Vui lòng thử lại');
      setToastType('error');
      setShowToast(true);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-[#FFFFFF] rounded-lg shadow-sm p-6">
        <p className="text-center text-[#94A3B8]">Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}

      <Modal isOpen={showFormModal} onClose={() => setShowFormModal(false)}>
        <div className="p-6 max-h-[90vh] overflow-y-auto">
          <h3 className="text-lg font-semibold text-[#0F172A] mb-4">
            {editingId ? 'Cập Nhật Địa Chỉ' : 'Thêm Địa Chỉ Mới'}
          </h3>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#475569] mb-2">
                  Họ và tên <span className="text-[#EF4444]">*</span>
                </label>
                <Input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleFormChange}
                  required
                  placeholder="Nhập họ và tên"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#475569] mb-2">
                  Số điện thoại <span className="text-[#EF4444]">*</span>
                </label>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                  required
                  placeholder="Nhập số điện thoại"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#475569] mb-2">
                Địa chỉ <span className="text-[#EF4444]">*</span>
              </label>
              <Input
                name="address"
                value={formData.address}
                onChange={handleFormChange}
                required
                placeholder="Số nhà, tên đường"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#475569] mb-2">
                  Tỉnh/Thành phố <span className="text-[#EF4444]">*</span>
                </label>
                <select
                  name="province"
                  value={formData.province}
                  onChange={handleFormChange}
                  required
                  className="w-full px-4 py-3 border border-[#E5E7EB] rounded-sm text-sm focus:border-[#F97316] focus:outline-none focus:ring-0 text-[#0F172A] cursor-pointer"
                >
                  <option value="">Chọn Tỉnh/Thành phố</option>
                  {provinces.map((province) => (
                    <option key={province.code} value={province.code}>
                      {province.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#475569] mb-2">
                  Phường/Xã <span className="text-[#EF4444]">*</span>
                </label>
                <select
                  name="ward"
                  value={formData.ward}
                  onChange={handleFormChange}
                  required
                  disabled={!formData.province || loadingWards}
                  className="w-full px-4 py-3 border border-[#E5E7EB] rounded-sm text-sm focus:border-[#F97316] focus:outline-none focus:ring-0 text-[#0F172A] disabled:bg-[#F8FAFC] disabled:cursor-not-allowed cursor-pointer"
                >
                  <option value="">
                    {loadingWards ? 'Đang tải...' : 'Chọn Phường/Xã'}
                  </option>
                  {wards.map((ward) => (
                    <option key={ward.code} value={ward.name}>
                      {ward.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Icon giao hàng */}
            <div className="flex items-center justify-center py-4 border-t border-[#E5E7EB]">
              <div className="text-center">
                <svg className="w-16 h-16 mx-auto text-[#F97316] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                </svg>
                <p className="text-sm text-[#94A3B8]">Giao hàng toàn quốc</p>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t border-[#E5E7EB]">
              <Button type="button" variant="outline" onClick={() => setShowFormModal(false)}>
                Hủy
              </Button>
              <Button type="submit" variant="primary">
                {editingId ? 'Cập Nhật' : 'Thêm Mới'}
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-[#0F172A] mb-4">Xác nhận xóa địa chỉ</h3>
          <p className="text-[#475569] mb-6">Bạn có chắc muốn xóa địa chỉ này không?</p>
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

      <div className="bg-[#FFFFFF] rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-[#0F172A]">Địa Chỉ Của Tôi</h2>
          <Button variant="primary" onClick={handleAddNew}>
            + Thêm Địa Chỉ Mới
          </Button>
        </div>

        {addresses.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto text-[#94A3B8] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-[#94A3B8]">Bạn chưa có địa chỉ nào</p>
          </div>
        ) : (
          <div className="space-y-4">
            {addresses.map((address) => (
              <div
                key={address.id}
                className="border border-[#E5E7EB] rounded-lg p-4 hover:border-[#F97316] transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-[#0F172A]">{address.fullName}</span>
                      <span className="text-[#94A3B8]">|</span>
                      <span className="text-[#475569]">{address.phone}</span>
                      {address.isDefault && (
                        <span className="bg-[#F97316] text-[#FFFFFF] text-xs px-2 py-0.5 rounded-sm">
                          Mặc định
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[#475569] mb-1">{address.address}</p>
                    <p className="text-sm text-[#94A3B8]">
                      {address.ward}, {address.district}, {address.province}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(address)}
                      className="text-sm text-[#2563EB] hover:text-[#1D4ED8]"
                    >
                      Cập nhật
                    </button>
                    {!address.isDefault && (
                      <>
                        <button
                          onClick={() => handleDeleteClick(address.id)}
                          className="text-sm text-[#EF4444] hover:text-[#DC2626]"
                        >
                          Xóa
                        </button>
                        <button
                          onClick={() => handleSetDefault(address.id)}
                          className="text-sm text-[#F97316] hover:text-[#EA580C]"
                        >
                          Đặt mặc định
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
