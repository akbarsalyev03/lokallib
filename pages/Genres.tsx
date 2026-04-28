
import React, { useState, useEffect } from 'react';
import { GENRES } from '../constants';
import { getBooks } from '../lib/api';
import { Book } from '../types';
import BookCard from '../components/BookCard';

const Genres: React.FC = () => {
  const [activeGenreId, setActiveGenreId] = useState<string | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await getBooks();
        setBooks(data);
      } catch (error) {
        console.error('Kitoblarni yuklashda xatolik:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBooks();
  }, []);


  const filteredBooks = activeGenreId 
    ? books.filter(b => b.id_genre === activeGenreId)
    : books;

  const genresWithCount = GENRES.map(g => ({
    ...g,
    count: books.filter(b => b.id_genre === g.id).length
  }));

  const activeGenreName = GENRES.find(g => g.id === activeGenreId)?.name;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-page">
      <header className="mb-20 text-center">
        <h1 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter">Janrlar <span className="text-indigo-600">olami.</span></h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg max-w-xl mx-auto">Kutubxonamizdagi barcha asarlarni o'zingizga yoqqan yo'nalish bo'yicha saralab oling.</p>
      </header>

      {/* Genre Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 mb-24">
        <button 
          onClick={() => setActiveGenreId(null)}
          className={`group p-8 rounded-[40px] border-2 transition-all flex flex-col items-center gap-4 ${
            activeGenreId === null 
              ? 'bg-indigo-600 border-indigo-600 text-white shadow-2xl shadow-indigo-600/30' 
              : 'bg-gray-50 dark:bg-gray-900 border-transparent hover:border-indigo-500 text-slate-900 dark:text-white'
          }`}
        >
          <span className="text-5xl group-hover:scale-110 transition-transform">🌍</span>
          <div className="text-center">
            <span className="block font-black text-sm">Barchasi</span>
            <span className={`text-[10px] font-bold uppercase tracking-widest opacity-60`}>
              {books.length} ta kitob
            </span>
          </div>
        </button>

        {genresWithCount.map((genre) => (
          <button 
            key={genre.id}
            onClick={() => setActiveGenreId(genre.id)}
            className={`group p-8 rounded-[40px] border-2 transition-all flex flex-col items-center gap-4 ${
              activeGenreId === genre.id 
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-2xl shadow-indigo-600/30' 
                : 'bg-gray-50 dark:bg-gray-900 border-transparent hover:border-indigo-500 text-slate-900 dark:text-white'
            }`}
          >
            <span className="text-5xl group-hover:scale-110 transition-transform">{genre.icon}</span>
            <div className="text-center">
              <span className="block font-black text-sm">{genre.name}</span>
              <span className={`text-[10px] font-bold uppercase tracking-widest opacity-60`}>
                {genre.count} ta kitob
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Results Section */}
      <div>
        <div className="flex items-center gap-8 mb-12">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white whitespace-nowrap">
            {activeGenreName ? `${activeGenreName} yo'nalishidagi kitoblar` : 'Barcha kitoblar'}
          </h2>
          <div className="h-[2px] flex-grow bg-slate-100 dark:bg-slate-800 rounded-full"></div>
          <span className="px-5 py-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl text-sm font-black text-indigo-600">{filteredBooks.length} natija</span>
        </div>

        {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
            {filteredBooks.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-slate-50 dark:bg-slate-900/50 rounded-[50px] border-4 border-dashed border-slate-100 dark:border-slate-800">
            <span className="text-7xl mb-6 block">📚</span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Hozircha bo'sh</h3>
            <p className="text-slate-500 dark:text-slate-400">Tez orada bu janrda yangi kitoblar qo'shiladi.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Genres;
