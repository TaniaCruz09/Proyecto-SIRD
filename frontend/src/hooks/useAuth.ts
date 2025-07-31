// src/hooks/useAuth.ts
import { useEffect, useState } from 'react';

export function useAuth() {
    const [token, setToken] = useState<string | null>(null);
    const [rol, setRol] = useState<string | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedRol = localStorage.getItem('rol');

        setToken(storedToken);
        setRol(storedRol);
    }, []);

    return { token, rol };
}
