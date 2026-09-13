'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const EventContext = createContext();

const initialDefaultEvents = [
  {
    id: 'evt-1',
    title: 'Sunday Long Run — Lodhi Garden Loop',
    dateDay: '21',
    dateMonth: 'Sep',
    time: 'Sun, 5:45 AM',
    location: 'Lodhi Garden Gate 2, Delhi',
    distance: '10K & 5K',
    category: 'Sunday Long Run',
    status: 'upcoming',
    pacers: ['4:45/km', '5:30/km', '6:15/km', '7:00 Run-Walk'],
    description: 'Delhi’s flagship morning community loop with pacers and hydration bag drop.'
  },
  {
    id: 'evt-2',
    title: 'Track Tuesdays — Speed & VO2 Max Intervals',
    dateDay: '24',
    dateMonth: 'Sep',
    time: 'Tue, 6:00 AM',
    location: 'Yamuna Sports Complex',
    distance: 'Intervals (400m–1600m)',
    category: 'Track & Intervals',
    status: 'upcoming',
    pacers: ['A-Pack: 6x800m', 'B-Pack: 8x400m', 'Intro Track'],
    description: 'Interval ladders under morning lights. Cadence drills, hip mobility, and coached splits.'
  },
  {
    id: 'evt-3',
    title: 'The Chase 10K — Season Opener Race',
    dateDay: '12',
    dateMonth: 'Oct',
    time: 'Sun, 6:00 AM',
    location: 'India Gate Circuit, Kartavya Path',
    distance: '10K Official',
    category: 'Official Race',
    status: 'upcoming',
    pacers: ['RFID Chip Timed', 'Finisher Medals', 'Post-Race Brunch'],
    description: 'Official timed road race with finisher medals, recovery brunch, and timing certificates.'
  },
  {
    id: 'evt-4',
    title: 'Sunrise Recovery & Guided Mobility Flow',
    dateDay: '15',
    dateMonth: 'Oct',
    time: 'Wed, 6:15 AM',
    location: 'Nehru Park Chanakyapuri',
    distance: '5K Easy Shakeout',
    category: 'Recovery & Mobility',
    status: 'ongoing',
    pacers: ['Conversational Zone 2', 'Guided Hip Mobility', 'All Levels'],
    description: 'Easy conversational 5K shakeout followed by 25-minute runner mobility flow.'
  }
];

export function EventProvider({ children }) {
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Sync with API on mount
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/events');
        if (res.ok) {
          const data = await res.json();
          if (data.events && data.events.length > 0) {
            setEvents(data.events);
            localStorage.setItem('chase_events_data', JSON.stringify(data.events));
          } else {
            // Local fallback
            const local = localStorage.getItem('chase_events_data');
            setEvents(local ? JSON.parse(local) : initialDefaultEvents);
          }
        }
      } catch (err) {
        const local = localStorage.getItem('chase_events_data');
        setEvents(local ? JSON.parse(local) : initialDefaultEvents);
      }

      try {
        const regRes = await fetch('/api/registrations');
        if (regRes.ok) {
          const regData = await regRes.json();
          if (regData.registrations) {
            setRegistrations(regData.registrations);
            localStorage.setItem('chase_event_registrations', JSON.stringify(regData.registrations));
          }
        }
      } catch (err) {
        const localReg = localStorage.getItem('chase_event_registrations');
        if (localReg) setRegistrations(JSON.parse(localReg));
      }

      setIsLoaded(true);
    }

    loadData();
  }, []);

  const addEvent = async (newEvent) => {
    const eventWithId = {
      ...newEvent,
      id: 'evt-' + Date.now(),
      status: newEvent.status || 'upcoming'
    };
    
    // Update local state immediately
    const updated = [eventWithId, ...events];
    setEvents(updated);
    localStorage.setItem('chase_events_data', JSON.stringify(updated));

    // Post to shared server-side API so all other users/devices receive it
    try {
      await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventWithId)
      });
    } catch (e) {
      console.warn('Sync to server failed:', e);
    }

    return eventWithId;
  };

  const removeEvent = async (id) => {
    const updated = events.filter(e => e.id !== id);
    setEvents(updated);
    localStorage.setItem('chase_events_data', JSON.stringify(updated));

    try {
      await fetch(`/api/events?id=${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
    } catch (e) {
      console.warn('Sync delete to server failed:', e);
    }
  };

  const removeAllEvents = async () => {
    setEvents([]);
    localStorage.setItem('chase_events_data', JSON.stringify([]));

    try {
      await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'clear_all' })
      });
    } catch (e) {
      console.warn('Sync clear all to server failed:', e);
    }
  };

  const resetDefaultEvents = async () => {
    setEvents(initialDefaultEvents);
    localStorage.setItem('chase_events_data', JSON.stringify(initialDefaultEvents));
    try {
      await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset' })
      });
    } catch (e) {
      console.warn('Sync reset to server failed:', e);
    }
  };

  const registerForEvent = async (registrationData) => {
    const newReg = {
      id: 'reg-' + Date.now(),
      ...registrationData,
      registeredAt: new Date().toISOString()
    };
    const updated = [newReg, ...registrations];
    setRegistrations(updated);
    localStorage.setItem('chase_event_registrations', JSON.stringify(updated));

    try {
      await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReg)
      });
    } catch (e) {
      console.warn('Sync registration to server failed:', e);
    }

    return newReg;
  };

  return (
    <EventContext.Provider value={{
      events,
      registrations,
      isLoaded,
      addEvent,
      removeEvent,
      removeAllEvents,
      resetDefaultEvents,
      registerForEvent
    }}>
      {children}
    </EventContext.Provider>
  );
}

export function useEvents() {
  return useContext(EventContext);
}
