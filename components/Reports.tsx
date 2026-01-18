
import React, { useMemo } from 'react';
import { AppData } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

interface ReportsProps {
  data: AppData;
}

export const Reports: React.FC<ReportsProps> = ({ data }) => {
  const primaryColor = data.settings.primaryColor;

  // Yearly/Monthly Logic
  const monthlyData = useMemo(() => {
    const months: Record<string, { month: string, credit: number, debit: number }> = {};
    data.transactions.forEach(t => {
      const monthKey = t.date.substring(0, 7); // YYYY-MM
      if (!months[monthKey]) months[monthKey] = { month: monthKey, credit: 0, debit: 0 };
      if (t.type === 'له') months[monthKey].credit += t.amount;
      else months[monthKey].debit += t.amount;
    });
    return Object.values(months).sort((a, b) => a.month.localeCompare(b.month));
  }, [data.transactions]);

  const categoryData = useMemo(() => {
    const cats: Record<string, { name: string, value: number }> = {};
    data.transactions.forEach(t => {
      const cat = data.categories.find(c => c.id === t.categoryId)?.name || 'غير معروف';
      if (!cats[cat]) cats[cat] = { name: cat, value: 0 };
      cats[cat].value += t.amount;
    });
    return Object.values(cats);
  }, [data.transactions, data.categories]);

  const COLORS = [primaryColor, '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#3b82f6'];

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold" style={{ color: primaryColor }}>التقارير والإحصائيات</h2>

      {/* Grid Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500">إجمالي العمليات</p>
          <p className="text-xl font-bold">{data.transactions.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500">عدد الحسابات</p>
          <p className="text-xl font-bold">{data.accounts.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500">التصنيفات</p>
          <p className="text-xl font-bold">{data.categories.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500">الفئات</p>
          <p className="text-xl font-bold">{data.subCategories.length}</p>
        </div>
      </div>

      {/* Monthly Bar Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-bold mb-6 text-gray-700">تحليل الأداء الشهري</h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="credit" name="له" fill="#16a34a" radius={[4, 4, 0, 0]} />
              <Bar dataKey="debit" name="عليه" fill="#dc2626" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Pie Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold mb-6 text-gray-700">التوزيع حسب التصنيف</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold mb-6 text-gray-700">التفاصيل السنوية</h3>
          <div className="space-y-4">
            {monthlyData.slice(-5).reverse().map(m => (
              <div key={m.month} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-bold text-gray-600">{m.month}</span>
                <div className="flex gap-4 text-sm">
                  <span className="text-green-600">+{m.credit.toLocaleString()}</span>
                  <span className="text-red-600">-{m.debit.toLocaleString()}</span>
                </div>
              </div>
            ))}
            {monthlyData.length === 0 && <p className="text-gray-400 text-center py-10 italic">لا توجد بيانات كافية</p>}
          </div>
        </div>
      </div>
    </div>
  );
};
