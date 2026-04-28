
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getBookById, createSoldItem, updateBook } from '../lib/api';
import { Book } from '../types';
import { GENRES } from '../constants';
import { useAuth } from '../contexts/AuthContext';
import Toast from '../components/Toast';

const BookDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [book, setBook] = useState<Book | null>(null);
  const [isOrdering, setIsOrdering] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const fetchBook = async () => {
      if (!id) return;
      try {
        const data = await getBookById(id);
        if (!data) navigate('/');
        else setBook(data);
      } catch (error) {
        console.error('Kitobni yuklashda xatolik:', error);
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };
    fetchBook();
  }, [id, navigate]);

  const handleBuy = async () => {
    if (!user) {
      setToast({ message: 'Kitob sotib olish uchun tizimga kiring', type: 'error' });
      return;
    }

    if (!book || !book.status) return;

    setIsOrdering(true);
    try {
      await createSoldItem({
        id_books: book.id,
        id_users: user.id
      });

      await updateBook(Number(book.id), { status: false });
      setBook({ ...book, status: false });
      setToast({ message: 'Buyurtma muvaffaqiyatli qabul qilindi!', type: 'success' });
    } catch (error) {
      console.error('Buyurtma berishda xatolik:', error);
      setToast({ message: 'Xatolik yuz berdi. Iltimos qayta urinib ko\'ring.', type: 'error' });
    } finally {
      setIsOrdering(false);
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Yuklanmoqda...</div>;
  if (!book) return null;


  const genreName = GENRES.find(g => g.id === book.id_genre)?.name || 'Noma\'lum';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
        {/* Left: Cover */}
        <div className="w-full lg:w-1/3">
          <div className="sticky top-24">
            <div className="rounded-3xl overflow-hidden shadow-2xl shadow-indigo-500/10 border border-gray-200 dark:border-gray-800 group">
              <img src={book.cover} alt={book.name} className="w-full h-auto group-hover:scale-105 transition-transform duration-700" />
            </div>
            <div className={`mt-6 p-6 rounded-2xl flex items-center justify-between font-bold border ${
              book.status
                ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800/30' 
                : 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-900/20 dark:border-rose-800/30'
            }`}>
              <span>Holati:</span>
              <span>{book.status ? 'Sotuvda mavjud' : 'Sotilgan'}</span>
            </div>
            {book.status && (
              <div className="mt-4 p-6 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400 font-bold uppercase text-xs">Narxi:</span>
                <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{book.price?.toLocaleString()} UZS</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Info */}
        <div className="w-full lg:w-2/3">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="px-4 py-1.5 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg shadow-indigo-600/20">
                {genreName}
              </span>
              <div className="h-[1px] w-12 bg-gray-200 dark:bg-gray-800"></div>
            </div>
            <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white mb-4 leading-tight">{book.name}</h1>
            <p className="text-2xl text-slate-500 dark:text-slate-400 font-medium">Muallif: <span className="text-slate-900 dark:text-slate-200 font-bold underline decoration-indigo-500/30">{book.author}</span></p>
          </div>

          <div className="mb-12">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Asar haqida qisqacha</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg max-w-2xl">
              {book.description} Inson hayoti va jamiyatning chuqur qirralarini ochib beruvchi bu asar sizni befarq qoldirmaydi. Har bir sahifasida yangi ma'no va falsafa yashiringan.
            </p>
          </div>

          <div className="p-8 bg-gray-50 dark:bg-gray-900/50 rounded-3xl border border-gray-200 dark:border-gray-800">
            {!user ? (
              <div className="text-center">
                <p className="text-slate-600 dark:text-slate-400 mb-6 font-medium">Kitobni sotib olish uchun avval tizimga kiring</p>
                <div className="flex gap-4 justify-center">
                   <Link to="/login" className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-xl">Kirish</Link>
                   <Link to="/register" className="px-8 py-4 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 text-slate-900 dark:text-white font-bold rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-900 transition-all">Ro'yxatdan o'tish</Link>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center gap-6">
                 <button 
                  disabled={!book.status || isOrdering}
                  onClick={handleBuy}
                  className={`w-full sm:w-auto px-12 py-5 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${
                    book.status
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xl shadow-indigo-600/30 active:scale-95'
                      : 'bg-gray-200 dark:bg-gray-800 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {isOrdering ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Bajarilmoqda...
                    </>
                  ) : book.status ? 'Sotib olish' : 'Sotilgan'}
                </button>
                <div className="text-sm text-slate-500 font-medium italic">
                  * Yetkazib berish xizmati mavjud
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default BookDetail;
