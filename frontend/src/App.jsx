import DualDashboard from './DualDashboard';

export default function App() {
  return (
    <div style={{
      minHeight: '100vh',
      minWidth: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#eaeaea',
    }}>
      <DualDashboard />
    </div>
  );
}
