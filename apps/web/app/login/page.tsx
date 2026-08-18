"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-6">Login</h1>
        <input 
          type="email" 
          name="email" 
          placeholder="Email" 
          className="border p-2 mb-4 w-full rounded" 
        />
        <input 
          type="password" 
          name="password" 
          placeholder="Password" 
          className="border p-2 mb-6 w-full rounded" 
        />
        <button type="submit" className="bg-blue-600 text-white w-full py-2 rounded font-bold">
          Submit
        </button>
      </form>
    </div>
  );
}
