import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { profile, matches, ikigai } = body;

    const documentContent = `
=========================================
CAREERMATE AI - PERSONAL CAREER BLUEPRINT
=========================================
Name: ${profile?.name || 'Explorer'}
Profession: ${profile?.currentProfession || 'N/A'}
Country: ${profile?.country || 'N/A'}

PRIMARY CAREER PATHWAYS:
${(matches || []).map((m: any, idx: number) => `${idx + 1}. ${m.careerName} (${m.matchScore}% Match) - Growth: ${m.growthPotential}`).join('\n')}

IKIGAI PURPOSE STATEMENT:
"${ikigai?.purposeStatement || 'Not set'}"

Generated on: ${new Date().toLocaleDateString()}
=========================================
    `;

    return new NextResponse(documentContent.trim(), {
      headers: {
        'Content-Type': 'text/plain',
        'Content-Disposition': 'attachment; filename="careermate_career_plan.txt"',
      },
    });

  } catch (err: any) {
    return NextResponse.json({ error: 'Export failed', details: err.message }, { status: 500 });
  }
}
