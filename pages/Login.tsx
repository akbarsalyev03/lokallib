
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { loginUser } from '../lib/api';
import Toast from '../components/Toast';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { user: foundUser } = await loginUser(email, password);
      login(foundUser);
      setToast({ message: 'Xush kelibsiz!', type: 'success' });
      setTimeout(() => navigate('/'), 1000);
    } catch (error) {
      console.error('Kirishda xatolik:', error);
      setToast({ message: 'Email yoki parol notoʻgʻri', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-50 dark:bg-gray-900 rounded-[40px] p-10 shadow-2xl border border-gray-100 dark:border-gray-800">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-indigo-600 text-white flex items-center justify-center text-3xl font-black rounded-2xl mx-auto mb-6 shadow-xl shadow-indigo-600/30">L</div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Xush kelibsiz</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Platformaga kirish uchun ma'lumotlarni kiriting</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Email manzil</label>
            <input 
              type="email" 
              required
              className="input-field"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Parol</label>
            <input 
              type="password" 
              required
              className="input-field"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" disabled={isLoading} className="btn-primary w-full py-5 text-lg flex items-center justify-center gap-2">
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Kirilmoqda...
              </>
            ) : 'Kirish'}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-sm font-bold text-slate-500">
            Hisobingiz yo'qmi? <Link to="/register" className="text-indigo-600 hover:underline">Ro'yxatdan o'ting</Link>
          </p>
        </div>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default Login;
