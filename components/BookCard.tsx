
import React from 'react';
import { Link } from 'react-router-dom';
import { Book } from '../types';
import { GENRES } from '../constants';

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const isAvailable = book.status === true;
  const genreName = GENRES.find(g => g.id === book.id_genre)?.name || 'Noma\'lum';

  return (
    <Link to={`/book/${book.id}`} className="group block bg-gray-50 dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300">
      <div className="aspect-[2/3] overflow-hidden relative">
        <img 
          src={book.cover} 
          alt={book.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-full backdrop-blur-md shadow-sm border ${
            isAvailable 
              ? 'bg-emerald-500/90 text-white border-emerald-400/50' 
              : 'bg-rose-500/90 text-white border-rose-400/50'
          }`}>
            {isAvailable ? 'Mavjud' : 'Sotilgan'}
          </span>
        </div>
      </div>
      <div className="p-4">
        <p className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-1">{genreName}</p>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 mb-1">{book.name}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 truncate mb-2">{book.author}</p>
        {isAvailable && (
          <p className="text-sm font-black text-slate-900 dark:text-white">{book.price?.toLocaleString()} UZS</p>
        )}
      </div>
    </Link>
  );
};

export default BookCard;
