
import { AppData } from './types';

export const INITIAL_DATA: AppData = {
  categories: [
    { id: 'cat-1', name: 'العمل' },
    { id: 'cat-2', name: 'المنزل' }
  ],
  subCategories: [
    { id: 'sub-1', categoryId: 'cat-1', name: 'المشاريع' },
    { id: 'sub-2', categoryId: 'cat-2', name: 'المصاريف' }
  ],
  accounts: [
    { id: 'acc-1', subCategoryId: 'sub-1', name: 'مشروع أ' },
    { id: 'acc-2', subCategoryId: 'sub-2', name: 'البقالة' }
  ],
  transactions: [],
  settings: {
    currency: 'ريال',
    primaryColor: '#2563eb', // blue-600
    language: 'ar'
  },
  profile: {
    username: 'admin',
    passwordHash: '123' 
  }
};

export const COLORS = [
  { name: 'أزرق', value: '#2563eb' },
  { name: 'أخضر', value: '#16a34a' },
  { name: 'أحمر', value: '#dc2626' },
  { name: 'أصفر ذهبي', value: '#ced10d' },
  { name: 'أصفر غامق', value: '#a16207' },
  { name: 'بنفسجي', value: '#9333ea' },
  { name: 'برتقالي', value: '#ea580c' },
  { name: 'أسود', value: '#111827' }
];
