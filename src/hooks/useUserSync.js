import { useEffect } from 'react';
import { useUser } from '../context/UserContext';

export const useUserSync = () => {
  const { setUser } = useUser();

  useEffect(() => {
    const handleUserUpdate = () => {
      const savedUser = sessionStorage.getItem('userData');
      setUser(savedUser ? JSON.parse(savedUser).userData : null);
    };

    // Escuchar eventos personalizados de actualización
    window.addEventListener('userUpdated', handleUserUpdate);
    return () => window.removeEventListener('userUpdated', handleUserUpdate);
  }, [setUser]);
};