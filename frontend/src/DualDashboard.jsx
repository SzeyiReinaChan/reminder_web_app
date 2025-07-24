import { useState } from 'react';
import Dashboard from './Dashboard';
import AddStickyPage from './AddStickyPage';
import ArchivePage from './ArchivePage';
import { OLDER_ADULT_NAME, CAREGIVER_NAME } from './userNames';

function Panel({ userType, userTypes, userName, mode, setMode }) {
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
        <div style={{ position: 'relative', height: 683, minHeight: 683, width: 512 }}>
            {content}
        </div>
    );
}

export default function DualDashboard() {
    const [leftMode, setLeftMode] = useState('dashboard');
    const [rightMode, setRightMode] = useState('dashboard');

    return (
        <div style={{ display: 'flex', gap: 100, justifyContent: 'center', alignItems: 'flex-start' }}>
            <Panel userType="older adult" userTypes={['older adult', 'caregiver']} userName={OLDER_ADULT_NAME} mode={leftMode} setMode={setLeftMode} />
            <Panel userType="caregiver" userTypes={['caregiver']} userName={CAREGIVER_NAME} mode={rightMode} setMode={setRightMode} />
        </div>
    );
} 