import { useArchiveViewModel } from './ArchiveViewModel';

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

export default function ArchivePage({ userType, userName, onBack }) {
    const { archive, loading, error } = useArchiveViewModel(userType);
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
            boxShadow: '0 0 24px rgba(0,0,0,0.15)',
            overflow: 'hidden',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            border: '12px solid #222', // Add black border for iPad look
        }}>
            <div className="d-flex align-items-start w-100 pt-4 ps-4">
                <button
                    className="d-flex align-items-center justify-content-center"
                    onClick={onBack}
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        background: '#f0f0f0',
                        border: 'none',
                        boxShadow: '0 1px 4px #0001',
                        fontSize: 22,
                        color: '#222',
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                    }}
                    onMouseOver={e => (e.currentTarget.style.background = '#e0e0e0')}
                    onMouseOut={e => (e.currentTarget.style.background = '#f0f0f0')}
                    aria-label="Back"
                >
                    &#8592;
                </button>
            </div>
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
            </div>
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
                    {archive.map((task) => {
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
                                    }}
                                >
                                    <span className="badge bg-dark" style={{ fontSize: 14, padding: '8px 12px', borderRadius: 12 }}>
                                        Finished
                                    </span>
                                </div>
                                <h5 className="fw-bold">{task.title}</h5>
                                <div className="mt-3">
                                    <button className="btn btn-outline-secondary btn-sm me-2" disabled>
                                        <span role="img" aria-label="audio">🔊</span> Play Audio
                                    </button>
                                    {/* <button className="btn btn-link btn-sm" disabled>Instructions &rarr;</button> */}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
} 