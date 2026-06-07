import { NextRequest, NextResponse } from 'next/server';
import { prisma, mockDbStore } from '@/lib/db';
import { verifyJWT } from '@/lib/jwt';
import { generateCareerAnalysis } from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await verifyJWT(token);
    if (!user) {
      return NextResponse.json({ error: 'Invalid Session' }, { status: 401 });
    }

    const body = await request.json();
    const { skills, personality, purpose, rawBio } = body;

    const profileInput = {
      name: user.name,
      age: 25, // default age
      country: 'India',
      education: 'Bachelor Degree',
      currentProfession: 'Explorer',
      skills: skills || ['Coding', 'Design'],
      personality: personality || { Introvert: 5, Risk: 5, Creative: 5, Analytical: 5 },
      purpose: purpose || { excites: 'Building tools', impact: 'Helping people', goals: 'Launch startup', flow: 'Design coding' },
      rawBio: rawBio || 'Self description plan.',
    };

    const aiResult = await generateCareerAnalysis(profileInput);

    try {
      // Upsert profile
      await prisma.profile.upsert({
        where: { userId: user.userId },
        update: {
          skills: JSON.stringify(profileInput.skills),
          personality: JSON.stringify(profileInput.personality),
          purpose: JSON.stringify(profileInput.purpose),
          rawBio: profileInput.rawBio,
        },
        create: {
          userId: user.userId,
          age: profileInput.age,
          country: profileInput.country,
          education: profileInput.education,
          currentProfession: profileInput.currentProfession,
          skills: JSON.stringify(profileInput.skills),
          personality: JSON.stringify(profileInput.personality),
          purpose: JSON.stringify(profileInput.purpose),
          rawBio: profileInput.rawBio,
        },
      });

      // Clear old matches
      await prisma.careerMatch.deleteMany({ where: { userId: user.userId } });

      for (const m of aiResult.careerMatches) {
        await prisma.careerMatch.create({
          data: {
            userId: user.userId,
            careerName: m.careerName,
            category: m.category,
            matchScore: m.matchScore,
            reasoning: m.reasoning,
            growthPotential: m.growthPotential,
            salaryRange: m.salaryRange,
            demandLevel: m.demandLevel,
          },
        });
      }

      // Save Ikigai
      await prisma.ikigai.upsert({
        where: { userId: user.userId },
        update: {
          love: JSON.stringify(aiResult.ikigai.love),
          goodAt: JSON.stringify(aiResult.ikigai.goodAt),
          worldNeeds: JSON.stringify(aiResult.ikigai.worldNeeds),
          paidFor: JSON.stringify(aiResult.ikigai.paidFor),
          summary: aiResult.ikigai.summary,
          purposeStatement: aiResult.ikigai.purposeStatement,
          analysis: aiResult.ikigai.analysis,
        },
        create: {
          userId: user.userId,
          love: JSON.stringify(aiResult.ikigai.love),
          goodAt: JSON.stringify(aiResult.ikigai.goodAt),
          worldNeeds: JSON.stringify(aiResult.ikigai.worldNeeds),
          paidFor: JSON.stringify(aiResult.ikigai.paidFor),
          summary: aiResult.ikigai.summary,
          purposeStatement: aiResult.ikigai.purposeStatement,
          analysis: aiResult.ikigai.analysis,
        },
      });

      // Save Roadmap
      await prisma.roadmap.upsert({
        where: { userId: user.userId },
        update: { content: JSON.stringify({
          roadmap: aiResult.roadmap,
          books: aiResult.books,
          courses: aiResult.courses
        }) },
        create: { userId: user.userId, content: JSON.stringify({
          roadmap: aiResult.roadmap,
          books: aiResult.books,
          courses: aiResult.courses
        }) },
      });
    } catch (e) {
      console.warn('DB fail, generating plan inside mock store');
      // Save to mock storage
      mockDbStore.profiles = mockDbStore.profiles.filter(p => p.userId !== user.userId);
      mockDbStore.profiles.push({
        userId: user.userId,
        skills: JSON.stringify(profileInput.skills),
        personality: JSON.stringify(profileInput.personality),
        purpose: JSON.stringify(profileInput.purpose),
        rawBio: profileInput.rawBio,
      });

      mockDbStore.ikigais = mockDbStore.ikigais.filter(i => i.userId !== user.userId);
      mockDbStore.ikigais.push({
        userId: user.userId,
        love: JSON.stringify(aiResult.ikigai.love),
        goodAt: JSON.stringify(aiResult.ikigai.goodAt),
        worldNeeds: JSON.stringify(aiResult.ikigai.worldNeeds),
        paidFor: JSON.stringify(aiResult.ikigai.paidFor),
        summary: aiResult.ikigai.summary,
        purposeStatement: aiResult.ikigai.purposeStatement,
        analysis: aiResult.ikigai.analysis,
      });
    }

    return NextResponse.json({ success: true, plan: aiResult });

  } catch (err: any) {
    return NextResponse.json({ error: 'Generation failure', details: err.message }, { status: 500 });
  }
}
