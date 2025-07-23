import { useEffect, useState, useCallback } from 'react';
import { getTasks, getArchive, updateTask, archiveTask } from './api';

export function useDashboardViewModel(userTypes) {
    const [tasks, setTasks] = useState([]);
    const [archive, setArchive] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(() => {
        const types = Array.isArray(userTypes) ? userTypes : [userTypes];
        setLoading(true);
        Promise.all([getTasks(), getArchive()])
            .then(([tasksData, archiveData]) => {
                setTasks(tasksData.filter(t => types.includes(t.userType)));
                setArchive(archiveData.filter(t => types.includes(t.userType)));
            })
            .catch(() => setError('Failed to fetch tasks'))
            .finally(() => setLoading(false));
    }, [userTypes]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleFinish = async (task) => {
        // Optimistic UI update
        setTasks(prev => prev.filter(t => t.id !== task.id));
        setArchive(prev => [...prev, { ...task, finished: true }]);
        try {
            await updateTask(task.id, { finished: true });
            await archiveTask(task.id);
            // Optionally, refetch to ensure consistency
            // fetchData();
        } catch {
            setError('Failed to archive task');
            // Revert optimistic update
            setTasks(prev => [...prev, task]);
            setArchive(prev => prev.filter(t => t.id !== task.id));
        }
    };

    const completed = tasks.filter(t => t.finished).length + archive.filter(t => t.finished).length;
    const total = tasks.length + archive.length;

    return {
        tasks,
        archive,
        loading,
        error,
        handleFinish,
        completed,
        total,
    };
} 