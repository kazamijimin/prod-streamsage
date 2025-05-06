'use client'
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      router.replace("/");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <img className="w-8 h-8 mb-6" src="/logo/streamsage-logo.png" alt="logo" />
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md flex flex-col gap-6"
      >
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Sign in to your account</h1>
        <input
          type="email"
          className="border border-gray-300 rounded px-3 py-2 text-base"
          placeholder="Email"
          autoComplete="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="border border-gray-300 rounded px-3 py-2 text-base"
          placeholder="Password"
          autoComplete="current-password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button
          type="submit"
          className="bg-indigo-600 text-white px-5 py-2 rounded font-medium hover:bg-indigo-700 disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
        <a href="/auth/forgot-password" className="text-xs text-indigo-600 hover:underline">Forgot password?</a>
        <div className="text-sm mt-2 text-gray-600">
          Don't have an account? <a href="/auth/signup" className="text-indigo-600 hover:underline">Sign up</a>
        </div>
      </form>
    </div>
  );
}