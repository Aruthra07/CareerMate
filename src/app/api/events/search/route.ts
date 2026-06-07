import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { category } = body;

    const allEvents = [
      { id: 'ev-1', title: 'React Global Summit 2026', category: 'Technology', type: 'Conference', date: 'July 14, 2026' },
      { id: 'ev-2', title: 'SaaS Founder Roundtable Meetup', category: 'Business', type: 'Meetup', date: 'August 22, 2026' },
      { id: 'ev-3', title: 'Figma UI/UX Advanced workshop', category: 'Creative', type: 'Workshop', date: 'September 10, 2026' },
      { id: 'ev-4', title: 'Deep Learning & Neural Network Hackathon', category: 'Technology', type: 'Hackathon', date: 'October 15, 2026' },
    ];

    const filtered = category 
      ? allEvents.filter(e => e.category.toLowerCase().includes(category.toLowerCase()))
      : allEvents;

    return NextResponse.json({ success: true, events: filtered });

  } catch (err: any) {
    return NextResponse.json({ error: 'Event search failed', details: err.message }, { status: 500 });
  }
}
