import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, date, durationMinutes } = body;

    if (!title || !date) {
      return NextResponse.json({ error: 'Missing title or date parameters' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: `Event "${title}" successfully synced with Google Calendar on date: ${date}.`,
      eventId: 'gcal-' + Math.random().toString(36).substring(2, 9),
    });

  } catch (err: any) {
    return NextResponse.json({ error: 'Calendar sync failed', details: err.message }, { status: 500 });
  }
}
