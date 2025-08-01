import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboardViewModel } from './DashboardViewModel';
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
function SortableSticky({ task, handleFinish, userType, currentUserType }) {
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
                    top: -18,
                    right: -8,
                    zIndex: 10,
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
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
                <span className="badge bg-dark" style={{ fontSize: 14, padding: '8px 12px', borderRadius: 12 }}>
                    Finished?
                </span>
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
                <button
                    className="btn btn-light btn-sm"
                    style={{
                        background: '#fff',
                        color: '#222',
                        fontWeight: 600,
                        fontSize: 12,
                        padding: '3px 8px',
                        borderRadius: 50,
                        marginBottom: 8,
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
    );
}

export default function Dashboard({ userTypes, userType, userName, onAdd, onArchive }) {
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
    } = useDashboardViewModel(userTypes, userType);
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
                            {now.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>
                    </div>
                </div>
                <div className="mt-3" style={{ fontSize: 32, fontWeight: 600, lineHeight: 1.3 }}>
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
                <div className="mt-2 mb-2" style={{ fontSize: 20, fontWeight: 500, lineHeight: userType === 'caregiver' ? 0.5 : 0 }}>
                    {userType === 'caregiver' ? (
                        <div>
                            <div>
                                <span style={{ color: '#1E9300', fontWeight: 700, fontSize: 30 }}>{caregiverOwnCompleted}</span>
                                <span style={{ color: '#222' }}> out of </span>
                                <span style={{ color: '#1E9300', fontWeight: 700 }}>{caregiverOwnTotal}</span>
                                <span style={{ color: '#222' }}> of my tasks completed!</span>
                            </div>
                            <div style={{ marginTop: '8px' }}>
                                <span style={{ color: '#1E9300', fontWeight: 700, fontSize: 30 }}>{caregiverOlderAdultCompleted}</span>
                                <span style={{ color: '#222' }}> out of </span>
                                <span style={{ color: '#1E9300', fontWeight: 700 }}>{caregiverOlderAdultTotal}</span>
                                <span style={{ color: '#222' }}> of Angela's tasks completed!</span>
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
                <button
                    className="btn fw-bold d-flex align-items-center justify-content-center"
                    style={{
                        background: '#1E9300',
                        color: '#fff',
                        fontSize: 14,
                        borderRadius: 8,
                        padding: '2px 8px',
                        marginTop: 20,
                        marginBottom: 0,
                        minHeight: 28
                    }}
                    onClick={() => onArchive(handleUndoneTask)}
                >
                    View Finished <span className="ms-2" style={{ fontSize: 14, lineHeight: 1 }}>&rarr;</span>
                </button>
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
                        paddingTop: 24,
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
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                </div>
            </div>
            <div style={{ position: 'absolute', bottom: -3, right: 20, zIndex: 1000 }}>
                <button className="btn btn-warning fw-bold shadow" onClick={onAdd}>
                    + Add New Stickies
                </button>
            </div>
        </div>
    );
} 