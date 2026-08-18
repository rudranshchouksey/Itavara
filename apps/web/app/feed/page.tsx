"use client";

import React, { useEffect, useState } from 'react';

export default function FeedPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/feed/trending`)
      .then(res => res.json())
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  }, []);

  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="feed-container min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-8">Trending Feed</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="mini-blog-post bg-white p-6 rounded-xl shadow-md mb-8">
          <h2 className="text-2xl font-bold mb-4">A Spiritual Journey in Bali</h2>
          <p className="text-gray-600 mb-6">
            Bali is more than just a destination; it's a mood, an aspiration, a tropical state of mind...
          </p>
          
          {/* Embedded Itinerary Card */}
          <div 
            className="itinerary-card bg-blue-50 border border-blue-100 p-4 rounded-lg cursor-pointer"
            onClick={() => setDrawerOpen(true)}
          >
            <h3 className="font-semibold text-blue-900">Bali Retreat 5-Day Itinerary</h3>
            <p className="text-sm text-blue-700">Click to view details and book instantly.</p>
          </div>
        </div>
      )}

      {/* Instant Booking Drawer */}
      {drawerOpen && (
        <div className="booking-drawer drawer-open fixed inset-y-0 right-0 w-96 bg-white shadow-2xl p-6 z-50">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Instant Book</h2>
            <button onClick={() => setDrawerOpen(false)} className="text-gray-500">Close</button>
          </div>
          <p className="mb-8">Ready to embark on this journey?</p>
          <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg">
            Instant Book
          </button>
        </div>
      )}
    </div>
  );
}
