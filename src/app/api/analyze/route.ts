import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text } = body;

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text prompt is required' }, { status: 400 });
    }

    const lower = text.toLowerCase();
    
    // Rule-based parsing simulation
    const detectedSkills: string[] = [];
    if (lower.includes('code') || lower.includes('program') || lower.includes('software') || lower.includes('python') || lower.includes('javascript')) {
      detectedSkills.push('Coding', 'Algorithms', 'Software Architecture');
    }
    if (lower.includes('design') || lower.includes('draw') || lower.includes('figma') || lower.includes('art') || lower.includes('layout')) {
      detectedSkills.push('Design', 'UX Research', 'Figma Wireframing');
    }
    if (lower.includes('lead') || lower.includes('manage') || lower.includes('boss') || lower.includes('team')) {
      detectedSkills.push('Leadership', 'Team Management', 'Agile Operations');
    }
    if (lower.includes('write') || lower.includes('copy') || lower.includes('blog') || lower.includes('content')) {
      detectedSkills.push('Writing', 'Content Strategy', 'Copywriting');
    }
    if (lower.includes('math') || lower.includes('data') || lower.includes('statistic') || lower.includes('excel')) {
      detectedSkills.push('Analytics', 'Data Analysis', 'Mathematical Modeling');
    }

    if (detectedSkills.length === 0) {
      detectedSkills.push('Problem Solving', 'Critical Thinking', 'Adaptability');
    }

    const payload = {
      skills: detectedSkills,
      personality: [
        lower.includes('introvert') || lower.includes('quiet') || lower.includes('alone') ? 'Introvert' : 'Extrovert',
        lower.includes('risk') || lower.includes('venture') || lower.includes('start') ? 'Risk-Tolerant' : 'Structured',
        lower.includes('create') || lower.includes('art') || lower.includes('innovate') ? 'Creative' : 'Pragmatic',
        lower.includes('logic') || lower.includes('math') || lower.includes('science') ? 'Analytical' : 'Qualitative'
      ],
      values: [
        lower.includes('help') || lower.includes('serve') || lower.includes('people') ? 'Altruism' : 'Achievement',
        lower.includes('money') || lower.includes('rich') || lower.includes('paid') ? 'Financial Security' : 'Creativity',
        lower.includes('free') || lower.includes('remote') || lower.includes('travel') ? 'Autonomy' : 'Structure'
      ],
      interests: [
        lower.includes('game') ? 'Gaming Tech' : 'Modern Workflows',
        lower.includes('health') || lower.includes('doctor') ? 'Bio-Tech' : 'Digital Automation'
      ],
      goals_short: lower.includes('shift') || lower.includes('change') ? 'Pivot into a entry role in 6 months' : 'Acquire professional certification in 3 months',
      goals_long: 'Achieve senior lead or independent founder status in 3-5 years',
      time_per_week: lower.includes('part') || lower.includes('busy') ? '10-15 Hours' : '20-30 Hours',
      industries: [
        lower.includes('code') || lower.includes('data') ? 'Technology' : 
        lower.includes('business') || lower.includes('sell') ? 'Business Consultancies' : 'Creative Agencies'
      ]
    };

    return NextResponse.json(payload);

  } catch (err: any) {
    return NextResponse.json({ error: 'Parsing failure', details: err.message }, { status: 500 });
  }
}
