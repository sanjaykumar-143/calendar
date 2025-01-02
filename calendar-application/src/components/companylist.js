import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './companylist.css';
import { useNavigate } from 'react-router-dom';

const BASE_URL = 'http://localhost:8000';

const CompanyPage = () => {
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCompany, setEditingCompany] = useState(null);
  const [updatedDetails, setUpdatedDetails] = useState({});
  const nav=useNavigate();
  const dashboard = () => {
    nav("/");
  };

  useEffect(() => {
    const fetchCompaniesData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/companyformlist`);
        if (response.status === 200) {
          setCompanies(response.data);
        } else {
          setError('Failed to fetch company data.');
        }
      } catch (error) {
        setError('Error fetching companies. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompaniesData();
  }, []);

  const handleEdit = (company) => {
    setEditingCompany(company);
    setUpdatedDetails(company); // Pre-fill the form with existing company details
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${BASE_URL}/companydata/${editingCompany.companyName}`, updatedDetails);
      alert('Company updated successfully!');
      setEditingCompany(null);
      setCompanies((prevCompanies) =>
        prevCompanies.map((c) =>
          c.companyName === editingCompany.companyName ? { ...c, ...updatedDetails } : c
        )
      );
    } catch (error) {
      alert('Failed to update company. Please try again.');
    }
  };

  const handleDelete = async (companyName) => {
    if (window.confirm(`Are you sure you want to delete ${companyName}?`)) {
      try {
        await axios.delete(`${BASE_URL}/companydata/${companyName}`);
        alert('Company deleted successfully!');
        setCompanies((prevCompanies) => prevCompanies.filter((c) => c.companyName !== companyName));
      } catch (error) {
        alert('Failed to delete company. Please try again.');
      }
    }
  };

  return (
    <div className="container">
      <header className="page-header">
    <h2>Company List</h2>
    <button onClick={dashboard}>Dashboard</button>
  </header>
      {isLoading ? (
        <p>Loading companies...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : companies.length > 0 ? (
        <table className="company-table">
          <thead>
            <tr>
              <th>Company Name</th>
              <th>Location</th>
              <th>Email</th>
              <th>Comments</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company) => (
              <tr key={company._id}>
                <td>{company.companyName}</td>
                <td>{company.location}</td>
                <td>{company.email}</td>
                <td>{company.comments}</td>
                <td>
                  <button className="edit" onClick={() => handleEdit(company)}>
                    Edit
                  </button>
                  <button className="delete" onClick={() => handleDelete(company.companyName)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No companies available</p>
      )}

      {editingCompany && (
        <div className="edit-form">
          <h3>Edit Company: {editingCompany.companyName}</h3>
          <input
            type="text"
            placeholder="Location"
            value={updatedDetails.location || ''}
            onChange={(e) => setUpdatedDetails({ ...updatedDetails, location: e.target.value })}
          />
          <input
            type="text"
            placeholder="Email"
            value={updatedDetails.email || ''}
            onChange={(e) => setUpdatedDetails({ ...updatedDetails, email: e.target.value })}
          />
          <input
            type="text"
            placeholder="Comments"
            value={updatedDetails.comments || ''}
            onChange={(e) => setUpdatedDetails({ ...updatedDetails, comments: e.target.value })}
          />
          <button className="save" onClick={handleUpdate}>
            Save
          </button>
          <button className="cancel" onClick={() => setEditingCompany(null)}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default CompanyPage;
