"use client";

import React from 'react';
import { SearchBar, Typography } from '@itvara/ui';

export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header section containing the SearchBar */}
      <div className="bg-white border-b border-gray-200 py-6 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SearchBar />
        </div>
      </div>
      
      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Typography variant="h2" className="text-center text-gray-500 mt-20">
          Search results will appear here based on the URL parameters.
        </Typography>
      </div>
    </div>
  );
}
