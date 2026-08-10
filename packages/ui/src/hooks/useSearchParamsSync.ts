// Expo Router Implementation
import { useRouter, useLocalSearchParams } from 'expo-router';

export function useSearchParamsSync() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const updateParams = (newParams: Record<string, string | number | undefined>) => {
    const updated = { ...params };
    Object.keys(newParams).forEach(key => {
      if (newParams[key] === undefined || newParams[key] === '') {
        delete updated[key];
      } else {
        updated[key] = String(newParams[key]);
      }
    });

    // In Expo Router, setParams updates query parameters of the current route
    router.setParams(updated);
  };

  return { params, updateParams };
}
