
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="glass-nav">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-10">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/30 group-hover:rotate-12 transition-transform">L</div>
              <span className="text-2xl font-black tracking-tighter">Lokallib</span>
            </Link>
            
            <div className="hidden md:flex gap-8 font-bold text-sm">
              <Link to="/" className={location.pathname === '/' ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600 transition-colors'}>Asosiy</Link>
              <Link to="/genres" className={location.pathname === '/genres' ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600 transition-colors'}>Janrlar</Link>
              <Link to="/search" className={location.pathname === '/search' ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600 transition-colors'}>Qidiruv</Link>
              {user?.admin && (
                <Link to="/admin" className={location.pathname === '/admin' ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600 transition-colors'}>Admin</Link>
              )}
            </div>
          </div>

          <div className="flex items-center gap-5">
            <button onClick={() => setIsDark(!isDark)} className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-xl">
              {isDark ? '☀️' : '🌙'}
            </button>

            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/profile" className="flex items-center gap-3 glass-card p-1.5 pr-4 rounded-2xl hover:border-indigo-400">
                  <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-900 text-indigo-600 flex items-center justify-center font-black">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</div>
                  <span className="text-sm font-bold">{user?.name ? user.name.split(' ')[0] : 'User'}</span>
                </Link>
              </div>
            ) : (
              <Link to="/login" className="btn-primary py-2 px-6 text-sm">Kirish</Link>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-grow animate-page">
        {children}
      </main>

      <footer className="py-16 border-t border-slate-100 dark:border-slate-800 text-center">
        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.5em]">&copy; 2025 Lokallib — Barcha huquqlar himoyalangan</p>
      </footer>
    </div>
  );
};

export default Layout;
