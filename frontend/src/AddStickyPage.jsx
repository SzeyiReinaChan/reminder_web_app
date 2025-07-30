import { useAddStickyViewModel } from './AddStickyViewModel';

const IPAD_WIDTH = 524;
const IPAD_HEIGHT = 695;

export default function AddStickyPage({ userType, onBack }) {
    const now = new Date();
    const {
        reminder,
        setReminder,
        frequency,
        setFrequency,
        error,
        submitting,
        handleSubmit,
    } = useAddStickyViewModel(userType, onBack);

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
            alignItems: 'center',
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
            <div className="d-flex flex-column align-items-center w-100">
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
                <div className="w-100 d-flex justify-content-center align-items-center" style={{ height: 500 }}>
                    <form className="bg-white rounded-4 shadow p-4" style={{ minWidth: 420, minHeight: 300 }} onSubmit={handleSubmit}>
                        <h3 className="fw-bold mb-3">Create Reminder</h3>
                        <div className="mb-3">
                            <label className="form-label">What to remind me of:</label>
                            <input className="form-control" value={reminder} onChange={e => setReminder(e.target.value)} disabled={submitting} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">When to remind me:</label>
                            <input className="form-control" value={frequency} onChange={e => setFrequency(e.target.value)} disabled={submitting} />
                        </div>
                        <div className="mb-4">
                            <label className="form-label">User Type:</label>
                            <select className="form-select" value={userType} onChange={e => setUserType(e.target.value)} disabled={submitting}>
                                <option value="older adult">Older Adult</option>
                                <option value="caregiver">Caregiver</option>
                            </select>
                        </div>
                        {error && <div className="text-danger small mb-2">{error}</div>}
                        <button className="btn btn-secondary w-100" type="submit" disabled={submitting}>{submitting ? 'Adding...' : 'Add'}</button>
                    </form>
                </div>
            </div>
        </div>
    );
} 