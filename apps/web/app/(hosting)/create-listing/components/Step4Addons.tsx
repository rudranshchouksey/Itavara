import React from 'react';
import { Typography } from '@itvara/ui';

export default function Step4Addons({ formData, setFormData }: any) {
  const toggleOption = (key: string) => {
    setFormData({
      ...formData,
      customOptions: {
        ...formData.customOptions,
        [key]: !formData.customOptions[key]
      }
    });
  };

  const ADDONS = [
    { key: 'hasCabRental', label: 'Cab Rentals', description: 'Offer local transportation for your guests.' },
    { key: 'hasLocalAttire', label: 'Local Cultural Attire', description: 'Provide traditional clothing during their stay.' },
    { key: 'hasFoodCuration', label: 'Food Curation', description: 'Offer curated local meals.' },
    { key: 'hasLocalGuide', label: 'Local Guide Availability', description: 'Provide a local guide for tours.' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <Typography variant="h2" className="text-xl font-bold">Custom Trip Addon Configurator</Typography>
      <Typography variant="body" className="text-gray-500">
        Stand out by offering exclusive local experiences directly with your listing.
      </Typography>

      <div className="flex flex-col gap-4 mt-4">
        {ADDONS.map(addon => (
          <div key={addon.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
            <div>
              <Typography variant="h2" className="text-lg font-semibold">{addon.label}</Typography>
              <Typography variant="body" className="text-sm text-gray-500">{addon.description}</Typography>
            </div>
            {/* Toggle Switch */}
            <button 
              className={`w-12 h-6 rounded-full relative transition-colors ${formData.customOptions[addon.key] ? 'bg-[#FF385C]' : 'bg-gray-300'}`}
              onClick={() => toggleOption(addon.key)}
            >
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${formData.customOptions[addon.key] ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
