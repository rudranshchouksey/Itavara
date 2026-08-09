export function formatCurrency(amount: number, currencyCode: 'INR' | 'USD' | string): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currencyCode,
    maximumFractionDigits: 0,
  }).format(amount);
}
