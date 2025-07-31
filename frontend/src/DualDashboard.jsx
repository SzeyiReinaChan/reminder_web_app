import { useState } from 'react';
import Dashboard from './Dashboard';
import AddStickyPage from './AddStickyPage';
import ArchivePage from './ArchivePage';
import { OLDER_ADULT_NAME, CAREGIVER_NAME } from './userNames';

function Panel({ userType, userTypes, userName, mode, setMode, label }) {
    const [handleUndoneTask, setHandleUndoneTask] = useState(null);

    let content;
    if (mode === 'dashboard') {
        content = (
            <Dashboard
                userTypes={userTypes}
                userType={userType}
                userName={userName}
                onAdd={() => setMode('add')}
                onArchive={(handleUndoneTaskFn) => {
                    setHandleUndoneTask(() => handleUndoneTaskFn);
                    setMode('archive');
                }}
            />
        );
    } else if (mode === 'add') {
        content = <AddStickyPage userType={userType} userName={userName} onBack={() => setMode('dashboard')} />;
    } else if (mode === 'archive') {
        // For older adult, show both older adult and caregiver finished tasks
        const archiveUserTypes = userType === 'older adult' ? ['older adult', 'caregiver'] : ['caregiver'];
        content = <ArchivePage userType={userType} userTypes={archiveUserTypes} userName={userName} onBack={() => setMode('dashboard')} onUndo={handleUndoneTask} />;
    }
    return (
        <div style={{ position: 'relative', height: 683, minHeight: 780, width: 512 }}>
            <div style={{
                position: 'absolute',
                width: '100%',
                fontWeight: 700,
                fontSize: 22,
                textAlign: 'center',
                color: '#222',
                pointerEvents: 'none',
            }}>{label}</div>
            {content}
        </div>
    );
}

export default function DualDashboard() {
    const [leftMode, setLeftMode] = useState('dashboard');
    const [rightMode, setRightMode] = useState('dashboard');
    const [showOlderAdult, setShowOlderAdult] = useState(true);
    const [showCaregiver, setShowCaregiver] = useState(true);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
            {/* Switch Controls */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 40,
                padding: '16px 24px',
                background: '#f8f9fa',
                borderRadius: '12px',
                border: '2px solid #dee2e6',
                marginBottom: 20,
            }}>
                {/* Older Adult Switch */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 16, fontWeight: 600, color: '#495057' }}>
                        Older Adult Screen
                    </span>
                    <div
                        onClick={() => setShowOlderAdult(!showOlderAdult)}
                        style={{
                            width: 60,
                            height: 32,
                            background: showOlderAdult ? '#28a745' : '#6c757d',
                            borderRadius: 16,
                            position: 'relative',
                            cursor: 'pointer',
                            transition: 'background-color 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '2px',
                        }}
                    >
                        <div
                            style={{
                                width: 28,
                                height: 28,
                                background: 'white',
                                borderRadius: '50%',
                                transform: showOlderAdult ? 'translateX(28px)' : 'translateX(0)',
                                transition: 'transform 0.3s ease',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                            }}
                        />
                    </div>
                    <span style={{ fontSize: 14, color: '#6c757d' }}>
                        {showOlderAdult ? 'ON' : 'OFF'}
                    </span>
                </div>

                {/* Caregiver Switch */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 16, fontWeight: 600, color: '#495057' }}>
                        Caregiver Screen
                    </span>
                    <div
                        onClick={() => setShowCaregiver(!showCaregiver)}
                        style={{
                            width: 60,
                            height: 32,
                            background: showCaregiver ? '#28a745' : '#6c757d',
                            borderRadius: 16,
                            position: 'relative',
                            cursor: 'pointer',
                            transition: 'background-color 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '2px',
                        }}
                    >
                        <div
                            style={{
                                width: 28,
                                height: 28,
                                background: 'white',
                                borderRadius: '50%',
                                transform: showCaregiver ? 'translateX(28px)' : 'translateX(0)',
                                transition: 'transform 0.3s ease',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                            }}
                        />
                    </div>
                    <span style={{ fontSize: 14, color: '#6c757d' }}>
                        {showCaregiver ? 'ON' : 'OFF'}
                    </span>
                </div>
            </div>

            {/* Panels */}
            <div style={{ display: 'flex', gap: 100, justifyContent: 'center', alignItems: 'flex-start' }}>
                {showOlderAdult && (
                    <Panel label="Older Adult Screen" userType="older adult" userTypes={['older adult', 'caregiver']} userName={OLDER_ADULT_NAME} mode={leftMode} setMode={setLeftMode} />
                )}
                {showCaregiver && (
                    <Panel label="Caregiver Screen" userType="caregiver" userTypes={['caregiver', 'older adult']} userName={CAREGIVER_NAME} mode={rightMode} setMode={setRightMode} />
                )}
            </div>
        </div>
    );
} 