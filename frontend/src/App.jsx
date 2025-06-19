import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Layout/Layout.jsx";
import Signup from "./pages/SignUp.jsx";
import SignIn from "./pages/SignIn.jsx";
import Send from "./pages/Send.jsx";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile.jsx";
import Transaction from "./pages/Transaction.jsx";
import {
  rootRoute,
  signinRoute,
  signupRoute,
  profileRoute,
  sendRoute,
  transactionRoute,
} from "./helper/routeName.js";

const App = () => {
  return (
    <div className="bg-slate-900 min-h-screen p-2">
      <BrowserRouter>
        <Routes>

          <Route path={rootRoute} element={<Layout />}>
            <Route index element={<Dashboard />} /> 
            <Route path={profileRoute} element={<Profile />} />
            <Route path={sendRoute} element={<Send />} />
            <Route path={transactionRoute} element={<Transaction />} />
          </Route>

      
          <Route path={signinRoute} element={<SignIn />} />
          <Route path={signupRoute} element={<Signup />} />

          <Route path="*" element={<Navigate to={rootRoute} replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
