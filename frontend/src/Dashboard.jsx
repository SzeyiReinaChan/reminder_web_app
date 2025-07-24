import { useNavigate } from 'react-router-dom';
import { useDashboardViewModel } from './DashboardViewModel';

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

export default function Dashboard({ userTypes, userType, userName, onAdd, onArchive }) {
    const {
        tasks,
        loading,
        error,
        handleFinish,
        handleUndoneTask,
        completed,
        total,
    } = useDashboardViewModel(userTypes);
    const now = new Date();

    if (loading) return <div className="container mt-5">Loading...</div>;
    if (error) return <div className="container mt-5 text-danger">{error}</div>;

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
                    Well done, {userName}!
                </div>
                <div className="mt-2 mb-2" style={{ fontSize: 20, fontWeight: 500, lineHeight: 0 }}>
                    <span style={{ color: '#1E9300', fontWeight: 700, fontSize: 30 }}>{completed}</span>
                    <span style={{ color: '#222' }}> out of </span>
                    <span style={{ color: '#1E9300', fontWeight: 700 }}>{total}</span>
                    <span style={{ color: '#222' }}>{` of today's tasks completed!`}</span>
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
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '36px 4px',
                        width: 490,
                        paddingTop: 24,
                        maxHeight: 460,
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        paddingLeft: 20,
                        paddingBottom: 15,
                    }}
                >
                    {tasks.map((task) => {
                        const color = STICKY_COLORS[task.userType] || STICKY_COLORS['older adult'];
                        return (
                            <div
                                key={task.id}
                                className="p-3 rounded shadow position-relative"
                                style={{
                                    width: 190,
                                    height: 190,
                                    background: color.background,
                                }}
                            >
                                <div
                                    className="position-absolute"
                                    style={{
                                        top: -18,
                                        right: -8,
                                        zIndex: 2,
                                        display: 'flex',
                                        alignItems: 'center',
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => handleFinish(task)}
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
                                    >
                                        <span role="img" aria-label="audio">🔊</span> Play Audio
                                    </button>
                                </div>
                            </div>
                        );
                    })}
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