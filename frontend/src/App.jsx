import { Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import AddStickyPage from './AddStickyPage';
import ArchivePage from './ArchivePage';

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
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/add" element={<AddStickyPage />} />
        <Route path="/archive" element={<ArchivePage />} />
      </Routes>
    </div>
  );
}
