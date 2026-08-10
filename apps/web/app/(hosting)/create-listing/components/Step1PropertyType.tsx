import React from 'react';
import { Typography } from '@itvara/ui';

const PROPERTY_TYPES = [
  'MONASTERY', 'ASHRAM', 'HOSTEL', 'WORK_STUDIO', 'TENT', 'MANSION', 'LOCAL_ROOM'
];

export default function Step1PropertyType({ formData, setFormData }: any) {
  return (
    <div className="flex flex-col gap-4">
      <Typography variant="h2" className="text-xl font-bold">What type of place will guests have?</Typography>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        {PROPERTY_TYPES.map(type => (
          <button
            key={type}
            onClick={() => setFormData({ ...formData, type })}
            className={`p-4 rounded-xl border-2 text-left transition-all hover:border-gray-800 ${
              formData.type === type ? 'border-gray-900 bg-gray-50' : 'border-gray-200 bg-white'
            }`}
          >
            <div className="font-semibold mt-2">{type.replace('_', ' ')}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
