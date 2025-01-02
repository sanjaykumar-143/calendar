import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { fetchEvents } from '../api/index.js'; // Import the fetchEvents function
import './calendarview.css';

const CalendarView = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [eventsOnSelectedDate, setEventsOnSelectedDate] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [eventDates, setEventDates] = useState({}); // Store events by date

  useEffect(() => {
    const fetchAndSetEvents = async () => {
      try {
        const eventsData = await fetchEvents();
        if (Array.isArray(eventsData)) {
          setEvents(eventsData);

          // Map events to their respective dates
          const eventDatesMap = eventsData.reduce((acc, event) => {
            const eventDate = new Date(event.date).toISOString().split('T')[0]; // Format date to 'YYYY-MM-DD'
            if (!acc[eventDate]) {
              acc[eventDate] = [];
            }
            acc[eventDate].push(event.type); // Add event type to the date key
            return acc;
          }, {});

          setEventDates(eventDatesMap);
        } else {
          console.warn('Invalid events data format');
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndSetEvents();
  }, []);

  const filterEvents = (date) => {
    const formattedDate = date.toISOString().split('T')[0]; // Get the date part only
    setEventsOnSelectedDate(eventDates[formattedDate] || []); // Get events for the selected date
  };

  const onDateChange = (date) => {
    setSelectedDate(date);
    filterEvents(date);
  };

  const tileContent = ({ date, view }) => {
    const formattedDate = date.toISOString().split('T')[0]; // Get the date part only
    if (eventDates[formattedDate]) {
      return <div className="red-dot"></div>; // Add a red dot for dates with events
    }
    return null;
  };

  return (
    <div className="calendar-view">
      {/* <h2>Calendar</h2> */}
      <Calendar 
        onChange={onDateChange} 
        value={selectedDate} 
        tileContent={tileContent} // Show events on the calendar
      />
      {isLoading ? (
        <p>Loading events...</p>
      ) : (
        <div className="events">
          <h3>Events on {selectedDate.toDateString()}</h3>
          <ul>
            {eventsOnSelectedDate.length > 0 ? (
              eventsOnSelectedDate.map((event, index) => (
                <li key={index}>
                  {event}
                </li>
              ))
            ) : (
              <p>No events</p>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CalendarView;
