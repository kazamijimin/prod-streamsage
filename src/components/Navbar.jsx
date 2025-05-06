'use client'
import Image from 'next/image'
import Link from 'next/link';
import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';

function GlobalNavbar() {
    const [showSearch, setShowSearch] = useState(false);
    const inputRef = useRef(null);
    useEffect(() => {
        if (showSearch && inputRef.current) {
            inputRef.current.focus();
        }
    }, [showSearch]);
    return (
        <div className="navbar bg-white text-black shadow-sm sticky top-0 z-50">
            <div className="flex-1">
                <Link href="/" className="btn btn-ghost text-xl">
                    <img src="/logo/streamsage-logo.png" width={40} />
                </Link>
            </div>
            <div className="flex-none flex items-center gap-2">
              <Link href="/upload">
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded shadow transition">
                  Upload Video
                </button>
              </Link>
                <button
                    className="btn btn-ghost btn-circle hover:bg-indigo-700"
                    aria-label="Open search"
                    onClick={() => setShowSearch(true)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
                    </svg>
                </button>
                {/* Search Overlay */}
                {showSearch && (
                    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
                        <div className="relative w-full max-w-xl mx-auto bg-white rounded-2xl shadow-2xl p-8 flex flex-col gap-6 animate-fadeIn">
                            <button
                                className="absolute top-4 right-4 btn btn-sm btn-circle btn-ghost hover:bg-indigo-700"
                                aria-label="Close search"
                                onClick={() => setShowSearch(false)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <h2 className="text-2xl font-semibold mb-2 text-center">Search</h2>
                            <input
                                ref={inputRef}
                                type="text"
                                className="w-full px-5 py-3 rounded-lg border border-gray-300 bg-white text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition"
                                placeholder="Type to search..."
                                autoFocus
                            />
                        </div>
                    </div>
                )}
                <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-indigo-100 text-indigo-600 font-bold text-lg">
                            {(() => {
                              const { user } = useAuth();
                              return user?.email?.charAt(0).toUpperCase() || 'U';
                            })()}
                          </AvatarFallback>
                        </Avatar>
                    </label>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-white text-black rounded-box z-1 mt-3 w-52 p-2 shadow">
                        <li>
                            <Link href="/account" className="justify-between">
                                Profile
                            </Link>
                        </li>
                        <li>
                          <button
                            onClick={async () => {
                              await supabase.auth.signOut();
                              window.location.href = '/auth/login';
                            }}
                            className="w-full text-left px-2 py-1 rounded hover:bg-gray-100 transition"
                          >
                            Logout
                          </button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default GlobalNavbar