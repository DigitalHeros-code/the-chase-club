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

  useEffect(() => {
    const savedEvents = localStorage.getItem('chase_events_data');
    if (savedEvents) {
      try {
        setEvents(JSON.parse(savedEvents));
      } catch (e) {
        setEvents(initialDefaultEvents);
      }
    } else {
      setEvents(initialDefaultEvents);
      localStorage.setItem('chase_events_data', JSON.stringify(initialDefaultEvents));
    }

    const savedRegistrations = localStorage.getItem('chase_event_registrations');
    if (savedRegistrations) {
      try {
        setRegistrations(JSON.parse(savedRegistrations));
      } catch (e) {
        setRegistrations([]);
      }
    }
    setIsLoaded(true);
  }, []);

  const addEvent = (newEvent) => {
    const eventWithId = {
      ...newEvent,
      id: 'evt-' + Date.now(),
      status: newEvent.status || 'upcoming'
    };
    const updated = [eventWithId, ...events];
    setEvents(updated);
    localStorage.setItem('chase_events_data', JSON.stringify(updated));
    return eventWithId;
  };

  const removeEvent = (id) => {
    const updated = events.filter(e => e.id !== id);
    setEvents(updated);
    localStorage.setItem('chase_events_data', JSON.stringify(updated));
  };

  const removeAllEvents = () => {
    setEvents([]);
    localStorage.setItem('chase_events_data', JSON.stringify([]));
  };

  const resetDefaultEvents = () => {
    setEvents(initialDefaultEvents);
    localStorage.setItem('chase_events_data', JSON.stringify(initialDefaultEvents));
  };

  const registerForEvent = (registrationData) => {
    const newReg = {
      id: 'reg-' + Date.now(),
      ...registrationData,
      registeredAt: new Date().toISOString()
    };
    const updated = [newReg, ...registrations];
    setRegistrations(updated);
    localStorage.setItem('chase_event_registrations', JSON.stringify(updated));
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
