
import React, { useState, useMemo } from 'react';
import { Plus, Download, Trash2, Camera, FileText } from 'lucide-react';
import { AppData, Transaction, TransactionType } from '../types';

interface DashboardProps {
  data: AppData;
  onAddTransaction: (tx: Omit<Transaction, 'id' | 'balanceAfter'>) => void;
  onDeleteTransaction: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ data, onAddTransaction, onDeleteTransaction }) => {
  const [formData, setFormData] = useState({
    categoryId: data.categories[0]?.id || '',
    subCategoryId: '',
    accountId: '',
    type: 'له' as TransactionType,
    amount: 0,
    description: '',
    date: new Date().toISOString().split('T')[0],
    receiptImage: ''
  });

  const filteredSubCategories = useMemo(() => 
    data.subCategories.filter(s => s.categoryId === formData.categoryId),
  [data.subCategories, formData.categoryId]);

  const filteredAccounts = useMemo(() => 
    data.accounts.filter(a => a.subCategoryId === formData.subCategoryId),
  [data.accounts, formData.subCategoryId]);

  const totals = useMemo(() => {
    return data.transactions.reduce((acc, t) => {
      if (t.type === 'له') acc.credit += t.amount;
      else acc.debit += t.amount;
      return acc;
    }, { credit: 0, debit: 0 });
  }, [data.transactions]);

  const netBalance = totals.credit - totals.debit;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, receiptImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoryId || !formData.subCategoryId || !formData.accountId || formData.amount <= 0) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    onAddTransaction(formData);
    setFormData(prev => ({
      ...prev,
      amount: 0,
      description: '',
      receiptImage: ''
    }));
  };

  const exportToExcel = () => {
    const headers = ['التاريخ', 'التصنيف', 'الفئة', 'الحساب', 'النوع', 'المبلغ', 'الرصيد', 'الوصف'];
    const rows = data.transactions.map(t => [
      t.date,
      data.categories.find(c => c.id === t.categoryId)?.name || '',
      data.subCategories.find(s => s.id === t.subCategoryId)?.name || '',
      data.accounts.find(a => a.id === t.accountId)?.name || '',
      t.type,
      t.amount,
      t.balanceAfter,
      t.description
    ]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header with Export Controls */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 print:hidden">
        <h2 className="text-xl font-bold text-gray-800">الرئيسية</h2>
        <div className="flex gap-2">
          <button onClick={exportToExcel} className="flex items-center gap-2 bg-emerald-600 text-white px-3 sm:px-4 py-2 rounded-lg font-semibold hover:bg-emerald-700 transition shadow-sm text-xs sm:text-base">
            <Download size={18} />
            تصدير Excel
          </button>
          <button onClick={() => window.print()} className="flex items-center gap-2 bg-slate-600 text-white px-3 sm:px-4 py-2 rounded-lg font-semibold hover:bg-slate-700 transition shadow-sm text-xs sm:text-base">
            <FileText size={18} />
            تصدير PDF
          </button>
        </div>
      </div>

      {/* Input Form Card */}
      <section className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 print:hidden">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: data.settings.primaryColor }}>
          <Plus size={20} />
          إضافة عملية جديدة
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-600">التصنيف</label>
            <select 
              value={formData.categoryId}
              onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value, subCategoryId: '', accountId: '' }))}
              className="w-full p-2.5 rounded-lg border bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">اختر التصنيف</option>
              {data.categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-600">الفئة</label>
            <select 
              value={formData.subCategoryId}
              disabled={!formData.categoryId}
              onChange={(e) => setFormData(prev => ({ ...prev, subCategoryId: e.target.value, accountId: '' }))}
              className="w-full p-2.5 rounded-lg border bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50"
            >
              <option value="">اختر الفئة</option>
              {filteredSubCategories.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-600">الحساب</label>
            <select 
              value={formData.accountId}
              disabled={!formData.subCategoryId}
              onChange={(e) => setFormData(prev => ({ ...prev, accountId: e.target.value }))}
              className="w-full p-2.5 rounded-lg border bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50"
            >
              <option value="">اختر الحساب</option>
              {filteredAccounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>

          <div className="space-y-1 md:col-span-1">
            <label className="text-sm font-semibold text-gray-600">الوصف</label>
            <input 
              type="text"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full p-2.5 rounded-lg border bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="وصف العملية..."
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-600">المبلغ ({data.settings.currency})</label>
            <input 
              type="number" 
              value={formData.amount || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: Number(e.target.value) }))}
              className="w-full p-2.5 rounded-lg border bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none font-bold"
              placeholder="0.00"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-600">التاريخ</label>
            <input 
              type="date" 
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              onClick={(e) => (e.target as HTMLInputElement).showPicker?.()}
              onFocus={(e) => (e.target as HTMLInputElement).showPicker?.()}
              className="w-full p-2.5 rounded-lg border bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-600">النوع</label>
            <div className="flex gap-2">
              <button 
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, type: 'له' }))}
                className={`flex-1 py-2 rounded-lg font-bold border transition ${formData.type === 'له' ? 'bg-green-100 border-green-500 text-green-700' : 'bg-gray-50 text-gray-400'}`}
              >له (+)</button>
              <button 
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, type: 'عليه' }))}
                className={`flex-1 py-2 rounded-lg font-bold border transition ${formData.type === 'عليه' ? 'bg-red-100 border-red-500 text-red-700' : 'bg-gray-50 text-gray-400'}`}
              >عليه (-)</button>
            </div>
          </div>

          <div className="md:col-span-2 flex items-center gap-4">
            <div className="flex-1 relative">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange}
                className="hidden" 
                id="receipt-upload"
              />
              <label 
                htmlFor="receipt-upload"
                className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition text-gray-500"
              >
                <Camera size={20} />
                <span>إرفاق صورة الوصل</span>
              </label>
              {formData.receiptImage && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600 font-bold text-xs">تم الإرفاق</span>}
            </div>
            <button 
              type="submit" 
              className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition shadow-lg flex items-center gap-2"
              style={{ backgroundColor: data.settings.primaryColor }}
            >
              حفظ العملية
            </button>
          </div>
        </form>
      </section>

      {/* Summary View - Made strictly horizontal using grid-cols-3 */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <div className="bg-white p-2 sm:p-4 rounded-xl border-l-4 border-l-green-500 shadow-sm flex flex-col justify-center">
          <p className="text-[10px] sm:text-xs text-gray-500 truncate">إجمالي "له"</p>
          <p className="text-sm sm:text-xl font-bold text-green-600 truncate">{totals.credit.toLocaleString()} <span className="text-[10px] sm:text-xs font-normal">{data.settings.currency}</span></p>
        </div>
        <div className="bg-white p-2 sm:p-4 rounded-xl border-l-4 border-l-red-500 shadow-sm flex flex-col justify-center">
          <p className="text-[10px] sm:text-xs text-gray-500 truncate">إجمالي "عليه"</p>
          <p className="text-sm sm:text-xl font-bold text-red-600 truncate">{totals.debit.toLocaleString()} <span className="text-[10px] sm:text-xs font-normal">{data.settings.currency}</span></p>
        </div>
        <div className="bg-white p-2 sm:p-4 rounded-xl shadow-sm border-l-4 flex flex-col justify-center" style={{ borderColor: data.settings.primaryColor }}>
          <p className="text-[10px] sm:text-xs text-gray-500 truncate">الرصيد النهائي</p>
          <p className={`text-sm sm:text-2xl font-black truncate ${netBalance >= 0 ? 'text-green-700' : 'text-red-700'}`}>
            {netBalance.toLocaleString()} <span className="text-[10px] sm:text-xs font-normal">{data.settings.currency}</span>
          </p>
        </div>
      </div>

      {/* Record Section Header */}
      <div className="bg-gray-100 p-3 rounded-lg print:bg-white print:border-b">
        <h3 className="font-bold text-gray-700">سجل العمليات</h3>
      </div>

      {/* Table Data */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-gray-50 text-gray-600 text-sm">
              <tr>
                <th className="p-4">التاريخ</th>
                <th className="p-4">الحساب</th>
                <th className="p-4">النوع</th>
                <th className="p-4">المبلغ</th>
                <th className="p-4">الرصيد</th>
                <th className="p-4 print:hidden"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.transactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-gray-400 italic">لا توجد عمليات مسجلة حالياً</td>
                </tr>
              ) : (
                data.transactions.map(t => (
                  <tr key={t.id} className="hover:bg-gray-50 transition group">
                    <td className="p-4">
                      <div className="text-sm font-medium">{t.date}</div>
                      <div className="text-xs text-gray-400 truncate max-w-[100px]">{t.description}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-semibold">{data.accounts.find(a => a.id === t.accountId)?.name}</div>
                      <div className="text-[10px] text-gray-400">
                        {data.categories.find(c => c.id === t.categoryId)?.name} {'->'} {data.subCategories.find(s => s.id === t.subCategoryId)?.name}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${t.type === 'له' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {t.type}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-sm">{t.amount.toLocaleString()}</td>
                    <td className={`p-4 font-black text-sm ${t.balanceAfter >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {t.balanceAfter.toLocaleString()}
                    </td>
                    <td className="p-4 text-left print:hidden">
                      <button 
                        onClick={() => onDeleteTransaction(t.id)}
                        className="text-gray-300 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sticky Totals Footer (Optional/Manual Placement) */}
      <footer className="mt-8 p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-center text-gray-500 text-sm print:hidden">
        نهاية قائمة العمليات
      </footer>
    </div>
  );
};
