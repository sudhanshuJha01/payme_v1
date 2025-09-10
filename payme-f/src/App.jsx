import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx'; 
import SignupPage from './pages/SignupPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardPage from './pages/DashboardPage.jsx';
import AppLayout from './components/AppLayout.jsx';
import HistoryPage from './pages/HistoryPage';
import ProfilePage from './pages/ProfilePage.jsx';



const NotFound = () => <div className="text-center p-8">404 - Page Not Found</div>;



function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route for the landing page */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Routes for authentication */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Routes for the main application, nested under AppLayout */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/history" element={<HistoryPage />} /> {/* Add this route */}
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
        
        {/* Catch-all route for pages that don't exist */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;