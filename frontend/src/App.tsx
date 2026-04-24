import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LandingPage } from './pages/LandingPage';
import { SecurePortal } from './pages/SecurePortal';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/secure" element={<SecurePortal />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
