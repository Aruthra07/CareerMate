import { NextRequest, NextResponse } from 'next/server';
import { prisma, mockDbStore } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    let profile = null;
    let matches: any[] = [];
    let ikigai = null;
    let roadmap = null;

    try {
      profile = await prisma.profile.findFirst({
        where: { userId: id },
      });

      if (profile) {
        matches = await prisma.careerMatch.findMany({
          where: { userId: id },
        });

        ikigai = await prisma.ikigai.findFirst({
          where: { userId: id },
        });

        roadmap = await prisma.roadmap.findFirst({
          where: { userId: id },
        });
      }
    } catch (dbErr) {
      console.warn('DB fail, loading dynamic plan from memory');
      profile = mockDbStore.profiles.find(p => p.userId === id) || null;
      if (profile) {
        matches = mockDbStore.careerMatches.filter(m => m.userId === id);
        ikigai = mockDbStore.ikigais.find(i => i.userId === id) || null;
        roadmap = mockDbStore.roadmaps.find(r => r.userId === id) || null;
      }
    }

    if (!profile) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 450 });
    }

    return NextResponse.json({
      success: true,
      profile: {
        ...profile,
        skills: typeof profile.skills === 'string' ? JSON.parse(profile.skills) : profile.skills,
        personality: typeof profile.personality === 'string' ? JSON.parse(profile.personality) : profile.personality,
        purpose: typeof profile.purpose === 'string' ? JSON.parse(profile.purpose) : profile.purpose,
      },
      matches,
      ikigai: ikigai ? {
        ...ikigai,
        love: typeof ikigai.love === 'string' ? JSON.parse(ikigai.love) : ikigai.love,
        goodAt: typeof ikigai.goodAt === 'string' ? JSON.parse(ikigai.goodAt) : ikigai.goodAt,
        worldNeeds: typeof ikigai.worldNeeds === 'string' ? JSON.parse(ikigai.worldNeeds) : ikigai.worldNeeds,
        paidFor: typeof ikigai.paidFor === 'string' ? JSON.parse(ikigai.paidFor) : ikigai.paidFor,
      } : null,
      roadmap: roadmap ? JSON.parse(roadmap.content) : null,
    });

  } catch (err: any) {
    return NextResponse.json({ error: 'Plan retrieval failed', details: err.message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { ikigai, roadmap } = body;

    try {
      if (ikigai) {
        await prisma.ikigai.update({
          where: { userId: id },
          data: {
            love: JSON.stringify(ikigai.love),
            goodAt: JSON.stringify(ikigai.goodAt),
            worldNeeds: JSON.stringify(ikigai.worldNeeds),
            paidFor: JSON.stringify(ikigai.paidFor),
            summary: ikigai.summary,
            purposeStatement: ikigai.purposeStatement,
          },
        });
      }

      if (roadmap) {
        await prisma.roadmap.update({
          where: { userId: id },
          data: { content: JSON.stringify(roadmap) },
        });
      }
    } catch (e) {
      console.warn('DB update fail, saving to mock memory');
      // Mock Update
      if (ikigai) {
        const item = mockDbStore.ikigais.find(i => i.userId === id);
        if (item) {
          item.love = JSON.stringify(ikigai.love);
          item.goodAt = JSON.stringify(ikigai.goodAt);
          item.worldNeeds = JSON.stringify(ikigai.worldNeeds);
          item.paidFor = JSON.stringify(ikigai.paidFor);
          item.summary = ikigai.summary;
          item.purposeStatement = ikigai.purposeStatement;
        }
      }
      if (roadmap) {
        const item = mockDbStore.roadmaps.find(r => r.userId === id);
        if (item) {
          item.content = JSON.stringify(roadmap);
        }
      }
    }

    return NextResponse.json({ success: true, message: 'Plan updated successfully' });

  } catch (err: any) {
    return NextResponse.json({ error: 'Plan update failed', details: err.message }, { status: 500 });
  }
}
