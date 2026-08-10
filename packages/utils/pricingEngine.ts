export interface PricingParams {
  basePricePerNight: number;
  nights: number;
  addons: {
    cabRental: boolean;
    culturalAttire: boolean;
    foodCuration: boolean;
    localGuide: boolean;
  };
}

export interface PricingResult {
  baseTotal: number;
  addonCab: number;
  addonAttire: number;
  addonFood: number;
  addonGuide: number;
  addonsTotal: number;
  subtotal: number;
  serviceFee: number;
  taxes: number;
  grandTotal: number;
}

export const ADDON_RATES = {
  cabRentalDaily: 1500,
  localGuideDaily: 1000,
  foodCurationDaily: 800,
  culturalAttireFlat: 500,
};

export const calculateTripQuote = (params: PricingParams): PricingResult => {
  const { basePricePerNight, nights, addons } = params;

  // Ensure minimum 1 night for calculations
  const effectiveNights = Math.max(1, nights);

  const baseTotal = basePricePerNight * effectiveNights;

  const addonCab = addons.cabRental ? ADDON_RATES.cabRentalDaily * effectiveNights : 0;
  const addonGuide = addons.localGuide ? ADDON_RATES.localGuideDaily * effectiveNights : 0;
  const addonFood = addons.foodCuration ? ADDON_RATES.foodCurationDaily * effectiveNights : 0;
  const addonAttire = addons.culturalAttire ? ADDON_RATES.culturalAttireFlat : 0; // Flat fee

  const addonsTotal = addonCab + addonGuide + addonFood + addonAttire;
  const subtotal = baseTotal + addonsTotal;

  // 10% Service Fee on base total
  const serviceFee = Math.round(baseTotal * 0.10);
  
  // 12% Local Tax on subtotal
  const taxes = Math.round(subtotal * 0.12);

  const grandTotal = subtotal + serviceFee + taxes;

  return {
    baseTotal,
    addonCab,
    addonAttire,
    addonFood,
    addonGuide,
    addonsTotal,
    subtotal,
    serviceFee,
    taxes,
    grandTotal,
  };
};
