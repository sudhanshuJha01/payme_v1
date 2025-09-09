import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx'; 
import SignupPage from './pages/SignupPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage';



const DashboardPage = () => <div className="text-center p-8">Dashboard Page</div>;
const NotFound = () => <div className="text-center p-8">404 - Page Not Found</div>;


const AppLayout = () => {
  return (
    <div>
      {/* We can add a Navbar here later */}
      <main>
        <Outlet /> {/* Child routes will be rendered here */}
      </main>
      {/* We can add a Footer here later */}
    </div>
  );
};

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
          {/* We can add more routes here later, like /history or /profile */}
        </Route>
        
        {/* Catch-all route for pages that don't exist */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;