import { useState } from 'react';
import Dashboard from './Dashboard';
import AddStickyPage from './AddStickyPage';
import ArchivePage from './ArchivePage';
import { OLDER_ADULT_NAME, CAREGIVER_NAME } from './userNames';

function Panel({ userType, userTypes, userName, mode, setMode }) {
    let content;
    if (mode === 'dashboard') {
        content = (
            <Dashboard
                userTypes={userTypes}
                userType={userType}
                userName={userName}
                onAdd={() => setMode('add')}
                onArchive={() => setMode('archive')}
            />
        );
    } else if (mode === 'add') {
        content = <AddStickyPage userType={userType} userName={userName} onBack={() => setMode('dashboard')} />;
    } else if (mode === 'archive') {
        content = <ArchivePage userType={userType} userName={userName} onBack={() => setMode('dashboard')} />;
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