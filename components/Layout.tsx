
import React from 'react';
import { Home, BarChart2, Settings, LogOut } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'dashboard' | 'reports' | 'settings';
  setActiveTab: (tab: 'dashboard' | 'reports' | 'settings') => void;
  onLogout: () => void;
  primaryColor: string;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activeTab, 
  setActiveTab, 
  onLogout,
  primaryColor 
}) => {
  return (
    <div className="min-h-screen flex flex-col max-w-4xl mx-auto bg-white shadow-xl relative">
      {/* Top Header & Navigation */}
      <header 
        className="sticky top-0 z-50 text-white shadow-md print:hidden"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="p-4 flex justify-between items-center border-b border-white/10">
          <h1 className="text-xl font-bold">jnm-almohasb</h1>
          <button onClick={onLogout} className="p-2 hover:bg-white/10 rounded-full transition" title="تسجيل الخروج">
            <LogOut size={20} />
          </button>
        </div>

        {/* Navigation Tabs at the Top */}
        <nav className="flex justify-around bg-white/5 backdrop-blur-sm">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex-1 flex flex-col items-center gap-1 py-3 transition-all relative ${activeTab === 'dashboard' ? 'text-white opacity-100' : 'text-white/60 hover:text-white/80'}`}
          >
            <Home size={20} />
            <span className="text-xs font-semibold">الرئيسية</span>
            {activeTab === 'dashboard' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-t-full" />}
          </button>
          <button 
            onClick={() => setActiveTab('reports')}
            className={`flex-1 flex flex-col items-center gap-1 py-3 transition-all relative ${activeTab === 'reports' ? 'text-white opacity-100' : 'text-white/60 hover:text-white/80'}`}
          >
            <BarChart2 size={20} />
            <span className="text-xs font-semibold">التقارير</span>
            {activeTab === 'reports' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-t-full" />}
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex-1 flex flex-col items-center gap-1 py-3 transition-all relative ${activeTab === 'settings' ? 'text-white opacity-100' : 'text-white/60 hover:text-white/80'}`}
          >
            <Settings size={20} />
            <span className="text-xs font-semibold">الإعدادات</span>
            {activeTab === 'settings' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-t-full" />}
          </button>
        </nav>
      </header>

      {/* Content */}
      <main className="flex-1 p-4 overflow-auto">
        {children}
      </main>

      {/* Footer Branding or simple spacing */}
      <footer className="p-4 text-center text-gray-400 text-xs border-t bg-gray-50 print:hidden">
        محاسبي &copy; {new Date().getFullYear()} - جميع الحقوق محفوظة
      </footer>
    </div>
  );
};
