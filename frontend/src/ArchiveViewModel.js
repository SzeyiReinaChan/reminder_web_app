import { useEffect, useState } from 'react';
import { getArchive } from './api';

export function useArchiveViewModel() {
    const [archive, setArchive] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getArchive()
            .then(setArchive)
            .catch(() => setError('Failed to fetch archive'))
            .finally(() => setLoading(false));
    }, []);

    return {
        archive,
        loading,
        error,
    };
} 