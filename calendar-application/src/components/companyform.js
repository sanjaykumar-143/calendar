import React, { useState } from 'react';
import axios from 'axios';
import './companyform.css';

const CompanyForm = ({ onSubmit }) => {
  const [company, setCompany] = useState({
    name: '',
    location: '',
    email: '',
    comments: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompany({ ...company, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!company.name || !company.email) {
      setError('Please fill all required fields');
      return;
    }
  
    setLoading(true);
    setError('');
  
    try {
      const formData = new FormData();
      formData.append('companyName', company.name);
      formData.append('location', company.location);
      formData.append('email', company.email);
      formData.append('comments', company.comments);
  
      const response = await axios.post('http://localhost:8000/companyform', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      if (response.data.success) {
        alert('Form submitted successfully!');
        if (onSubmit) {
          onSubmit(); // Call only if onSubmit is defined
        }
        setCompany({
          name: '',
          location: '',
          email: '',
          comments: '',
        });
      } else {
        setError(response.data.message || 'Submission failed');
      }
    } catch (error) {
      setError('An error occurred while submitting the form');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="company-form">
      <input type="text" name="name" placeholder="Name" onChange={handleChange} value={company.name} required />
      <input type="text" name="location" placeholder="Location" onChange={handleChange} value={company.location} />
      <input type="email" name="email" placeholder="Email" onChange={handleChange} value={company.email} required />
      <textarea name="comments" placeholder="Comments" onChange={handleChange} value={company.comments}></textarea>
      <button type="submit" disabled={loading}>
        {loading ? 'Submitting...' : 'Add Company'}
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  );
};

export default CompanyForm;
