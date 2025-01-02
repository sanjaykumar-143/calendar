import axios from 'axios';

const BASE_URL = 'http://localhost:8000';

// Fetch all companies


// Upload a file

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post(`${BASE_URL}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    console.log('Server response:', response.data);
    if (response?.data?.jsonData) {
      return response.data;
    } else {
      throw new Error('Invalid response structure: jsonData not found');
    }
  } catch (error) {
    console.error('File upload error:', error.response?.data || error.message);
    throw new Error('Failed to upload file');
  }
};


// Fetch specific company data
export const getCompanyData = async (companyName) => {
  try {
    const response = await axios.get(`${BASE_URL}/companydata`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching data for company ${companyName}:`, error.response?.data || error.message);
    throw new Error(`Failed to fetch data for company ${companyName}`);
  }
};

export const getCompanies = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/companyformlist`);
    return response.data;
  } catch (error) {
    console.error('Error fetching companies:', error.response?.data || error.message);
    throw new Error('Failed to fetch companies');
  }
};

export const fetchEvents = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/events`);
    console.log('Fetched events:', response.data); // Log the fetched events
    return response.data;
  } catch (error) {
    console.error('Error fetching events:', error.response?.data || error.message);
    throw new Error('Failed to fetch events');
  }
};




export const updateCompanyData = async (companyName, updatedDetails) => {
  try {
    const response = await axios.put(`${BASE_URL}/companydata/${companyName}`, updatedDetails);
    return response.data;
  } catch (error) {
    console.error(`Error updating company ${companyName}:`, error.response?.data || error.message);
    throw new Error('Failed to update company');
  }
};

export const deleteCompany = async (companyName) => {
  try {
    const response = await axios.delete(`${BASE_URL}/companydata/${companyName}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting company ${companyName}:`, error.response?.data || error.message);
    throw new Error('Failed to delete company');
  }
};
