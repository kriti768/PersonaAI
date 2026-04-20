import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './layouts/AppLayout';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import ChatPage from './pages/ChatPage';
import DashboardPage from './pages/DashboardPage';
import InsightsPage from './pages/InsightsPage';
import HistoryPage from './pages/HistoryPage';
import SettingsPage from './pages/SettingsPage';
import PrivacyPage from './pages/PrivacyPage';

function Shell(page) {
  return (
    <ProtectedRoute>
      <AppLayout>{page}</AppLayout>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/chat" element={Shell(<ChatPage />)} />
      <Route path="/dashboard" element={Shell(<DashboardPage />)} />
      <Route path="/insights" element={Shell(<InsightsPage />)} />
      <Route path="/history" element={Shell(<HistoryPage />)} />
      <Route path="/settings" element={Shell(<SettingsPage />)} />
      <Route path="/privacy" element={Shell(<PrivacyPage />)} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
