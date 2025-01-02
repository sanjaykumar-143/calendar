import React, { useState, useEffect } from "react";
import { getCompanies } from "../api/index.js"; // Import centralized API service
import FileUpload from "./file.js";
import CompanyForm from "./companyform.js";
import CompanyPage from "./companylist.js";
import { useNavigate } from "react-router-dom";
import './admin.css'

const Admin = () => {
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  const dashboard = () => {
    navigate("/");
  };
  const company = () => {
    navigate("/companies");
  };

  return (
    
<div class="admin-container">
<header className="page-header">
  <h2>Admin Panel</h2>
  <div className="button-container">
    <button onClick={dashboard}>Dashboard</button>
    <button onClick={company}>Companies</button>
  </div>
</header>

  <FileUpload />
  <CompanyForm />
</div>
  
  );
};

export default Admin;
