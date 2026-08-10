import React from 'react';
import { Typography, TextInput } from '@itvara/ui';

export default function Step3Details({ formData, setFormData }: any) {
  const increment = (field: string) => setFormData({ ...formData, [field]: formData[field] + 1 });
  const decrement = (field: string) => setFormData({ ...formData, [field]: Math.max(1, formData[field] - 1) });

  return (
    <div className="flex flex-col gap-6">
      <Typography variant="h2" className="text-xl font-bold">Share some basics about your place</Typography>
      
      <div className="flex justify-between items-center border-b border-gray-200 pb-4">
        <Typography variant="h2" className="text-lg">Max Guests</Typography>
        <div className="flex items-center gap-4">
          <button onClick={() => decrement('maxGuests')} className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center">-</button>
          <span className="w-4 text-center">{formData.maxGuests}</span>
          <button onClick={() => increment('maxGuests')} className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center">+</button>
        </div>
      </div>

      <div className="flex justify-between items-center border-b border-gray-200 pb-4">
        <Typography variant="h2" className="text-lg">Beds</Typography>
        <div className="flex items-center gap-4">
          <button onClick={() => decrement('bedCount')} className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center">-</button>
          <span className="w-4 text-center">{formData.bedCount}</span>
          <button onClick={() => increment('bedCount')} className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center">+</button>
        </div>
      </div>

      <div className="flex flex-col gap-2 border-b border-gray-200 pb-4">
        <Typography variant="h2" className="text-lg">Base Price per night (INR)</Typography>
        <TextInput 
          value={formData.pricePerNight.toString()}
          onChangeText={(val) => setFormData({ ...formData, pricePerNight: parseInt(val) || 0 })}
          keyboardType="numeric"
          label="Price"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Typography variant="h2" className="text-lg">Amenities</Typography>
        {/* Simple checkboxes placeholder */}
        <div className="grid grid-cols-2 gap-4">
          {['Wifi', 'Kitchen', 'Free parking', 'Washer'].map(amenity => (
            <label key={amenity} className="flex items-center gap-2">
              <input 
                type="checkbox" 
                checked={formData.amenities.includes(amenity)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFormData({ ...formData, amenities: [...formData.amenities, amenity] });
                  } else {
                    setFormData({ ...formData, amenities: formData.amenities.filter((a: string) => a !== amenity) });
                  }
                }}
                className="w-5 h-5 accent-[#FF385C]" 
              />
              {amenity}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
