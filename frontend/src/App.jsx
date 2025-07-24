import DualDashboard from './DualDashboard';

export default function App() {
  return (
    <div style={{
      minHeight: '100vh',
      minWidth: '100vw',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      background: '#eaeaea',
      paddingTop: 60,
    }}>
      <DualDashboard />
    </div>
  );
}
