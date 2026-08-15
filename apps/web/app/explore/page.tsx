"use client";

import React, { useEffect, useState } from 'react';
import { SearchBar, Typography, ListingCard } from '@itvara/ui';
import { useSearchParams } from 'next/navigation';

export default function ExplorePage() {
  const searchParams = useSearchParams();
  const hasSearchParams = searchParams && (searchParams.get('destination') || searchParams.get('adults'));
  const [flexibleListings, setFlexibleListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hasSearchParams) {
      // Fetch flexible recommendations for zero-state
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/listings/flexible?vibe=spiritual`)
        .then(res => res.json())
        .then(data => {
          setFlexibleListings(data.listings || []);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [hasSearchParams]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 py-6 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SearchBar />
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {hasSearchParams ? (
          <Typography variant="h2" className="text-center text-gray-500 mt-20">
            Search results will appear here based on the URL parameters.
          </Typography>
        ) : (
          <div>
            <div className="mb-8">
              <Typography variant="h1" className="text-3xl font-bold text-gray-900">I'm Flexible!</Typography>
              <Typography variant="body" className="text-gray-500 mt-2">Discover unique spiritual and nature retreats curated just for you.</Typography>
            </div>
            
            {loading ? (
              <Typography variant="body" className="text-gray-500">Curating stays...</Typography>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {flexibleListings.length > 0 ? (
                  flexibleListings.map(listing => (
                    <ListingCard
                      key={listing.id}
                      listing={{
                        id: listing.id,
                        title: listing.title,
                        price: Number(listing.pricePerNight),
                        rating: 4.8, // Mocked rating
                        imageUrls: ['https://via.placeholder.com/400x300?text=Retreat'],
                        isSuperhost: true,
                        amenities: listing.type
                      }}
                      onPress={() => console.log('Navigate to listing', listing.id)}
                    />
                  ))
                ) : (
                  <Typography variant="body" className="text-gray-500">No flexible stays found right now. Check back later!</Typography>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
