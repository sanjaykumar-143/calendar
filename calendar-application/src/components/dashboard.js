import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CalendarView from './calendarview.js';
import Analytics from './analytics.js';
import './dashboard.css';
import { fetchEvents } from "../api/index.js"; // Import centralized API service

const Dashboard = () => {
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [overdueNotifications, setOverdueNotifications] = useState([]);
  const [todayNotifications, setTodayNotifications] = useState([]);
  const nav = useNavigate();

  // Fetch companies and notifications
  useEffect(() => {
    const fetchCompaniesData = async () => {
      try {
        const companiesData = await fetchEvents();
        setCompanies(companiesData);
        // Calculate overdue and today's notifications
        const today = new Date();
        const overdue = companiesData.filter(company => new Date(company.nextCommunication.date) < today);
        const todayDue = companiesData.filter(company => new Date(company.nextCommunication.date).toDateString() === today.toDateString());

        setOverdueNotifications(overdue);
        setTodayNotifications(todayDue);
      } catch (error) {
        console.error("Error fetching companies:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompaniesData();
  }, []); // Empty dependency array to run only once on component mount

  const goToAdmin = () => {
    nav('/admin');
  };

  return (
    <div className="dashboard-container">
      <header className="page-header">
    <h2>Company List</h2>
    <button onClick={goToAdmin}>Admin</button>
  </header>
      <section className="notifications">
        <div className="badge overdue">Overdue: {overdueNotifications.length}</div>
        <div className="badge today">Due Today: {todayNotifications.length}</div>
      </section>
      <main>
        {isLoading ? (
          <p>Loading dashboard...</p>
        ) : (
          <>
            <CalendarView companies={companies} />
            <Analytics companies={companies} />
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
