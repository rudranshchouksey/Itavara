import React from 'react';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md">
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
        <Link href="/explore" className="block text-center bg-blue-600 text-white w-full py-2 rounded font-bold" type="submit">
          Submit
        </Link>
      </div>
    </div>
  );
}
