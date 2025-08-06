import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboardViewModel } from './DashboardViewModel';
import { updateTaskStatus, deleteTask } from './api';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const IPAD_WIDTH = 524;
const IPAD_HEIGHT = 695;
const STICKY_COLORS = {
    'older adult': {
        background: '#fff7d1',
        border: '#ffe066',
    },
    'caregiver': {
        background: '#d1f0fa',
        border: '#0dcaf0',
    },
};

// Sortable Sticky Component
function SortableSticky({ task, handleFinish, userType, currentUserType, onStatusUpdate }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    // Determine color based on whose screen we're viewing and the reminder context
    let color = STICKY_COLORS['older adult']; // Default fallback
    if (currentUserType === 'older adult') {
        // On older adult screen
        if (task.createdBy === 'older adult' && task.userType === 'older adult') {
            // My own reminders - yellow
            color = STICKY_COLORS['older adult'];
        } else if (task.createdBy === 'caregiver' && task.userType === 'older adult') {
            // Caregiver's reminders for me - blue
            color = STICKY_COLORS['caregiver'];
        }
    } else if (currentUserType === 'caregiver') {
        // On caregiver screen
        if (task.createdBy === 'caregiver' && task.userType === 'caregiver') {
            // My own reminders - blue
            color = STICKY_COLORS['caregiver'];
        } else if (task.createdBy === 'caregiver' && task.userType === 'older adult') {
            // My reminders for older adult - yellow
            color = STICKY_COLORS['older adult'];
        }
    }

    // Check if this is a caregiver-created reminder for older adult
    const isCaregiverReminderForOlderAdult = task.createdBy === 'caregiver' && task.userType === 'older adult';

    // Only show status on caregiver screen for their reminders to older adult
    const shouldShowStatus = currentUserType === 'caregiver' && isCaregiverReminderForOlderAdult;

    // Get status display
    const getStatusDisplay = () => {
        if (!shouldShowStatus) return null;

        const status = task.status || 'pending';
        const statusConfig = {
            'pending': { text: 'Pending', color: '#CC9A06', bgColor: '#fff3cd' },
            'accepted': { text: 'Accepted', color: '#198754', bgColor: '#d1e7dd' },
            'rejected': { text: 'Rejected', color: '#dc3545', bgColor: '#f8d7da' },
            'edited': { text: 'Edited', color: '#0d6efd', bgColor: '#cfe2ff' }
        };

        return statusConfig[status] || statusConfig['pending'];
    };

    // Handle remove rejected reminder
    const handleRemoveRejected = async (e) => {
        e.stopPropagation();
        e.preventDefault();
        try {
            await deleteTask(task.id);
            console.log('Rejected task removed:', task.id);
            // Immediately remove the task from local state for instant UI update
            onStatusUpdate(task.id, 'removed');
        } catch (error) {
            console.error('Failed to remove rejected task:', error);
        }
    };

    return (
        <div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            className="p-3 rounded shadow position-relative"
            style={{
                ...style,
                width: 190,
                height: 190,
                background: color.background,
                cursor: 'grab',
            }}
        >
            <div
                className="position-absolute"
                style={{
                    top: -10,
                    right: -8,
                    zIndex: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: 4,
                }}
            >
                {shouldShowStatus ? (
                    // Show status for caregiver-created reminders for older adult (only on caregiver screen)
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                        <span className="badge" style={{
                            fontSize: 10,
                            padding: '4px 8px',
                            borderRadius: '12px',
                            background: getStatusDisplay()?.bgColor || '#fff3cd',
                            color: getStatusDisplay()?.color || '#ffc107',
                            fontWeight: 'bold',
                            border: `1px solid ${getStatusDisplay()?.color || '#ffc107'}`,
                            minWidth: '60px',
                            textAlign: 'center'
                        }}>
                            {getStatusDisplay()?.text || 'Pending'}
                        </span>
                        {task.status === 'rejected' && (
                            <button
                                className="btn btn-danger btn-sm"
                                style={{
                                    fontWeight: 600,
                                    fontSize: 10,
                                    padding: '2px 6px',
                                    borderRadius: 50,
                                    cursor: 'pointer',
                                }}
                                onClick={handleRemoveRejected}
                                title="Remove rejected reminder"
                            >
                                Remove
                            </button>
                        )}
                    </div>
                ) : (
                    // Show checkmark for regular tasks
                    <span
                        className="badge"
                        style={{
                            fontSize: 16,
                            padding: '8px 12px',
                            borderRadius: '50%',
                            background: '#6c757d',
                            color: 'white',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            console.log('Finished button clicked for task:', task.id);
                            handleFinish(task);
                        }}
                        onMouseDown={(e) => {
                            e.stopPropagation();
                        }}
                        title="Mark as finished and archive"
                    >
                        ✓
                    </span>
                )}
            </div>
            <h5
                className="fw-bold"
                style={{
                    padding: '12px 0px',
                }}
            >
                {task.title}
            </h5>
            <div
                className="position-absolute"
                style={{
                    bottom: 12,
                    left: 12,
                    zIndex: 2,
                }}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <button
                        className="btn btn-light btn-sm"
                        style={{
                            background: '#fff',
                            color: '#222',
                            fontWeight: 600,
                            fontSize: 12,
                            padding: '3px 8px',
                            borderRadius: 50,
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                            const utterance = new SpeechSynthesisUtterance(task.title);
                            utterance.rate = 0.9; // Slightly slower for clarity
                            utterance.pitch = 1.0;
                            utterance.volume = 0.8;
                            speechSynthesis.speak(utterance);
                        }}
                    >
                        <span role="img" aria-label="audio">🔊</span> Play Audio
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function Dashboard({ userTypes, userType, userName, olderAdultName, onAdd, onArchive, onNewReminder }) {
    const {
        tasks,
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
    } = useDashboardViewModel(userTypes, userType, null, onNewReminder);

    const handleStatusUpdate = async (taskId, newStatus) => {
        try {
            if (newStatus === 'removed') {
                // Remove the task from local state immediately
                setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
            } else {
                await updateTaskStatus(taskId, newStatus);
                // Update the task in local state
                setTasks(prevTasks =>
                    prevTasks.map(task =>
                        task.id === taskId
                            ? { ...task, status: newStatus }
                            : task
                    )
                );
            }
        } catch (error) {
            console.error('Failed to update task status:', error);
        }
    };
    const now = new Date();

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setTasks((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);

                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    if (loading) return <div className="container mt-5">Loading...</div>;
    if (error) return <div className="container mt-5 text-danger">{error}</div>;

    console.log('Dashboard render:', { userType, tasks, completed, total });

    return (
        <div style={{
            width: IPAD_WIDTH,
            height: IPAD_HEIGHT,
            margin: '32px auto',
            background: '#f8f8f8',
            borderRadius: 16,
            boxShadow: '0 0 10px rgba(0,0,0,0.15)',
            overflow: 'hidden',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            border: '12px solid #222', // Add black border for iPad look
        }}>
            {/* Header Section */}
            <div className="px-4 pt-4 pb-2">
                <div className="d-flex align-items-center" style={{ gap: 16 }}>
                    <div
                        style={{
                            fontSize: 64,
                            fontWeight: 700,
                            lineHeight: 1,
                            letterSpacing: -2,
                            whiteSpace: 'nowrap',
                            minWidth: 180,
                        }}
                    >
                        {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div style={{ height: 60, borderLeft: '3px solid #222' }} />
                    <div className="d-flex flex-column align-items-start justify-content-center" style={{ minWidth: 160 }}>
                        <span style={{ fontSize: 28, fontWeight: 500, lineHeight: 1 }}>
                            {now.toLocaleDateString(undefined, { weekday: 'long' })}
                        </span>
                        <span style={{ fontSize: 24, fontWeight: 400 }}>
                            {now.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                    </div>
                </div>
                <div style={{ fontSize: 32, fontWeight: 600, lineHeight: 1.5, marginTop: '6px' }}>
                    {userType === 'caregiver' ? (
                        (() => {
                            const hour = now.getHours();
                            if (hour < 12) return `Good morning, ${userName}!`;
                            if (hour < 17) return `Good afternoon, ${userName}!`;
                            return `Good evening, ${userName}!`;
                        })()
                    ) : (
                        `Well done, ${userName}!`
                    )}
                </div>
                <div className="mt-2 mb-2" style={{ fontSize: 20, fontWeight: 500, lineHeight: 0 }}>
                    {userType === 'caregiver' ? (
                        <div>
                            <div>
                                <span style={{ color: '#222' }}> My tasks: </span>
                                <span style={{ color: '#1E9300', fontWeight: 700, fontSize: 30 }}>{caregiverOwnCompleted}</span>
                                <span style={{ color: '#222' }}> out of </span>
                                <span style={{ color: '#1E9300', fontWeight: 700 }}>{caregiverOwnTotal}</span>
                                <span style={{ color: '#222' }}> • </span>
                                <span style={{ color: '#222' }}> {olderAdultName || 'Older Adult'}'s tasks: </span>
                                <span style={{ color: '#1E9300', fontWeight: 700, fontSize: 30 }}>{caregiverOlderAdultCompleted}</span>
                                <span style={{ color: '#222' }}> out of </span>
                                <span style={{ color: '#1E9300', fontWeight: 700 }}>{caregiverOlderAdultTotal}</span>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <span style={{ color: '#1E9300', fontWeight: 700, fontSize: 30 }}>{completed}</span>
                            <span style={{ color: '#222' }}> out of </span>
                            <span style={{ color: '#1E9300', fontWeight: 700 }}>{total}</span>
                            <span style={{ color: '#222' }}>{` of today's tasks completed!`}</span>
                        </div>
                    )}
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
                    <button
                        className="btn fw-bold d-flex align-items-center justify-content-center"
                        style={{
                            background: '#1E9300',
                            color: '#fff',
                            fontSize: 14,
                            borderRadius: 8,
                            padding: '2px 8px',
                            marginBottom: 0,
                            minHeight: 28
                        }}
                        onClick={() => onArchive(handleUndoneTask)}
                    >
                        View Finished <span className="ms-2" style={{ fontSize: 14, lineHeight: 1 }}>&rarr;</span>
                    </button>

                    {userType === 'older adult' && onNewReminder && (
                        <button
                            className="btn fw-bold d-flex align-items-center justify-content-center"
                            style={{
                                background: '#007bff',
                                color: '#fff',
                                fontSize: 12,
                                borderRadius: 8,
                                padding: '2px 8px',
                                marginBottom: 0,
                                minHeight: 28
                            }}
                            onClick={() => onNewReminder('Test reminder from caregiver', 'test-id')}
                        >
                            Test Popup
                        </button>
                    )}
                </div>
            </div>
            {/* End Header Section */}
            <div
                style={{
                    flex: 1,
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                    overflow: 'hidden',
                    paddingLeft: 24,
                }}
            >
                <div
                    className="sticky-scroll"
                    style={{
                        width: 490,
                        paddingTop: 15,
                        maxHeight: 460,
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        paddingLeft: 20,
                        paddingBottom: 15,
                    }}
                >
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={tasks.map(task => task.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(2, 1fr)',
                                gap: '36px 2px',
                                width: '100%',
                            }}>
                                {tasks.map((task) => (
                                    <SortableSticky
                                        key={task.id}
                                        task={task}
                                        handleFinish={handleFinish}
                                        userType={task.userType}
                                        currentUserType={userType}
                                        onStatusUpdate={handleStatusUpdate}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                </div>
            </div>
            <div style={{ position: 'absolute', bottom: -8, right: 20, zIndex: 1000 }}>
                <button className="btn btn-warning fw-bold shadow" onClick={onAdd}>
                    + Add New Stickies
                </button>
            </div>
        </div>
    );
} 