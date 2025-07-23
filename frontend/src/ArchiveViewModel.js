import { useEffect, useState } from 'react';
import { getArchive } from './api';

export function useArchiveViewModel(userType) {
    const [archive, setArchive] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getArchive()
            .then(data => setArchive(data.filter(t => t.userType === userType)))
            .catch(() => setError('Failed to fetch archive'))
            .finally(() => setLoading(false));
    }, [userType]);

    return {
        archive,
        loading,
        error,
    };
} 