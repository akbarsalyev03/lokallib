
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { registerUser } from '../lib/api';
import Toast from '../components/Toast';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '' 
  });
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      setToast({ message: 'Parol kamida 8 ta belgidan iborat bo\'lishi va harf, son hamda maxsus belgilarni o\'z ichiga olishi kerak.', type: 'error' });
      return;
    }

    setIsLoading(true);
    try {
      const { user: newUser } = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      login(newUser);
      setToast({ message: 'Muvaffaqiyatli roʻyxatdan oʻtdingiz!', type: 'success' });
      setTimeout(() => navigate('/'), 1000);
    } catch (error) {
      console.error('Ro\'yxatdan o\'tishda xatolik:', error);
      setToast({ message: 'Xatolik yuz berdi yoki ushbu email band', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-[90vh] flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-gray-50 dark:bg-gray-900 rounded-[40px] p-10 shadow-2xl border border-gray-100 dark:border-gray-800">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Hisob yaratish</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Lokallib hamjamiyatiga xush kelibsiz!</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 space-y-2">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">To'liq ism va familiya</label>
            <input 
              type="text" required placeholder="Aziz Rahimov"
              className="input-field"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Email manzil</label>
            <input 
              type="email" required placeholder="user@example.com"
              className="input-field"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Yangi parol</label>
            <input 
              type="password" required placeholder="••••••••"
              className="input-field"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            <p className="text-xs text-slate-500 mt-1 ml-2">Kamida 8 ta belgi, harf, son va maxsus belgi (@$!%*#?&.)</p>
          </div>

          <div className="md:col-span-2 mt-4">
            <button type="submit" disabled={isLoading} className="btn-primary w-full py-5 text-lg flex items-center justify-center gap-2">
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Ro'yxatdan o'tilmoqda...
                </>
              ) : 'Ro\'yxatdan o\'tish'}
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm font-bold text-slate-500">
          Hisobingiz bormi? <Link to="/login" className="text-indigo-600 hover:underline">Kirish</Link>
        </p>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default Register;
