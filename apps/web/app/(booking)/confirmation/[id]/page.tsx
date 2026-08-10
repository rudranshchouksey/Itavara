"use client";

import React from 'react';
import { Typography, Button } from '@itvara/ui';
import { CheckCircle2, MapPin, Calendar, FileText, ArrowRight } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function BookingConfirmationPage() {
  const params = useParams();
  const id = params?.id || 'demo-id';
  const router = useRouter();

  // Mocked data for layout
  const booking = {
    id,
    listingTitle: 'Peaceful Himalayan Monastery Retreat',
    location: 'Dharamshala, Himachal Pradesh, India',
    checkIn: 'Oct 12, 2026',
    checkOut: 'Oct 17, 2026',
    totalPrice: 15400,
    hostName: 'Lama Tenzin',
    hostPhone: '+91 98765 43210'
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 min-h-[80vh] flex flex-col justify-center">
      
      {/* Success Header */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <CheckCircle2 size={80} className="text-green-500" />
        </div>
        <Typography variant="h1" className="text-4xl font-extrabold text-[#222222] mb-4">
          Pack your bags!
        </Typography>
        <Typography variant="body" className="text-xl text-gray-600">
          Your booking is confirmed. We've sent a receipt to your email.
        </Typography>
      </div>

      {/* Booking Summary Card */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden mb-8">
        <div className="bg-gray-50 px-8 py-6 border-b border-gray-200">
          <Typography variant="h2" className="text-2xl font-bold text-[#222222]">
            {booking.listingTitle}
          </Typography>
          <div className="flex items-center gap-2 mt-2 text-gray-600">
            <MapPin size={18} />
            <Typography variant="body">{booking.location}</Typography>
          </div>
        </div>
        
        <div className="px-8 py-6">
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <Typography variant="caption" className="text-gray-500 uppercase tracking-wider font-bold mb-1">Check-in</Typography>
              <Typography variant="body" className="text-lg font-semibold">{booking.checkIn}</Typography>
              <Typography variant="body" className="text-gray-500">3:00 PM</Typography>
            </div>
            <div>
              <Typography variant="caption" className="text-gray-500 uppercase tracking-wider font-bold mb-1">Check-out</Typography>
              <Typography variant="body" className="text-lg font-semibold">{booking.checkOut}</Typography>
              <Typography variant="body" className="text-gray-500">11:00 AM</Typography>
            </div>
          </div>

          <div className="border-t border-gray-200 py-6 mb-6">
            <Typography variant="h2" className="text-lg font-bold mb-4">Host Contact Instructions</Typography>
            <Typography variant="body" className="text-gray-700">
              Your host, {booking.hostName}, will be waiting for you. You can reach them at <strong className="text-[#FF385C]">{booking.hostPhone}</strong> for directions or early check-in requests.
            </Typography>
          </div>

          <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
            <Typography variant="body" className="font-semibold text-gray-700">Total Paid</Typography>
            <Typography variant="h2" className="text-xl font-bold">₹{booking.totalPrice}</Typography>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button className="flex items-center justify-center gap-2 px-8 py-4 bg-[#FF385C] text-white rounded-xl font-bold text-lg hover:bg-[#e03150] transition">
          <FileText size={20} />
          Download E-Receipt
        </button>
        <button 
          onClick={() => router.push('/explore')}
          className="flex items-center justify-center gap-2 px-8 py-4 border border-gray-300 rounded-xl font-bold text-lg hover:bg-gray-50 transition"
        >
          Explore More Stays
          <ArrowRight size={20} />
        </button>
      </div>

    </div>
  );
}
