import { useEffect, useState } from 'react';
import { getArchive, unarchiveTask } from './api';

export function useArchiveViewModel(userTypes, onUndo = null) {
    const [archive, setArchive] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getArchive()
            .then(data => {
                const types = Array.isArray(userTypes) ? userTypes : [userTypes];
                setArchive(data.filter(t => types.includes(t.userType)));
            })
            .catch(() => setError('Failed to fetch archive'))
            .finally(() => setLoading(false));
    }, [userTypes]);

    const handleUndo = async (task) => {
        // Optimistic UI update - remove from archive
        setArchive(prev => prev.filter(t => t.id !== task.id));

        // Notify parent component about the undone task
        if (onUndo) {
            onUndo({ ...task, finished: false });
        }

        try {
            // Move the task from archive back to tasks
            await unarchiveTask(task.id);
        } catch (error) {
            setError('Failed to undo task');
            // Revert optimistic update
            setArchive(prev => [...prev, task]);
        }
    };

    return {
        archive,
        loading,
        error,
        handleUndo,
    };
} 