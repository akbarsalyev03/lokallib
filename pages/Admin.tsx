
import React, { useState, useEffect } from 'react';
import { 
  getSoldItems, 
  getBooks, 
  deleteBook, 
  updateBook, 
  createBook,
  getUsers, 
  deleteUser, 
  toggleUserAdmin 
} from '../lib/api';
import { Sold, Book, User } from '../types';
import { GENRES } from '../constants';

const Admin: React.FC = () => {
  const [soldItems, setSoldItems] = useState<Sold[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<'sold' | 'books' | 'users'>('sold');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Partial<Book>>({});

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = async () => {
    setIsLoading(true);
    try {
      const [soldData, booksData, usersData] = await Promise.all([
        getSoldItems(),
        getBooks(),
        getUsers()
      ]);
      setSoldItems(soldData);
      setBooks(booksData);
      setUsers(usersData);
    } catch (error) {
      console.error('Ma\'lumotlarni yangilashda xatolik:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBook = async (id: string) => {
    if (window.confirm('Rostdan ham bu kitobni oʻchirmoqchimisiz?')) {
      try {
        await deleteBook(id);
        refreshData();
      } catch (error) {
        console.error('Kitobni o\'chirishda xatolik:', error);
      }
    }
  };

  const handleEditBook = (book: Book) => {
    setEditingBook(book);
    setIsModalOpen(true);
  };

  const handleAddBook = () => {
    setEditingBook({});
    setIsModalOpen(true);
  };

  const handleSaveBook = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBook.id) {
        await updateBook(Number(editingBook.id), editingBook);
      } else {
        const newBookData = {
          ...editingBook,
          status: editingBook.status !== undefined ? editingBook.status : true,
          cover: editingBook.cover || `https://picsum.photos/seed/${Math.random()}/400/600`
        } as Omit<Book, 'id'>;
        await createBook(newBookData);
      }
      setIsModalOpen(false);
      refreshData();
    } catch (error) {
      console.error('Kitobni saqlashda xatolik:', error);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (window.confirm('Rostdan ham bu foydalanuvchini oʻchirmoqchimisiz?')) {
      try {
        await deleteUser(id);
        refreshData();
      } catch (error) {
        console.error('Foydalanuvchini o\'chirishda xatolik:', error);
      }
    }
  };

  const handleToggleAdmin = async (id: string) => {
    try {
      await toggleUserAdmin(id);
      refreshData();
    } catch (error) {
      console.error('Admin huquqini o\'zgartirishda xatolik:', error);
    }
  };


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('uz-UZ', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const getBookName = (bookId: string) => books.find(b => b.id === bookId)?.name || 'Noma\'lum kitob';
  const getUserName = (userId: string) => users.find(u => u.id === userId)?.name || 'Noma\'lum foydalanuvchi';
  const getGenreName = (genreId: string) => GENRES.find(g => g.id === genreId)?.name || 'Noma\'lum janr';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Admin Panel</h1>
          <p className="text-slate-500 dark:text-slate-400">Kutubxona faoliyatini boshqarish va nazorat qilish</p>
        </div>
        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl overflow-x-auto">
          <button 
            onClick={() => setView('sold')}
            className={`px-6 py-2 rounded-lg font-bold text-sm transition-all whitespace-nowrap ${view === 'sold' ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            Sotuvlar
          </button>
          <button 
            onClick={() => setView('books')}
            className={`px-6 py-2 rounded-lg font-bold text-sm transition-all whitespace-nowrap ${view === 'books' ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            Kitoblar bazasi
          </button>
          <button 
            onClick={() => setView('users')}
            className={`px-6 py-2 rounded-lg font-bold text-sm transition-all whitespace-nowrap ${view === 'users' ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            Foydalanuvchilar
          </button>
        </div>
      </header>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32">
          <div className="w-12 h-12 border-4 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500 font-bold animate-pulse">Ma'lumotlar yuklanmoqda...</p>
        </div>
      ) : (
        <>
          {view === 'sold' && (
        <div className="bg-gray-50 dark:bg-gray-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kitob</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Foydalanuvchi</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sana</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {soldItems.map((sold) => (
                  <tr key={sold.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 dark:text-white">{getBookName(sold.id_books)}</div>
                      <div className="text-[10px] text-slate-400 uppercase font-medium">ID: {sold.id_books}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-700 dark:text-slate-200">{getUserName(sold.id_users)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs font-medium text-slate-600 dark:text-slate-400">{formatDate(sold.date)}</div>
                    </td>
                  </tr>
                ))}
                {soldItems.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-slate-400 font-medium">Sotuvlar roʻyxati boʻsh</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {view === 'books' && (
        <div className="bg-gray-50 dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-700 p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold">Barcha kitoblar ({books.length})</h2>
            <button 
              onClick={handleAddBook}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all"
            >
              + Yangi qoʻshish
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {books.map(book => (
              <div key={book.id} className="flex flex-col gap-4 p-4 rounded-2xl bg-gray-100 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 relative group">
                <div className="flex items-center gap-4">
                  <img src={book.cover} className="w-12 h-16 object-cover rounded-lg" alt="" />
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-sm truncate">{book.name}</h4>
                    <p className="text-xs text-slate-500 truncate">{book.author}</p>
                    <p className="text-xs font-bold text-indigo-600 mt-1">{book.price?.toLocaleString()} UZS</p>
                    <span className={`text-[10px] font-bold uppercase ${book.status ? 'text-emerald-500' : 'text-rose-500'}`}>{book.status ? 'Mavjud' : 'Sotilgan'}</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <button onClick={() => handleEditBook(book)} className="flex-1 py-1.5 text-xs font-bold bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-indigo-500 transition-colors">Tahrirlash</button>
                  <button onClick={() => handleDeleteBook(book.id)} className="flex-1 py-1.5 text-xs font-bold bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-rose-500 hover:border-rose-500 transition-colors">Oʻchirish</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === 'users' && (
        <div className="bg-gray-50 dark:bg-gray-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Foydalanuvchi</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rol</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 dark:text-white">{user.name}</div>
                      <div className="text-[10px] text-slate-400 uppercase font-medium">ID: {user.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-600 dark:text-slate-400">{user.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                        user.admin ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                      }`}>
                        {user.admin ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3">
                        <button 
                          onClick={() => handleToggleAdmin(user.id)} 
                          className="text-xs font-bold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                          {user.admin ? 'Adminlikni olish' : 'Admin qilish'}
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user.id)} 
                          className="text-xs font-bold text-rose-600 hover:text-rose-800 dark:text-rose-400 dark:hover:text-rose-300"
                        >
                          Oʻchirish
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      </>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold mb-6">{editingBook.id ? 'Kitobni tahrirlash' : 'Yangi kitob qoʻshish'}</h3>
            <form onSubmit={handleSaveBook} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Nomi</label>
                <input 
                  type="text" 
                  required
                  value={editingBook.name || ''} 
                  onChange={e => setEditingBook({...editingBook, name: e.target.value})}
                  className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-indigo-500 outline-none font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Muallif</label>
                <input 
                  type="text" 
                  required
                  value={editingBook.author || ''} 
                  onChange={e => setEditingBook({...editingBook, author: e.target.value})}
                  className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-indigo-500 outline-none font-bold"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Janr</label>
                  <select 
                    required
                    value={editingBook.id_genre || ''} 
                    onChange={e => setEditingBook({...editingBook, id_genre: e.target.value})}
                    className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-indigo-500 outline-none font-bold"
                  >
                    <option value="">Tanlang</option>
                    {GENRES.map(g => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Narx (UZS)</label>
                  <input 
                    type="number" 
                    required
                    value={editingBook.price || ''} 
                    onChange={e => setEditingBook({...editingBook, price: Number(e.target.value)})}
                    className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-indigo-500 outline-none font-bold"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Tavsif</label>
                <textarea 
                  required
                  value={editingBook.description || ''} 
                  onChange={e => setEditingBook({...editingBook, description: e.target.value})}
                  className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-indigo-500 outline-none font-bold h-24 resize-none"
                ></textarea>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Muqova URL</label>
                <input 
                  type="text" 
                  value={editingBook.cover || ''} 
                  onChange={e => setEditingBook({...editingBook, cover: e.target.value})}
                  placeholder="https://..."
                  className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-indigo-500 outline-none font-bold"
                />
              </div>
              <div className="flex gap-4 mt-8">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 font-bold text-slate-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">Bekor qilish</button>
                <button type="submit" className="flex-1 py-3 font-bold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all">Saqlash</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
