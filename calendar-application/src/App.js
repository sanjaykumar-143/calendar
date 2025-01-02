import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Admin from "./components/admin.js";
import Dashboard from "./components/dashboard.js";
import CompanyPage from "./components/companylist.js";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/companies" element={<CompanyPage />} />
      </Routes>
    </Router>
  );
}

export default App;
