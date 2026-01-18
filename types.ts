
export type TransactionType = 'له' | 'عليه';

export interface Category {
  id: string;
  name: string;
}

export interface SubCategory {
  id: string;
  categoryId: string;
  name: string;
}

export interface Account {
  id: string;
  subCategoryId: string;
  name: string;
}

export interface Transaction {
  id: string;
  categoryId: string;
  subCategoryId: string;
  accountId: string;
  type: TransactionType;
  amount: number;
  balanceAfter: number;
  description: string;
  date: string;
  receiptImage?: string; // Base64
}

export interface AppSettings {
  currency: string;
  primaryColor: string;
  language: 'ar' | 'en';
}

export interface UserProfile {
  username: string;
  passwordHash: string;
}

export interface AppData {
  categories: Category[];
  subCategories: SubCategory[];
  accounts: Account[];
  transactions: Transaction[];
  settings: AppSettings;
  profile: UserProfile;
}
