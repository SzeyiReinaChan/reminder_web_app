import { useEffect, useState } from 'react';
import { getTasks, getArchive, updateTask, archiveTask } from './api';

export function useDashboardViewModel(userType) {
    const [tasks, setTasks] = useState([]);
    const [archive, setArchive] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        Promise.all([getTasks(), getArchive()])
            .then(([tasksData, archiveData]) => {
                setTasks(tasksData.filter(t => t.userType === userType));
                setArchive(archiveData.filter(t => t.userType === userType));
            })
            .catch(() => setError('Failed to fetch tasks'))
            .finally(() => setLoading(false));
    }, [userType]);

    const handleFinish = async (task) => {
        try {
            await updateTask(task.id, { finished: true });
            await archiveTask(task.id);
            setTasks(tasks => tasks.filter(t => t.id !== task.id));
            setArchive(archive => [...archive, { ...task, finished: true }]);
        } catch {
            setError('Failed to archive task');
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