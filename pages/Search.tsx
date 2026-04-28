
import React, { useState, useEffect } from 'react';
import { searchBooksFromBackend } from '../lib/api';
import { Book } from '../types';
import BookCard from '../components/BookCard';

const Search: React.FC = () => {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Backenddan qidirish logikasi
  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const results = await searchBooksFromBackend(query);
        
        if (Array.isArray(results)) {
          setBooks(results);
        } else if (results && (results as any).data && Array.isArray((results as any).data)) {
          setBooks((results as any).data);
        } else {
          setBooks([]);
        }
      } catch (err) {
        console.error("Backenddan ma'lumot olishda xatolik:", err);
        setError("Ma'lumotlarni yuklashda xatolik yuz berdi. Iltimos qayta urinib ko'ring.");
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchResults();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [query]);


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto mb-16">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white text-center mb-8">Nima oʻqishni xohlaysiz?</h1>
        <div className="relative group">
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
            <span className="text-xl">🔍</span>
          </div>
          <input 
            type="text" 
            placeholder="Kitob nomi, muallif yoki janr..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 py-6 pl-16 pr-6 rounded-3xl text-lg font-medium shadow-xl focus:border-indigo-600 focus:outline-none transition-all group-hover:shadow-indigo-500/10"
          />
        </div>
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">Ommabop:</span>
          {['Tarix', 'Fantastika', 'Psixologiya', 'Texnologiya'].map(tag => (
            <button 
              key={tag}
              onClick={() => setQuery(tag)}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
        {isLoading ? (
          <div className="col-span-full text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-slate-500 dark:text-slate-400">Qidirilmoqda...</p>
          </div>
        ) : error ? (
          <div className="col-span-full text-center py-20">
            <span className="text-4xl mb-4 block">⚠️</span>
            <h3 className="text-lg font-bold text-red-600 dark:text-red-400">{error}</h3>
          </div>
        ) : (
          <>
            {books.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
            {books.length === 0 && (
              <div className="col-span-full text-center py-20">
                <span className="text-4xl mb-4 block">😕</span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Hech nima topilmadi</h3>
                <p className="text-slate-500 dark:text-slate-400">Boshqa kalit soʻzdan foydalanib koʻring.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Search;
