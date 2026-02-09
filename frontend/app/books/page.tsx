'use client';

import { useEffect, useState } from 'react';
import { bookService, orderService } from '@/lib/api';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

interface Book {
    id: number;
    title: string;
    author: string;
    price: number;
    stock: number;
}

export default function BooksPage() {
    const { data: session } = useSession();
    const [books, setBooks] = useState<Book[]>([]);
    const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchBooks();
    }, [session]);

    useEffect(() => {
        const lower = search.toLowerCase();
        setFilteredBooks(books.filter(b =>
            b.title.toLowerCase().includes(lower) ||
            b.author.toLowerCase().includes(lower)
        ));
    }, [search, books]);

    const fetchBooks = async () => {
        try {
            const response = await bookService.get('/books');
            setBooks(response.data);
            setFilteredBooks(response.data);
        } catch (error) {
            console.error('Failed to fetch books:', error);
            toast.error("Could not load library.");
        } finally {
            setLoading(false);
        }
    };

    const placeOrder = async (bookId: number) => {
        if (!session) {
            toast.error('Please sign in to place an order');
            return;
        }
        const loadingToast = toast.loading('Processing order...');
        try {
            await orderService.post('/orders', {
                bookId,
                quantity: 1
            });
            toast.success('Order placed successfully!', { id: loadingToast });
            fetchBooks(); // Refresh to show new stock
        } catch (error: any) {
            console.error('Failed to place order:', error);
            toast.error(error.response?.data?.message || 'Failed to place order.', { id: loadingToast });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-xl font-semibold text-gray-700">Loading catalog...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
            <div className="container mx-auto px-4 py-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                    <div>
                        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent mb-2">
                            📚 Library Catalog
                        </h1>
                        <p className="text-gray-600 text-lg">Discover your next favorite book</p>
                    </div>
                    <div className="relative w-full md:w-96">
                        <input
                            type="text"
                            placeholder="Search by title or author..."
                            className="border-2 border-indigo-200 rounded-full px-6 py-3 w-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none shadow-md transition-all"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <svg className="absolute right-4 top-3.5 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                {/* Stats Bar */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-indigo-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Total Books</p>
                                <p className="text-3xl font-bold text-gray-800">{books.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Available</p>
                                <p className="text-3xl font-bold text-gray-800">{books.filter(b => b.stock > 0).length}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-pink-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Search Results</p>
                                <p className="text-3xl font-bold text-gray-800">{filteredBooks.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {filteredBooks.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-16 text-center">
                        <svg className="w-24 h-24 mx-auto text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-2xl font-bold text-gray-700 mb-2">No books found</h3>
                        <p className="text-gray-500">No books match your search for "{search}"</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredBooks.map((book) => (
                            <div key={book.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col group transform hover:-translate-y-2">
                                {/* Book Cover */}
                                <div className="h-56 bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 relative overflow-hidden">
                                    <div className="absolute inset-0 flex items-center justify-center text-white text-6xl font-bold opacity-90">
                                        {book.title.charAt(0)}
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    {book.stock <= 0 && (
                                        <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                                            Sold Out
                                        </div>
                                    )}
                                    {book.stock > 0 && book.stock < 5 && (
                                        <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                                            Low Stock
                                        </div>
                                    )}
                                </div>

                                {/* Book Details */}
                                <div className="p-6 flex-1 flex flex-col">
                                    <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 min-h-[3.5rem]" title={book.title}>
                                        {book.title}
                                    </h2>
                                    <p className="text-gray-600 mb-4 italic flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        {book.author}
                                    </p>

                                    <div className="mt-auto">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <span className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                                    ${book.price}
                                                </span>
                                            </div>
                                            <div className={`flex items-center space-x-1 text-sm font-medium ${book.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                </svg>
                                                <span>{book.stock > 0 ? `${book.stock} left` : 'Out'}</span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => placeOrder(book.id)}
                                            className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 shadow-md transform active:scale-95 flex items-center justify-center space-x-2
                                                ${book.stock > 0
                                                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg'
                                                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                                            disabled={!session || book.stock <= 0}
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                            </svg>
                                            <span>{book.stock > 0 ? 'Add to Cart' : 'Sold Out'}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
