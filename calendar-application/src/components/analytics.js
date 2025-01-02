import React, { useState, useEffect } from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import axios from 'axios';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Analytics = () => {
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch companies data
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get('http://localhost:8000/companyformlist');
        setCompanies(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching companies:', error);
        setIsLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  // Data for Doughnut Chart (Last Communication Count)
  const doughnutData = {
    labels: companies.map((company) => company.companyName || 'Unnamed Company'),
    datasets: [
      {
        label: 'Last Communication Count',
        data: companies.map((company) => company.lastCommunications?.length || 0),
        backgroundColor: companies.map(
          (_, index) => `hsl(${(index * 360) / companies.length}, 70%, 60%)`
        ),
      },
    ],
  };

  // Data for Bar Chart (Upcoming Communications)
  const barData = {
    labels: companies.map((company) => company.companyName || 'Unnamed Company'),
    datasets: [
      {
        label: 'Upcoming Communications',
        data: companies.map((company) =>
          company.nextCommunication?.date && new Date(company.nextCommunication.date) >= new Date()
            ? 1
            : 0
        ),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <h2>Analytics</h2>
      {isLoading ? (
        <p>Loading data...</p>
      ) : companies.length === 0 ? (
        <p>No company data available.</p>
      ) : (
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <div style={{ width: '300px' }}>
            <h3>Doughnut Chart</h3>
            <Doughnut data={doughnutData} />
          </div>
          <div style={{ width: '500px' }}>
            <h3>Bar Chart</h3>
            <Bar data={barData} options={{ responsive: true }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
