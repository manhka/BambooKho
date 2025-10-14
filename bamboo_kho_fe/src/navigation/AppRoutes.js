import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import AdminHomePage from "../pages/AdminHomePage";
import StaffHomePage from "../pages/StaffHomePage";
const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="*" element={<LoginPage />} />
      <Route path="adminHomePage" element={<AdminHomePage />} />
      <Route path="staffHomePage" element={<StaffHomePage />} />
    </Routes>
  </Router>
);

export default AppRoutes;
