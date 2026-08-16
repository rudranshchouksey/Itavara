"use client";

import React, { useState, useEffect } from 'react';

// Mock data types to simulate the API response
interface InvoiceData {
  corporateAccount: string;
  billingEmail: string;
  gstin: string;
  period: string;
  breakdown: {
    subtotal: number;
    gstRate: string;
    gstAmount: number;
    totalAmount: number;
  };
  bookings: any[];
}

export default function CorporateAdminDashboard() {
  const [activeTab, setActiveTab] = useState<'TEAM' | 'POLICY' | 'INVOICE'>('TEAM');
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // In a real implementation, this would fetch from /api/corporate/invoices
  const fetchInvoice = () => {
    setIsLoading(true);
    setTimeout(() => {
      setInvoice({
        corporateAccount: 'TechCorp India Pvt. Ltd.',
        billingEmail: 'accounts@techcorp.in',
        gstin: '27AADCB2230M1Z2',
        period: 'August 2026',
        breakdown: {
          subtotal: 45000,
          gstRate: '18%',
          gstAmount: 8100,
          totalAmount: 53100
        },
        bookings: [
          { id: '1', user: { name: 'Alice Smith' }, listing: { title: 'Bangalore Tech Hub Studio', type: 'WORK_STUDIO' }, totalPrice: 15000, checkIn: '2026-08-01', checkOut: '2026-08-05' },
          { id: '2', user: { name: 'Bob Jones' }, listing: { title: 'Pune Executive Suite', type: 'LOCAL_ROOM' }, totalPrice: 30000, checkIn: '2026-08-10', checkOut: '2026-08-20' }
        ]
      });
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    if (activeTab === 'INVOICE' && !invoice) {
      fetchInvoice();
    }
  }, [activeTab, invoice]);

  return (
    <div className="min-h-screen bg-[#F7F7F7] pb-12">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#FF385C] rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">I</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#222222]">Itvara for Work</h1>
              <p className="text-xs text-gray-500">TechCorp India Pvt. Ltd.</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-gray-500 hover:text-[#FF385C] font-semibold text-sm">Help</button>
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-600 font-bold text-sm">A</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Navigation Tabs */}
        <div className="flex space-x-8 border-b border-gray-200 mb-8">
          {['TEAM', 'POLICY', 'INVOICE'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`pb-4 text-sm font-semibold transition-colors relative ${
                activeTab === tab ? 'text-[#FF385C]' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {tab === 'TEAM' && 'Team Management'}
              {tab === 'POLICY' && 'Booking Policy'}
              {tab === 'INVOICE' && 'Billing & Invoices'}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF385C]" />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        
        {activeTab === 'TEAM' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#222222]">Employee Seats</h2>
              <button className="bg-[#222222] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-black transition-colors">
                + Invite Employee
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-500 text-sm">
                    <th className="py-3 font-medium">Name</th>
                    <th className="py-3 font-medium">Role</th>
                    <th className="py-3 font-medium">Spend Limit / Trip</th>
                    <th className="py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="text-[#222222] text-sm">
                  <tr className="border-b border-gray-50">
                    <td className="py-4 font-semibold">Alice Smith<br/><span className="text-xs text-gray-500 font-normal">alice@techcorp.in</span></td>
                    <td className="py-4"><span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-md text-xs font-semibold">ADMIN</span></td>
                    <td className="py-4">No Limit</td>
                    <td className="py-4"><span className="text-green-600 font-semibold">• Active</span></td>
                  </tr>
                  <tr className="border-b border-gray-50">
                    <td className="py-4 font-semibold">Bob Jones<br/><span className="text-xs text-gray-500 font-normal">bob@techcorp.in</span></td>
                    <td className="py-4"><span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs font-semibold">EMPLOYEE</span></td>
                    <td className="py-4">₹15,000</td>
                    <td className="py-4"><span className="text-green-600 font-semibold">• Active</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'POLICY' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-[#222222] mb-2">Budget Policy</h2>
              <p className="text-sm text-gray-500 mb-6">Set the maximum nightly rate allowed for employee bookings.</p>
              
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Max Nightly Rate (₹)</label>
                <input 
                  type="number" 
                  defaultValue={8000} 
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#FF385C]/20 focus:border-[#FF385C]"
                />
              </div>
              <button className="bg-[#FF385C] text-white px-4 py-2 rounded-lg text-sm font-semibold w-full">Save Budget Limit</button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-[#222222] mb-2">Allowed Stay Types</h2>
              <p className="text-sm text-gray-500 mb-6">Select the types of properties employees are permitted to book.</p>
              
              <div className="space-y-3">
                {['WORK_STUDIO', 'LOCAL_ROOM', 'HOSTEL', 'MANSION', 'TENT', 'ASHRAM'].map(type => (
                  <label key={type} className="flex items-center space-x-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      defaultChecked={['WORK_STUDIO', 'LOCAL_ROOM'].includes(type)}
                      className="w-5 h-5 rounded border-gray-300 text-[#FF385C] focus:ring-[#FF385C]"
                    />
                    <span className="text-sm font-medium text-[#222222]">{type.replace('_', ' ')}</span>
                  </label>
                ))}
              </div>
              <button className="bg-[#FF385C] text-white px-4 py-2 rounded-lg text-sm font-semibold w-full mt-6">Update Allowed Types</button>
            </div>
          </div>
        )}

        {activeTab === 'INVOICE' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
              <div>
                <h2 className="text-xl font-bold text-[#222222]">Monthly Tax Invoice</h2>
                <p className="text-sm text-gray-500">Period: {invoice?.period || 'Loading...'}</p>
              </div>
              <button disabled={isLoading} className="border border-[#222222] text-[#222222] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50">
                Download PDF
              </button>
            </div>

            {isLoading ? (
              <div className="py-20 flex justify-center">
                <div className="w-8 h-8 border-4 border-[#FF385C] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : invoice ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Bookings List */}
                <div className="lg:col-span-2">
                  <h3 className="text-lg font-bold text-[#222222] mb-4">Itemized Bookings</h3>
                  <div className="space-y-4">
                    {invoice.bookings.map((booking, idx) => (
                      <div key={idx} className="flex justify-between items-center p-4 border border-gray-100 rounded-xl bg-gray-50/50">
                        <div>
                          <p className="font-semibold text-[#222222]">{booking.listing.title}</p>
                          <p className="text-xs text-gray-500">{booking.user.name} • {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}</p>
                        </div>
                        <p className="font-bold text-[#222222]">₹{booking.totalPrice.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tax Breakdown */}
                <div>
                  <h3 className="text-lg font-bold text-[#222222] mb-4">Summary</h3>
                  <div className="bg-[#F7F7F7] p-5 rounded-xl border border-gray-200">
                    <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Subtotal</span>
                        <span className="font-medium text-[#222222]">₹{invoice.breakdown.subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>GST ({invoice.breakdown.gstRate})</span>
                        <span className="font-medium text-[#222222]">₹{invoice.breakdown.gstAmount.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-[#222222]">Total Due</span>
                      <span className="text-2xl font-bold text-[#FF385C]">₹{invoice.breakdown.totalAmount.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-4 text-center">Billed to: {invoice.gstin}</p>
                  </div>
                  
                  <button className="w-full bg-[#FF385C] text-white py-3 rounded-xl font-bold mt-4 shadow-sm hover:bg-[#E31C5F] transition-colors">
                    Pay Now
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        )}

      </main>
    </div>
  );
}
