import { useState, useCallback } from 'react';
import { SwitchRoleDTO } from '@itvara/types';

// In a real application, this might tie into a global context or Redux/Zustand store.
// For this architecture hook, we provide the state management and API caller.
export function useUserRole(initialRole: string = 'GUEST') {
  const [role, setRole] = useState<string>(initialRole);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const switchRole = useCallback(async (newRole: SwitchRoleDTO['role'], accessToken: string, apiUrl: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${apiUrl}/api/users/switch-role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to switch role');
      }

      setRole(newRole);
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { role, setRole, switchRole, isLoading, error };
}
