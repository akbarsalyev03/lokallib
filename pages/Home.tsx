
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getBooks } from '../lib/api';
import { Book } from '../types';
import { GENRES } from '../constants';
import BookCard from '../components/BookCard';

const Home: React.FC = () => {
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


  return (
    <div className="pb-20">
      <header className="py-24 max-w-7xl mx-auto px-6 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-20 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-400 rounded-full blur-[100px]"></div>
        </div>

        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-none">
          Mutolaani <span className="text-indigo-600">boshlang.</span>
        </h1>
        <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-12 font-medium">
          Lokal kutubxona tizimi orqali sevimli asarlaringizni sotib oling va o'zingizga qulay vaqtda o'qing.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/search" className="btn-primary">Kitob izlash</Link>
          <Link to="/genres" className="btn-secondary">Janrlarni ko'rish</Link>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 mb-24">
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-3xl font-black">Yangi qo'shilganlar</h2>
          <Link to="/search" className="text-indigo-600 font-bold hover:underline">Barchasi →</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-3xl h-64 w-full"></div>
            ))
          ) : (
            books.slice(0, 5).map(book => (
              <BookCard key={book.id} book={book} />
            ))
          )}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 mb-24">
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-3xl font-black">Janrlar</h2>
          <Link to="/genres" className="text-indigo-600 font-bold hover:underline">Barchasi →</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {GENRES.slice(0, 6).map(genre => (
            <Link 
              to="/genres" 
              key={genre.name}
              className="group p-6 rounded-3xl bg-gray-50 dark:bg-gray-900 hover:bg-indigo-600 hover:text-white transition-all text-center"
            >
              <span className="text-4xl mb-4 block group-hover:scale-110 transition-transform">{genre.icon}</span>
              <span className="font-bold">{genre.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6">
        <div className="bg-indigo-600 rounded-[40px] p-12 text-center text-white relative overflow-hidden shadow-2xl shadow-indigo-500/20">
          <div className="relative z-10">
            <h2 className="text-4xl font-black mb-6">O'z kutubxonangizni yarating</h2>
            <p className="text-indigo-100 text-lg mb-10 max-w-xl mx-auto">Minglab kitoblar orasidan o'zingizga yoqqanini tanlang va bir necha soniyada xarid qiling.</p>
            <Link to="/register" className="bg-white text-indigo-600 px-10 py-4 rounded-2xl font-black hover:scale-105 transition-transform inline-block">Ro'yxatdan o'tish</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
