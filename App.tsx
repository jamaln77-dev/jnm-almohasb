
import React, { useState, useEffect, useMemo } from 'react';
import { Layout } from './components/Layout';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { Settings } from './components/Settings';
import { Reports } from './components/Reports';
import { INITIAL_DATA } from './constants';
import { AppData, Transaction } from './types';

const STORAGE_KEY = 'mohasibi_app_data';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'reports' | 'settings'>('dashboard');
  const [data, setData] = useState<AppData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });

  // Persist data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const handleLogin = (user: string, pass: string) => {
    if (user === data.profile.username && pass === data.profile.passwordHash) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const addTransaction = (tx: Omit<Transaction, 'id' | 'balanceAfter'>) => {
    setData(prev => {
      const currentBalance = prev.transactions.reduce((acc, t) => {
        return t.type === 'له' ? acc + t.amount : acc - t.amount;
      }, 0);
      
      const newBalance = tx.type === 'له' 
        ? currentBalance + tx.amount 
        : currentBalance - tx.amount;

      const newTx: Transaction = {
        ...tx,
        id: crypto.randomUUID(),
        balanceAfter: newBalance
      };

      return {
        ...prev,
        transactions: [newTx, ...prev.transactions]
      };
    });
  };

  const deleteTransaction = (id: string) => {
    setData(prev => {
      const remaining = prev.transactions.filter(t => t.id !== id);
      // Recalculate balances for all remaining transactions to keep consistency
      let runningBalance = 0;
      const updated = [...remaining].reverse().map(t => {
        runningBalance = t.type === 'له' ? runningBalance + t.amount : runningBalance - t.amount;
        return { ...t, balanceAfter: runningBalance };
      }).reverse();

      return { ...prev, transactions: updated };
    });
  };

  const updateProfile = (username: string, passwordHash: string) => {
    setData(prev => ({
      ...prev,
      profile: { username, passwordHash }
    }));
  };

  const updateSettings = (settings: AppData['settings']) => {
    setData(prev => ({ ...prev, settings }));
  };

  const updateHierarchy = (key: 'categories' | 'subCategories' | 'accounts', items: any[]) => {
    setData(prev => ({ ...prev, [key]: items }));
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      onLogout={handleLogout}
      primaryColor={data.settings.primaryColor}
    >
      {activeTab === 'dashboard' && (
        <Dashboard 
          data={data} 
          onAddTransaction={addTransaction} 
          onDeleteTransaction={deleteTransaction}
        />
      )}
      {activeTab === 'reports' && (
        <Reports data={data} />
      )}
      {activeTab === 'settings' && (
        <Settings 
          data={data} 
          updateProfile={updateProfile}
          updateSettings={updateSettings}
          updateHierarchy={updateHierarchy}
          onResetData={() => setData(INITIAL_DATA)}
        />
      )}
    </Layout>
  );
};

export default App;
