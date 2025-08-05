import { useEffect, useState, useCallback } from 'react';
import { getTasks, getArchive, updateTask, archiveTask } from './api';

export function useDashboardViewModel(userTypes, currentUserType = null, onUndo = null, onNewReminder = null) {
    const [tasks, setTasks] = useState([]);
    const [archive, setArchive] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(() => {
        const types = Array.isArray(userTypes) ? userTypes : [userTypes];
        setLoading(true);
        Promise.all([getTasks(), getArchive()])
            .then(([tasksData, archiveData]) => {
                let filteredTasks = tasksData.filter(t => types.includes(t.userType));
                let filteredArchive = archiveData.filter(t => types.includes(t.userType));

                // Special filtering based on who created the reminder
                if (currentUserType === 'caregiver') {
                    // Caregiver screen: show only reminders created by caregiver
                    filteredTasks = filteredTasks.filter(t => t.createdBy === 'caregiver' || (!t.createdBy && t.userType === 'caregiver'));
                    filteredArchive = filteredArchive.filter(t => t.createdBy === 'caregiver' || (!t.createdBy && t.userType === 'caregiver'));
                } else if (currentUserType === 'older adult') {
                    // Older adult screen: show older adult's own reminders + caregiver's accepted/pending reminders for older adult
                    filteredTasks = filteredTasks.filter(t =>
                        t.createdBy === 'older adult' ||
                        (t.createdBy === 'caregiver' && t.userType === 'older adult' && t.status !== 'rejected') ||
                        (!t.createdBy && (t.userType === 'older adult' || t.userType === 'caregiver'))
                    );
                    filteredArchive = filteredArchive.filter(t =>
                        t.createdBy === 'older adult' ||
                        (t.createdBy === 'caregiver' && t.userType === 'older adult' && t.status !== 'rejected') ||
                        (!t.createdBy && (t.userType === 'older adult' || t.userType === 'caregiver'))
                    );
                }

                setTasks(filteredTasks);
                setArchive(filteredArchive);

                // Check for new caregiver reminders for older adult (only on older adult screen)
                if (currentUserType === 'older adult' && onNewReminder) {
                    const newCaregiverReminders = filteredTasks.filter(task =>
                        task.createdBy === 'caregiver' &&
                        task.userType === 'older adult' &&
                        (!task.status || task.status === 'pending')
                    );

                    // Check if any of these reminders were created recently (within 60 seconds)
                    const now = new Date();
                    const recentReminders = newCaregiverReminders.filter(task => {
                        const taskCreated = new Date(task.createdAt);
                        const timeDiff = (now - taskCreated) / 1000; // seconds
                        return timeDiff <= 60; // Within 60 seconds
                    });

                    if (recentReminders.length > 0) {
                        // Show popup for the most recent reminder
                        const mostRecent = recentReminders.sort((a, b) =>
                            new Date(b.createdAt) - new Date(a.createdAt)
                        )[0];

                        console.log('New caregiver reminder detected:', mostRecent);
                        onNewReminder(mostRecent.title, mostRecent.id);
                    }
                }
            })
            .catch(() => setError('Failed to fetch tasks'))
            .finally(() => setLoading(false));
    }, [userTypes, currentUserType]);

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

    const handleUndoneTask = useCallback((task) => {
        // Add the undone task back to active tasks
        setTasks(prev => [...prev, task]);
        // Remove from archive if it's there
        setArchive(prev => prev.filter(t => t.id !== task.id));
    }, []);

    const completed = tasks.filter(t => t.finished).length + archive.filter(t => t.finished).length;
    const total = tasks.length + archive.length;

    // For caregiver screen, calculate separate counts
    const caregiverOwnTasks = tasks.filter(t => t.createdBy === 'caregiver' && t.userType === 'caregiver');
    const caregiverOwnCompleted = caregiverOwnTasks.filter(t => t.finished).length +
        archive.filter(t => t.createdBy === 'caregiver' && t.userType === 'caregiver' && t.finished).length;
    const caregiverOwnTotal = caregiverOwnTasks.length +
        archive.filter(t => t.createdBy === 'caregiver' && t.userType === 'caregiver').length;

    const caregiverOlderAdultTasks = tasks.filter(t => t.createdBy === 'caregiver' && t.userType === 'older adult');
    const caregiverOlderAdultCompleted = caregiverOlderAdultTasks.filter(t => t.finished).length +
        archive.filter(t => t.createdBy === 'caregiver' && t.userType === 'older adult' && t.finished).length;
    const caregiverOlderAdultTotal = caregiverOlderAdultTasks.length +
        archive.filter(t => t.createdBy === 'caregiver' && t.userType === 'older adult').length;

    return {
        tasks,
        archive,
        loading,
        error,
        handleFinish,
        handleUndoneTask,
        completed,
        total,
        caregiverOwnCompleted,
        caregiverOwnTotal,
        caregiverOlderAdultCompleted,
        caregiverOlderAdultTotal,
        setTasks,
    };
} 