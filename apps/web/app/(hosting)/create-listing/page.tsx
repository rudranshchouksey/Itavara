"use client";

import React, { useState } from 'react';
import Step1PropertyType from './components/Step1PropertyType';
import Step2Location from './components/Step2Location';
import Step3Details from './components/Step3Details';
import Step4Addons from './components/Step4Addons';
import { Button, Typography } from '@itvara/ui';
import { useRouter } from 'next/navigation';

export default function CreateListingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    type: 'HOSTEL',
    latitude: 28.6139,
    longitude: 77.2090,
    address: '',
    pricePerNight: 1000,
    maxGuests: 1,
    bedCount: 1,
    amenities: [],
    customOptions: {
      hasCabRental: false,
      hasLocalAttire: false,
      hasFoodCuration: false,
      hasLocalGuide: false
    }
  });

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = async () => {
    try {
      // Dummy API call to the backend
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/listings/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `My ${formData.type} Listing`,
          description: 'A cozy place to stay.',
          ...formData
        })
      });

      if (res.ok) {
        alert('Listing created successfully!');
        router.push('/dashboard'); // or wherever appropriate
      } else {
        alert('Error creating listing');
      }
    } catch (err) {
      console.error(err);
      alert('Network error');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white min-h-screen">
      <Typography variant="h1" className="text-3xl font-bold mb-6 text-gray-800">
        Create a New Listing
      </Typography>
      
      {/* Progress Bar */}
      <div className="flex items-center mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= i ? 'bg-[#FF385C] text-white' : 'bg-gray-200 text-gray-600'}`}>
              {i}
            </div>
            {i < 4 && <div className={`flex-1 h-1 mx-2 ${step > i ? 'bg-[#FF385C]' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm min-h-[400px]">
        {step === 1 && <Step1PropertyType formData={formData} setFormData={setFormData} />}
        {step === 2 && <Step2Location formData={formData} setFormData={setFormData} />}
        {step === 3 && <Step3Details formData={formData} setFormData={setFormData} />}
        {step === 4 && <Step4Addons formData={formData} setFormData={setFormData} />}
      </div>

      <div className="flex justify-between mt-8">
        {step > 1 ? (
          <Button variant="outline" title="Back" onPress={prevStep} />
        ) : (
          <div /> // placeholder for spacing
        )}
        
        {step < 4 ? (
          <Button variant="primary" title="Next" onPress={nextStep} />
        ) : (
          <Button variant="primary" title="Create Listing" onPress={handleSubmit} />
        )}
      </div>
    </div>
  );
}
