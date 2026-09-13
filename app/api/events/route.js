import { NextResponse } from 'next/server';

// Server-side in-memory shared store (persists across requests during server lifetime)
let serverEvents = [
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

export async function GET() {
  return NextResponse.json({ success: true, events: serverEvents });
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (body.action === 'reset') {
      // Reset to defaults
      return NextResponse.json({ success: true, events: serverEvents });
    }
    if (body.action === 'clear_all') {
      serverEvents = [];
      return NextResponse.json({ success: true, events: [] });
    }

    const newEvent = {
      ...body,
      id: body.id || 'evt-' + Date.now(),
      status: body.status || 'upcoming'
    };
    serverEvents = [newEvent, ...serverEvents];
    return NextResponse.json({ success: true, event: newEvent, events: serverEvents });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (id) {
      serverEvents = serverEvents.filter(e => e.id !== id);
    }
    return NextResponse.json({ success: true, events: serverEvents });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
