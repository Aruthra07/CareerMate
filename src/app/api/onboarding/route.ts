import { NextRequest, NextResponse } from 'next/server';
import { prisma, mockDbStore } from '@/lib/db';
import { verifyJWT } from '@/lib/jwt';
import { generateCareerAnalysis } from '@/lib/ai';

// GET User profile, matches, ikigai, and roadmap (Dashboard loader)
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await verifyJWT(token);
    if (!user) {
      return NextResponse.json({ error: 'Invalid Session' }, { status: 401 });
    }

    let profile = null;
    let matches: any[] = [];
    let ikigai = null;
    let roadmap = null;

    try {
      // Try DB retrieval
      profile = await prisma.profile.findUnique({
        where: { userId: user.userId },
      });

      if (profile) {
        matches = await prisma.careerMatch.findMany({
          where: { userId: user.userId },
        });

        ikigai = await prisma.ikigai.findUnique({
          where: { userId: user.userId },
        });

        roadmap = await prisma.roadmap.findUnique({
          where: { userId: user.userId },
        });
      }
    } catch (dbErr) {
      // Fallback: Mock store
      console.warn('Database error, loading dashboard from mock store', dbErr);
      profile = mockDbStore.profiles.find(p => p.userId === user.userId) || null;
      if (profile) {
        matches = mockDbStore.careerMatches.filter(m => m.userId === user.userId);
        ikigai = mockDbStore.ikigais.find(i => i.userId === user.userId) || null;
        roadmap = mockDbStore.roadmaps.find(r => r.userId === user.userId) || null;
      }
    }

    let roadmapData = null;
    let booksData = null;
    let coursesData = null;

    if (roadmap) {
      try {
        const parsed = JSON.parse(roadmap.content);
        if (parsed && typeof parsed === 'object' && 'roadmap' in parsed) {
          roadmapData = parsed.roadmap;
          booksData = parsed.books;
          coursesData = parsed.courses;
        } else {
          roadmapData = parsed;
        }
      } catch (e) {
        console.error('Error parsing roadmap content', e);
      }
    }

    if (profile && (!booksData || !coursesData)) {
      try {
        const profileInput = {
          name: profile.name || user.name,
          age: profile.age,
          country: profile.country,
          education: profile.education,
          currentProfession: profile.currentProfession,
          skills: JSON.parse(profile.skills),
          personality: JSON.parse(profile.personality),
          purpose: JSON.parse(profile.purpose),
          rawBio: profile.rawBio,
        };
        const aiResult = await generateCareerAnalysis(profileInput);
        booksData = aiResult.books;
        coursesData = aiResult.courses;
        if (!roadmapData) roadmapData = aiResult.roadmap;
      } catch (err) {
        console.error('Error auto-generating books/courses', err);
      }
    }

    return NextResponse.json({
      profile: profile ? {
        ...profile,
        skills: JSON.parse(profile.skills),
        personality: JSON.parse(profile.personality),
        purpose: JSON.parse(profile.purpose),
      } : null,
      matches,
      ikigai: ikigai ? {
        ...ikigai,
        love: JSON.parse(ikigai.love),
        goodAt: JSON.parse(ikigai.goodAt),
        worldNeeds: JSON.parse(ikigai.worldNeeds),
        paidFor: JSON.parse(ikigai.paidFor),
      } : null,
      roadmap: roadmapData,
      books: booksData,
      courses: coursesData,
    });

  } catch (err: any) {
    console.error('Onboarding GET Error:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

// POST Onboarding submission & AI run
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
    const { name, age, country, education, currentProfession, skills, personality, assignmentAnswers, purpose, rawBio } = body;

    // Check required fields
    if (!age || !country || !skills || !personality || !rawBio) {
      return NextResponse.json({ error: 'Missing required onboarding data' }, { status: 400 });
    }

    // Prepare profile packet for AI engine
    const profileInput = {
      name: name || user.name,
      age: parseInt(age),
      country,
      education,
      currentProfession,
      skills,
      personality,
      assignmentAnswers: assignmentAnswers || { q1: '', q2: '', q3: '' },
      purpose,
      rawBio,
    };

    // Run AI / simulated discovery
    const aiResult = await generateCareerAnalysis(profileInput);

    let dbSuccess = false;

    try {
      // 1. Save or Update Profile
      await prisma.profile.upsert({
        where: { userId: user.userId },
        update: {
          age: profileInput.age,
          country: profileInput.country,
          education: profileInput.education,
          currentProfession: profileInput.currentProfession,
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

      // 2. Delete old career matches and save new ones
      await prisma.careerMatch.deleteMany({
        where: { userId: user.userId },
      });

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

      // 3. Save or Update Ikigai
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

      // 4. Save or Update Roadmap
      await prisma.roadmap.upsert({
        where: { userId: user.userId },
        update: {
          content: JSON.stringify({
            roadmap: aiResult.roadmap,
            books: aiResult.books,
            courses: aiResult.courses,
          }),
        },
        create: {
          userId: user.userId,
          content: JSON.stringify({
            roadmap: aiResult.roadmap,
            books: aiResult.books,
            courses: aiResult.courses,
          }),
        },
      });

      dbSuccess = true;
    } catch (dbErr) {
      console.warn('Database save failed during onboarding upsert. Storing in Mock Memory.', dbErr);
      
      // Update mock profiles
      mockDbStore.profiles = mockDbStore.profiles.filter(p => p.userId !== user.userId);
      mockDbStore.profiles.push({
        userId: user.userId,
        age: profileInput.age,
        country: profileInput.country,
        education: profileInput.education,
        currentProfession: profileInput.currentProfession,
        skills: JSON.stringify(profileInput.skills),
        personality: JSON.stringify(profileInput.personality),
        purpose: JSON.stringify(profileInput.purpose),
        rawBio: profileInput.rawBio,
      });

      // Update mock matches
      mockDbStore.careerMatches = mockDbStore.careerMatches.filter(m => m.userId !== user.userId);
      for (const m of aiResult.careerMatches) {
        mockDbStore.careerMatches.push({
          userId: user.userId,
          careerName: m.careerName,
          category: m.category,
          matchScore: m.matchScore,
          reasoning: m.reasoning,
          growthPotential: m.growthPotential,
          salaryRange: m.salaryRange,
          demandLevel: m.demandLevel,
        });
      }

      // Update mock Ikigai
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

      // Update mock Roadmap
      mockDbStore.roadmaps = mockDbStore.roadmaps.filter(r => r.userId !== user.userId);
      mockDbStore.roadmaps.push({
        userId: user.userId,
        content: JSON.stringify({
          roadmap: aiResult.roadmap,
          books: aiResult.books,
          courses: aiResult.courses,
        }),
      });
    }

    return NextResponse.json({
      success: true,
      dbSynced: dbSuccess,
      careerMatches: aiResult.careerMatches,
      ikigai: aiResult.ikigai,
      roadmap: aiResult.roadmap,
    });

  } catch (err: any) {
    console.error('Onboarding POST Error:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
