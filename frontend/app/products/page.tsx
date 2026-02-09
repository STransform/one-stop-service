'use client';

import { useEffect, useState } from 'react';
import { productService } from '@/lib/api';
import toast from 'react-hot-toast';

interface Product {
    id: number;
    name: string;
    description: string;
    category: string;
    brand: string;
    sku: string;
    price: number;
    stock: number;
    imageUrl?: string;
    weight?: number;
    dimensions?: string;
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedBrand, setSelectedBrand] = useState('all');

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        filterProducts();
    }, [products, searchQuery, selectedCategory, selectedBrand]);

    const fetchProducts = async () => {
        try {
            const response = await productService.get('/products');
            setProducts(response.data);
        } catch (error) {
            toast.error('Failed to load products');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const filterProducts = () => {
        let filtered = products;

        if (searchQuery) {
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (selectedCategory !== 'all') {
            filtered = filtered.filter(p => p.category === selectedCategory);
        }

        if (selectedBrand !== 'all') {
            filtered = filtered.filter(p => p.brand === selectedBrand);
        }

        setFilteredProducts(filtered);
    };

    const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];
    const brands = ['all', ...Array.from(new Set(products.map(p => p.brand)))];
    const availableProducts = products.filter(p => p.stock > 0).length;

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg font-medium">Loading products...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 py-8">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent mb-2">
                        Product Catalog
                    </h1>
                    <p className="text-gray-600 text-lg">Discover our amazing products</p>
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            />
                            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>

                        {/* Category Filter */}
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>
                                    {cat === 'all' ? 'All Categories' : cat}
                                </option>
                            ))}
                        </select>

                        {/* Brand Filter */}
                        <select
                            value={selectedBrand}
                            onChange={(e) => setSelectedBrand(e.target.value)}
                            className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        >
                            {brands.map(brand => (
                                <option key={brand} value={brand}>
                                    {brand === 'all' ? 'All Brands' : brand}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Stats Bar */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white rounded-xl shadow-md p-4 flex items-center space-x-4">
                        <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Products</p>
                            <p className="text-2xl font-bold text-gray-800">{products.length}</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-4 flex items-center space-x-4">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Available</p>
                            <p className="text-2xl font-bold text-gray-800">{availableProducts}</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-4 flex items-center space-x-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Search Results</p>
                            <p className="text-2xl font-bold text-gray-800">{filteredProducts.length}</p>
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                {filteredProducts.length === 0 ? (
                    <div className="text-center py-16">
                        <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        <p className="text-gray-500 text-xl">No products found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.map((product) => (
                            <div key={product.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                                {/* Product Image */}
                                <div className="h-56 bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center relative">
                                    {product.stock === 0 && (
                                        <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                                            Out of Stock
                                        </div>
                                    )}
                                    {product.stock > 0 && product.stock < 5 && (
                                        <div className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                                            Low Stock
                                        </div>
                                    )}
                                    {product.imageUrl ? (
                                        <img src={product.imageUrl} alt={product.name} className="max-h-full max-w-full object-cover" />
                                    ) : (
                                        <div className="text-white text-6xl font-bold">{product.name.charAt(0)}</div>
                                    )}
                                </div>

                                {/* Product Info */}
                                <div className="p-4">
                                    <div className="mb-2">
                                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-indigo-100 text-indigo-800">
                                            {product.category}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
                                    <p className="text-sm text-gray-500 mb-2">{product.brand}</p>
                                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>

                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                            ${product.price.toFixed(2)}
                                        </span>
                                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-800">
                                            Stock: {product.stock}
                                        </span>
                                    </div>

                                    <button
                                        disabled={product.stock === 0}
                                        className={`w-full py-2 px-4 rounded-lg font-semibold shadow-md transition-all duration-300 ${product.stock === 0
                                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-xl'
                                            }`}
                                    >
                                        {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
