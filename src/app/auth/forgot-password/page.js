'use client'
import { useState } from 'react';
import { supabase } from "@/lib/supabaseClient";
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setMessage("Password reset email sent. Check your inbox.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md flex flex-col gap-6"
      >
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password</h1>
        <input
          type="email"
          className="border border-gray-300 rounded px-3 py-2 text-base"
          placeholder="Email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {message && <div className="text-green-600 text-sm">{message}</div>}
        <button
          type="submit"
          className="bg-indigo-600 text-white px-5 py-2 rounded font-medium hover:bg-indigo-700 disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Reset Email"}
        </button>
        <div className="text-sm mt-2 text-gray-600">
          <Link href="/auth/login" className="text-indigo-600 hover:underline">Back to login</Link>
        </div>
      </form>
      {message && <p className="mt-4 text-green-600 text-center">{message}</p>}
      {error && <p className="mt-4 text-red-600 text-center">{error}</p>}
      <div className="mt-6 text-center">
        <Link href="/auth/login" className="text-blue-600 hover:underline">Back to Login</Link>
      </div>
    </div>
  );
}
