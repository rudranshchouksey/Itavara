"use client";

import React, { useState, useMemo } from 'react';
import { Typography, Avatar, Button } from '@itvara/ui';
import { MapPin, Wifi, Car, Coffee, Shield, Heart, Share, Star } from 'lucide-react';
import { useParams } from 'next/navigation';
import { calculateTripQuote } from '@itvara/utils';

export default function PropertyDetailPage() {
  const params = useParams();
  const id = params?.id || 'demo-id';

  // Booking Widget State
  const [nights, setNights] = useState(5);
  const [addons, setAddons] = useState({
    cabRental: false,
    culturalAttire: false,
    foodCuration: false,
    localGuide: false,
  });

  const quote = useMemo(() => calculateTripQuote({
    basePricePerNight: 2500, // listing.price
    nights,
    addons
  }), [nights, addons]);

  // Mocked data for layout
  const listing = {
    title: 'Peaceful Himalayan Monastery Retreat',
    type: 'MONASTERY',
    price: 2500,
    rating: 4.95,
    reviews: 124,
    location: 'Dharamshala, Himachal Pradesh, India',
    images: [
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1517457210515-5e581e28f32c?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1513269228966-21805b50d507?auto=format&fit=crop&q=80&w=600'
    ],
    host: {
      name: 'Lama Tenzin',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100',
      isSuperhost: true,
      identityVerified: true,
      hostingSince: '2019'
    },
    amenities: [
      { name: 'Wifi', icon: Wifi },
      { name: 'Free parking', icon: Car },
      { name: 'Breakfast', icon: Coffee },
      { name: 'Security', icon: Shield }
    ],
    description: 'Experience true serenity in our traditional monastery. Wake up to the sounds of morning chants and breathtaking views of the Dhauladhar range.'
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen bg-white">
      
      {/* Title & Header Section */}
      <div className="mb-6">
        <Typography variant="h1" className="text-3xl font-bold text-[#222222] mb-2">{listing.title}</Typography>
        <div className="flex justify-between items-end">
          <div className="flex items-center gap-2 text-sm text-[#222222] font-semibold">
            <Star size={16} fill="#222" />
            <span>{listing.rating}</span>
            <span className="underline">{listing.reviews} reviews</span>
            <span className="text-gray-400">•</span>
            {listing.host.isSuperhost && (
              <>
                <span className="text-gray-500">Superhost</span>
                <span className="text-gray-400">•</span>
              </>
            )}
            <span className="underline">{listing.location}</span>
          </div>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 font-semibold underline"><Share size={16} /> Share</button>
            <button className="flex items-center gap-2 font-semibold underline"><Heart size={16} /> Save</button>
          </div>
        </div>
      </div>

      {/* Photo Grid (Airbnb Style) */}
      <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[50vh] min-h-[400px] rounded-2xl overflow-hidden mb-10">
        <div className="col-span-2 row-span-2 h-full w-full">
          <img src={listing.images[0]} alt="Main photo" className="w-full h-full object-cover hover:opacity-90 transition cursor-pointer" />
        </div>
        <div className="col-span-1 row-span-1 h-full w-full">
          <img src={listing.images[1]} alt="Photo 2" className="w-full h-full object-cover hover:opacity-90 transition cursor-pointer" />
        </div>
        <div className="col-span-1 row-span-1 h-full w-full">
          <img src={listing.images[2]} alt="Photo 3" className="w-full h-full object-cover hover:opacity-90 transition cursor-pointer" />
        </div>
        <div className="col-span-1 row-span-1 h-full w-full">
          <img src={listing.images[3]} alt="Photo 4" className="w-full h-full object-cover hover:opacity-90 transition cursor-pointer" />
        </div>
        <div className="col-span-1 row-span-1 h-full w-full">
          <img src={listing.images[4]} alt="Photo 5" className="w-full h-full object-cover hover:opacity-90 transition cursor-pointer" />
        </div>
      </div>

      {/* Two Column Layout (Content + Booking Widget) */}
      <div className="flex flex-col md:flex-row gap-12 relative">
        
        {/* Left Column (Content) */}
        <div className="w-full md:w-2/3">
          
          {/* Host Intro Card */}
          <div className="flex items-center justify-between pb-6 border-b border-gray-200">
            <div>
              <Typography variant="h2" className="text-xl font-bold mb-1">Hosted by {listing.host.name}</Typography>
              <Typography variant="body" className="text-gray-500">
                {listing.host.isSuperhost ? 'Superhost • ' : ''}{listing.host.identityVerified ? 'Identity verified • ' : ''}Hosting since {listing.host.hostingSince}
              </Typography>
            </div>
            <Avatar src={listing.host.avatar} size={56} alt={listing.host.name} />
          </div>

          {/* Description */}
          <div className="py-8 border-b border-gray-200">
            <Typography variant="body" className="text-[#222222] text-lg leading-relaxed">
              {listing.description}
            </Typography>
          </div>

          {/* Amenities Checklist */}
          <div className="py-8 border-b border-gray-200">
            <Typography variant="h2" className="text-2xl font-bold mb-6">What this place offers</Typography>
            <div className="grid grid-cols-2 gap-4">
              {listing.amenities.map((amenity, i) => {
                const Icon = amenity.icon;
                return (
                  <div key={i} className="flex items-center gap-4 text-[#222222]">
                    <Icon size={28} strokeWidth={1.5} />
                    <span className="text-lg">{amenity.name}</span>
                  </div>
                );
              })}
            </div>
            <button className="mt-8 px-6 py-3 border border-gray-900 rounded-lg font-semibold hover:bg-gray-50 transition">
              Show all amenities
            </button>
          </div>

          {/* Mapbox Interactive Map Placeholder */}
          <div className="py-8">
            <Typography variant="h2" className="text-2xl font-bold mb-6">Where you'll be</Typography>
            <Typography variant="body" className="text-gray-500 mb-4">{listing.location}</Typography>
            <div className="w-full h-[400px] bg-blue-50 rounded-xl overflow-hidden relative flex items-center justify-center">
              {/* Mapbox GL Stub */}
              <div className="absolute inset-0 bg-gray-200" style={{ backgroundImage: 'radial-gradient(#d1d5db 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
              <div className="z-10 flex flex-col items-center">
                <MapPin size={48} color="#FF385C" className="mb-2" />
                <div className="w-48 h-48 bg-[#FF385C] rounded-full opacity-30 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                <Typography variant="h2" className="text-gray-700 bg-white px-4 py-2 rounded-lg shadow-sm">Mapbox GL GL Placeholder</Typography>
                <Typography variant="body" className="text-sm text-gray-500 mt-2 bg-white px-2 py-1 rounded shadow-sm">Location circle centered on {listing.location}</Typography>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column (Booking Widget Sticky) */}
        <div className="w-full md:w-1/3">
          <div className="sticky top-28 bg-white border border-gray-200 rounded-2xl p-6 shadow-xl">
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-2xl font-bold text-[#222222]">₹{listing.price}</span>
              <span className="text-gray-500">night</span>
            </div>
            
            {/* Custom Addons Toggles */}
            <div className="mb-6 border-b border-gray-200 pb-4">
              <Typography variant="h2" className="text-lg font-bold mb-3">Custom Add-ons</Typography>
              
              <label className="flex items-center justify-between mb-3 cursor-pointer">
                <span className="text-gray-700">Cab / Car Rental</span>
                <input type="checkbox" className="w-5 h-5 accent-[#FF385C]" checked={addons.cabRental} onChange={(e) => setAddons({...addons, cabRental: e.target.checked})} />
              </label>
              
              <label className="flex items-center justify-between mb-3 cursor-pointer">
                <span className="text-gray-700">Local Guide</span>
                <input type="checkbox" className="w-5 h-5 accent-[#FF385C]" checked={addons.localGuide} onChange={(e) => setAddons({...addons, localGuide: e.target.checked})} />
              </label>

              <label className="flex items-center justify-between mb-3 cursor-pointer">
                <span className="text-gray-700">Cultural Attire</span>
                <input type="checkbox" className="w-5 h-5 accent-[#FF385C]" checked={addons.culturalAttire} onChange={(e) => setAddons({...addons, culturalAttire: e.target.checked})} />
              </label>

              <label className="flex items-center justify-between mb-3 cursor-pointer">
                <span className="text-gray-700">Food Curation</span>
                <input type="checkbox" className="w-5 h-5 accent-[#FF385C]" checked={addons.foodCuration} onChange={(e) => setAddons({...addons, foodCuration: e.target.checked})} />
              </label>
            </div>

            <Button variant="primary" title="Reserve" onPress={() => {}} />
            <div className="text-center mt-4 mb-6">
              <span className="text-gray-500 text-sm">You won't be charged yet</span>
            </div>

            {/* Line Items */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-700">
                <span className="underline">₹{listing.price} x {nights} nights</span>
                <span>₹{quote.baseTotal}</span>
              </div>
              
              {quote.addonsTotal > 0 && (
                <div className="flex justify-between text-gray-700">
                  <span className="underline">Custom Add-ons</span>
                  <span>₹{quote.addonsTotal}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-700">
                <span className="underline">Service fee</span>
                <span>₹{quote.serviceFee}</span>
              </div>

              <div className="flex justify-between text-gray-700">
                <span className="underline">Taxes</span>
                <span>₹{quote.taxes}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 flex justify-between">
              <span className="text-lg font-bold text-[#222222]">Total</span>
              <span className="text-lg font-bold text-[#222222]">₹{quote.grandTotal}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
