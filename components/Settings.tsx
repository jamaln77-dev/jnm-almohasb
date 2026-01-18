
import React, { useState } from 'react';
import { User, Shield, Palette, LayoutGrid, Plus, Trash2, Database, Download } from 'lucide-react';
// Fix: Remove COLORS as COLOR_OPTIONS as it doesn't exist in types.ts
import { AppData } from '../types';
// Fix: COLORS is already correctly exported from constants.ts
import { COLORS } from '../constants';

interface SettingsProps {
  data: AppData;
  updateProfile: (username: string, pass: string) => void;
  updateSettings: (settings: AppData['settings']) => void;
  updateHierarchy: (key: 'categories' | 'subCategories' | 'accounts', items: any[]) => void;
  onResetData: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ 
  data, 
  updateProfile, 
  updateSettings, 
  updateHierarchy, 
  onResetData 
}) => {
  const [activeSection, setActiveSection] = useState<'profile' | 'visual' | 'hierarchy' | 'backup'>('profile');
  
  // Profile state
  const [username, setUsername] = useState(data.profile.username);
  const [password, setPassword] = useState(data.profile.passwordHash);

  // Hierarchy management
  const [newCat, setNewCat] = useState('');
  const [newSub, setNewSub] = useState({ name: '', catId: '' });
  const [newAcc, setNewAcc] = useState({ name: '', subId: '' });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(username, password);
    alert('تم تحديث البيانات بنجاح');
  };

  const addItem = (key: 'categories' | 'subCategories' | 'accounts', item: any) => {
    updateHierarchy(key, [...data[key], item]);
  };

  const removeItem = (key: 'categories' | 'subCategories' | 'accounts', id: string) => {
    if (confirm('هل أنت متأكد؟ سيتم حذف جميع التبعيات أيضاً.')) {
      let updated = data[key].filter((i: any) => i.id !== id);
      updateHierarchy(key, updated);
    }
  };

  const handleBackup = () => {
    const dataStr = JSON.stringify(data);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const link = document.createElement('a');
    link.setAttribute('href', dataUri);
    link.setAttribute('download', 'mohasibi_backup.json');
    link.click();
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 space-y-2">
        <button 
          onClick={() => setActiveSection('profile')}
          className={`w-full flex items-center gap-3 p-3 rounded-lg transition font-semibold ${activeSection === 'profile' ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
        >
          <User size={20} /> الملف الشخصي
        </button>
        <button 
          onClick={() => setActiveSection('hierarchy')}
          className={`w-full flex items-center gap-3 p-3 rounded-lg transition font-semibold ${activeSection === 'hierarchy' ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
        >
          <LayoutGrid size={20} /> إدارة الهيكل
        </button>
        <button 
          onClick={() => setActiveSection('visual')}
          className={`w-full flex items-center gap-3 p-3 rounded-lg transition font-semibold ${activeSection === 'visual' ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
        >
          <Palette size={20} /> الهوية البصرية
        </button>
        <button 
          onClick={() => setActiveSection('backup')}
          className={`w-full flex items-center gap-3 p-3 rounded-lg transition font-semibold ${activeSection === 'backup' ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
        >
          <Database size={20} /> النسخ الاحتياطي
        </button>
      </aside>

      {/* Content Area */}
      <div className="flex-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[400px]">
        {activeSection === 'profile' && (
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-2"><Shield size={20} /> إعدادات الحماية</h3>
            <div>
              <label className="block text-sm text-gray-600 mb-1">اسم المستخدم</label>
              <input 
                type="text" 
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">كلمة المرور الجديدة</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
              />
            </div>
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">حفظ التغييرات</button>
          </form>
        )}

        {activeSection === 'hierarchy' && (
          <div className="space-y-8">
            {/* Categories */}
            <section>
              <h4 className="font-bold text-gray-700 mb-3 border-b pb-2">1. التصنيفات الرئيسية</h4>
              <div className="flex gap-2 mb-4">
                <input 
                  type="text" 
                  value={newCat}
                  onChange={e => setNewCat(e.target.value)}
                  placeholder="اسم التصنيف الجديد"
                  className="flex-1 p-2 border rounded-lg text-sm" 
                />
                <button 
                  onClick={() => { if(newCat){ addItem('categories', { id: crypto.randomUUID(), name: newCat }); setNewCat(''); } }}
                  className="bg-green-600 text-white p-2 rounded-lg"
                ><Plus size={20} /></button>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.categories.map(c => (
                  <div key={c.id} className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full text-sm">
                    {c.name}
                    <button onClick={() => removeItem('categories', c.id)} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                  </div>
                ))}
              </div>
            </section>

            {/* SubCategories */}
            <section>
              <h4 className="font-bold text-gray-700 mb-3 border-b pb-2">2. الفئات</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                <select 
                  value={newSub.catId}
                  onChange={e => setNewSub(prev => ({ ...prev, catId: e.target.value }))}
                  className="p-2 border rounded-lg text-sm"
                >
                  <option value="">اختر التصنيف</option>
                  {data.categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={newSub.name}
                    onChange={e => setNewSub(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="اسم الفئة الجديد"
                    className="flex-1 p-2 border rounded-lg text-sm" 
                  />
                  <button 
                    onClick={() => { if(newSub.name && newSub.catId){ addItem('subCategories', { id: crypto.randomUUID(), categoryId: newSub.catId, name: newSub.name }); setNewSub({ name: '', catId: '' }); } }}
                    className="bg-green-600 text-white p-2 rounded-lg"
                  ><Plus size={20} /></button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.subCategories.map(s => (
                  <div key={s.id} className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full text-sm text-blue-700">
                    {s.name} <span className="text-[10px] text-blue-300">({data.categories.find(c => c.id === s.categoryId)?.name})</span>
                    <button onClick={() => removeItem('subCategories', s.id)} className="text-red-300 hover:text-red-500"><Trash2 size={14} /></button>
                  </div>
                ))}
              </div>
            </section>

            {/* Accounts */}
            <section>
              <h4 className="font-bold text-gray-700 mb-3 border-b pb-2">3. الحسابات</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                <select 
                  value={newAcc.subId}
                  onChange={e => setNewAcc(prev => ({ ...prev, subId: e.target.value }))}
                  className="p-2 border rounded-lg text-sm"
                >
                  <option value="">اختر الفئة</option>
                  {data.subCategories.map(s => <option key={s.id} value={s.id}>{s.name} ({data.categories.find(c => c.id === s.categoryId)?.name})</option>)}
                </select>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={newAcc.name}
                    onChange={e => setNewAcc(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="اسم الحساب الجديد"
                    className="flex-1 p-2 border rounded-lg text-sm" 
                  />
                  <button 
                    onClick={() => { if(newAcc.name && newAcc.subId){ addItem('accounts', { id: crypto.randomUUID(), subCategoryId: newAcc.subId, name: newAcc.name }); setNewAcc({ name: '', subId: '' }); } }}
                    className="bg-green-600 text-white p-2 rounded-lg"
                  ><Plus size={20} /></button>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeSection === 'visual' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-2"><Palette size={20} /> تخصيص المظهر</h3>
            <div>
              <label className="block text-sm text-gray-600 mb-3">اختر اللون الأساسي للتطبيق</label>
              <div className="flex flex-wrap gap-4">
                {COLORS.map(c => (
                  <button 
                    key={c.value}
                    onClick={() => updateSettings({ ...data.settings, primaryColor: c.value })}
                    className={`w-12 h-12 rounded-full border-4 transition-transform hover:scale-110 flex items-center justify-center ${data.settings.primaryColor === c.value ? 'border-gray-800' : 'border-transparent'}`}
                    style={{ backgroundColor: c.value }}
                    title={c.name}
                  >
                    {data.settings.primaryColor === c.value && <div className="w-2 h-2 bg-white rounded-full"></div>}
                  </button>
                ))}
              </div>
            </div>
            
            <hr />

            <div>
              <label className="block text-sm text-gray-600 mb-2">العملة الافتراضية</label>
              <input 
                type="text" 
                value={data.settings.currency}
                onChange={e => updateSettings({ ...data.settings, currency: e.target.value })}
                className="p-2 border rounded-lg w-full max-w-xs"
              />
            </div>
          </div>
        )}

        {activeSection === 'backup' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-2"><Database size={20} /> إدارة البيانات</h3>
            <p className="text-sm text-gray-500">يمكنك تصدير كافة بياناتك في ملف واحد للرجوع إليها لاحقاً أو استعادتها.</p>
            
            <div className="flex gap-4">
              <button 
                onClick={handleBackup}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <Download size={18} /> تصدير نسخة احتياطية
              </button>
            </div>

            <div className="pt-10 border-t mt-10">
              <h4 className="text-red-600 font-bold mb-2">منطقة الخطر</h4>
              <p className="text-xs text-gray-400 mb-4">سيؤدي هذا الإجراء إلى حذف كافة العمليات والحسابات وإعادة التطبيق لحالته الأولى.</p>
              <button 
                onClick={() => { if(confirm('هل أنت متأكد من مسح كافة البيانات؟ لا يمكن التراجع عن هذا الفعل.')) onResetData(); }}
                className="bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-lg hover:bg-red-600 hover:text-white transition"
              >
                مسح كافة البيانات
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
