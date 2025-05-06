'use client'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) {
      if (
        error.message.toLowerCase().includes("already registered") ||
        error.message.toLowerCase().includes("user already exists") ||
        error.status === 400
      ) {
        setError(
          <span>
            This email is already registered. <a href="/auth/login" className="text-indigo-600 underline">Login instead</a>.
          </span>
        );
      } else {
        setError(error.message);
      }
    } else {
      setSuccess("Check your email to confirm your account.");
      setTimeout(() => router.replace("/"), 2000);
    }
  };

  return (
    <section className="bg-gray-50">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900">
          <img className="w-8 h-8 mr-2" src="/logo/streamsage-logo.png" alt="logo" />
        </a>
        <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
              Sign up for a StreamSage account
            </h1>
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Your email</label>
                <input type="email" id="email" className="bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="name@company.com" value={email} onChange={e => setEmail(e.target.value)} required/>
              </div>
              <div>
                <label htmlFor="pass" className="block mb-2 text-sm font-medium text-gray-900">Password</label>
                <input type="password" id="pass" className="bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required/>
              </div>
              {error && <div className="text-red-500 text-sm">{error}</div>}
              {success && <div className="text-green-600 text-sm">{success}</div>}
              <Button type="submit" className="w-full bg-indigo-600" disabled={loading}>
                {loading ? "Signing up..." : "Sign Up"}
              </Button>
              <p className="text-sm font-light text-gray-500">
                Already have an account? <Link href="/auth/login" className="font-medium text-blue-600 hover:underline">Log In</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}