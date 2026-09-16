import { HashRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Nav, NavLink } from '@/lib/ui/Nav';
import { Newspaper, LineChart as LineChartIcon, CalendarRange } from 'lucide-react';
import DailyReport from '@/pages/DailyReport';
import MacroDashboard from '@/pages/MacroDashboard';
import WeeklySummary from '@/pages/WeeklySummary';

function Shell() {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <div className="min-h-screen">
      <Nav brand={<span>Macro Pulse</span>}>
        <NavLink href="#/" active={location.pathname === '/'} onClick={(e) => { e.preventDefault(); navigate('/'); }}>
          <Newspaper size={14} className="mr-2" />Daily Report
        </NavLink>
        <NavLink href="#/macro" active={location.pathname === '/macro'} onClick={(e) => { e.preventDefault(); navigate('/macro'); }}>
          <LineChartIcon size={14} className="mr-2" />Macro Dashboard
        </NavLink>
        <NavLink href="#/weekly" active={location.pathname === '/weekly'} onClick={(e) => { e.preventDefault(); navigate('/weekly'); }}>
          <CalendarRange size={14} className="mr-2" />Weekly Summary
        </NavLink>
      </Nav>
      <main className="py-8">
        <Routes>
          <Route path="/" element={<DailyReport />} />
          <Route path="/macro" element={<MacroDashboard />} />
          <Route path="/weekly" element={<WeeklySummary />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <Shell />
    </HashRouter>
  );
}
