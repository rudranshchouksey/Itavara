// Next.js (Web) Implementation
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

export function useSearchParamsSync() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Convert readonly URLSearchParams to a plain object
  const params: Record<string, string> = {};
  if (searchParams) {
    searchParams.forEach((value: string, key: string) => {
      params[key] = value;
    });
  }

  const updateParams = (newParams: Record<string, string | number | undefined>) => {
    if (!searchParams) return;
    
    const urlParams = new URLSearchParams(searchParams.toString());
    
    Object.keys(newParams).forEach(key => {
      if (newParams[key] === undefined || newParams[key] === '') {
        urlParams.delete(key);
      } else {
        urlParams.set(key, String(newParams[key]));
      }
    });

    router.push(`${pathname}?${urlParams.toString()}`, { scroll: false });
  };

  return { params, updateParams };
}
