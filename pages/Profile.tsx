
import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUserSoldItems, getBooks } from '../lib/api';
import { Sold, Book } from '../types';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [soldItems, setSoldItems] = useState<Sold[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          const [soldData, booksData] = await Promise.all([
            getUserSoldItems(user.id),
            getBooks()
          ]);
          setSoldItems(soldData);
          setBooks(booksData);
        } catch (error) {
          console.error('Ma\'lumotlarni yuklashda xatolik:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchData();
  }, [user]);

  if (!user) return <Navigate to="/login" />;
  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Yuklanmoqda...</div>;

  const getBookDetails = (bookId: string) => {
    return books.find(b => b.id === bookId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Sidebar Info */}
        <div className="w-full md:w-1/3">
          <div className="bg-gray-50 dark:bg-gray-900 rounded-3xl p-8 border border-gray-200 dark:border-gray-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center text-white text-4xl font-black mb-4 shadow-lg shadow-indigo-500/20">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{user.name}</h2>
              <p className="text-slate-500 dark:text-slate-400">{user.email}</p>
              {user.admin && (
                <div className="mt-4 px-4 py-1 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-full border border-indigo-100 dark:border-indigo-800 uppercase tracking-widest">
                  Admin
                </div>
              )}
            </div>

            <div className="space-y-4 border-t pt-8 border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Sotib olingan kitoblar:</span>
                <span className="font-bold text-slate-900 dark:text-white">{soldItems.length} ta</span>
              </div>
            </div>

            <div className="mt-8">
              <button 
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="w-full py-3 bg-rose-50 hover:bg-rose-100 dark:bg-rose-900/20 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-400 text-sm font-bold rounded-xl transition-colors uppercase tracking-widest"
              >
                Chiqish
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="w-full md:w-2/3 space-y-12">
          <section>
            <h3 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white flex items-center gap-3">
              <span>📦</span> Xaridlar tarixi
            </h3>
            {soldItems.length > 0 ? (
              <div className="grid gap-4">
                {soldItems.map(item => {
                  const book = getBookDetails(item.id_books);
                  return (
                    <div key={item.id} className="bg-gray-50 dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 flex justify-between items-center group hover:border-indigo-500 transition-all">
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600">
                          {book ? book.name : 'Noma\'lum kitob'}
                        </h4>
                        <p className="text-xs text-slate-500">Sana: {new Date(item.date).toLocaleDateString()}</p>
                        {book && <p className="text-xs font-bold text-indigo-600 mt-1">{book.price?.toLocaleString()} UZS</p>}
                      </div>
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700">
                        Sotib olindi
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-gray-100 dark:bg-gray-900/50 p-10 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700 text-center">
                <p className="text-slate-500">Hozircha hech qanday xarid yoʻq.</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Profile;
