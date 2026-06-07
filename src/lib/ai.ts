// AI Career Analysis Engine

export interface AIAnalysisResult {
  careerMatches: Array<{
    careerName: string;
    category: string;
    matchScore: number;
    reasoning: string;
    growthPotential: 'High' | 'Medium' | 'Low';
    salaryRange: string;
    demandLevel: string;
  }>;
  ikigai: {
    love: string[];
    goodAt: string[];
    worldNeeds: string[];
    paidFor: string[];
    summary: string;
    purposeStatement: string;
    analysis: string;
  };
  roadmap: {
    '0-3 Months': MilestonePhase;
    '3-6 Months': MilestonePhase;
    '6-12 Months': MilestonePhase;
    '1-3 Years': MilestonePhase;
    '3-5 Years': MilestonePhase;
  };
  books: {
    beginner: BookRecommend[];
    intermediate: BookRecommend[];
    advanced: BookRecommend[];
  };
  courses: CourseRecommend[];
}

interface MilestonePhase {
  skills: string[];
  projects: string[];
  courses: string[];
  certifications: string[];
  networkingTasks: string[];
  portfolioTasks: string[];
  interviewPrep: string[];
  milestones: string[];
}

interface BookRecommend {
  title: string;
  author: string;
  summary: string;
  whyItMatters: string;
  amazonLink: string;
  goodreadsLink: string;
}

interface CourseRecommend {
  title: string;
  platform: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  rating: number;
  priority: 'High' | 'Medium' | 'Low';
}

// Generates highly personalized career analysis using OpenAI or an elegant local AI matcher
export async function generateCareerAnalysis(profileData: {
  name: string;
  age: number;
  country: string;
  education: string;
  currentProfession: string;
  skills: string[];
  personality: Record<string, number>; // Introvert(1-10), Risk(1-10), Creative(1-10), Analytical(1-10)
  assignmentAnswers?: { q1: string; q2: string; q3: string };
  purpose: { excites: string; impact: string; goals: string; flow: string };
  rawBio: string;
}): Promise<AIAnalysisResult> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (apiKey) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          response_format: { type: 'json_object' },
          messages: [
            {
              role: 'system',
              content: `You are an expert career guidance system. Analyze the user's details and return a single valid JSON object containing:
              - careerMatches: Top 4 matching careers.
              - ikigai: love, goodAt, worldNeeds, paidFor, summary, purposeStatement, analysis.
              - roadmap: '0-3 Months', '3-6 Months', '6-12 Months', '1-3 Years', '3-5 Years' milestones.
              - books: beginner, intermediate, advanced.
              - courses: recommended list.
              Ensure you do not return anything except valid JSON.`
            },
            {
              role: 'user',
              content: JSON.stringify(profileData)
            }
          ],
        }),
      });

      if (response.ok) {
        const json = await response.json();
        return JSON.parse(json.choices[0].message.content) as AIAnalysisResult;
      }
    } catch (e) {
      console.warn('OpenAI request failed, triggering local AI Simulation Engine.', e);
    }
  }

  // --- LOCAL AI SIMULATION ENGINE (HIGH FIDELITY MATCHING) ---
  const userSkills = profileData.skills;
  const isCreative = (profileData.personality.Creative || 5) > 5;
  const isAnalytical = (profileData.personality.Analytical || 5) > 5;
  const isIntrovert = (profileData.personality.Introvert || 5) > 5;
  const riskTolerance = profileData.personality.Risk || 5;

  const q1 = profileData.assignmentAnswers?.q1 || '';
  const q2 = profileData.assignmentAnswers?.q2 || '';
  const q3 = profileData.assignmentAnswers?.q3 || '';

  // Base weighted variables
  let techScore = 80;
  let creativeScore = 80;
  let businessScore = 80;

  // Q1 scenario choices
  if (q1 === 'A') techScore += 12;
  if (q1 === 'B') techScore += 8;
  if (q1 === 'C') businessScore += 8;
  if (q1 === 'D') creativeScore += 6;

  // Q2 scenario choices
  if (q2 === 'A') creativeScore += 14;
  if (q2 === 'B') techScore += 10;
  if (q2 === 'C') businessScore += 10;
  if (q2 === 'D') businessScore += 6;

  // Q3 scenario choices
  if (q3 === 'A') techScore += 10;
  if (q3 === 'B') creativeScore += 10;
  if (q3 === 'C') businessScore += 12;
  if (q3 === 'D') businessScore += 6;

  // Selection logic for Careers
  let careers: AIAnalysisResult['careerMatches'] = [];

  if (userSkills.some(s => ['Coding', 'Research', 'Math'].includes(s)) || isAnalytical || techScore > 88) {
    careers.push({
      careerName: 'AI & Machine Learning Engineer',
      category: 'Technology',
      matchScore: Math.min(98, techScore + (isAnalytical ? 4 : 0)),
      reasoning: `Your scenario choices show high technical problem-solving focus. Pairing logical database reactions with your analytical stack makes ML engineering your highest match.`,
      growthPotential: 'High',
      salaryRange: '$120,000 - $210,000',
      demandLevel: 'High (89% growth projected)',
    });
    careers.push({
      careerName: 'Data Scientist & Analytics Lead',
      category: 'Technology',
      matchScore: Math.min(95, techScore - 2),
      reasoning: `You select research vectors and structured options. System indexes and mathematical queries align perfectly.`,
      growthPotential: 'High',
      salaryRange: '$95,000 - $160,000',
      demandLevel: 'High',
    });
  }

  if (userSkills.some(s => ['Design', 'Writing', 'Art'].includes(s)) || isCreative || creativeScore > 88) {
    careers.push({
      careerName: 'UI/UX Product Designer',
      category: 'Creative',
      matchScore: Math.min(98, creativeScore + (isCreative ? 4 : 0)),
      reasoning: `You choose visual layout aesthetics and design recovery options. Crafting user-centric design workflows matches your style.`,
      growthPotential: 'High',
      salaryRange: '$85,000 - $150,000',
      demandLevel: 'Stable',
    });
    careers.push({
      careerName: 'Creative Content Director',
      category: 'Creative',
      matchScore: Math.min(92, creativeScore - 4),
      reasoning: `Creative leadership combined with qualitative bio descriptions suggests suitability for steering brand content programs.`,
      growthPotential: 'Medium',
      salaryRange: '$75,000 - $130,000',
      demandLevel: 'High',
    });
  }

  if (userSkills.some(s => ['Leadership', 'Marketing', 'Finance'].includes(s)) || riskTolerance > 6 || businessScore > 88) {
    careers.push({
      careerName: 'SaaS Start-up Founder / Entrepreneur',
      category: 'Business',
      matchScore: Math.min(96, businessScore + (riskTolerance > 7 ? 4 : 0)),
      reasoning: `High risk tolerances and business-oriented scenario choices map well to founder tasks, managing financial modeling and product launches.`,
      growthPotential: 'High',
      salaryRange: 'Equity + Profit Share ($50k - $250k+)',
      demandLevel: 'High',
    });
    careers.push({
      careerName: 'Product Strategy Consultant',
      category: 'Business',
      matchScore: Math.min(90, businessScore - 2),
      reasoning: `Excellent cross-team communication priorities. Formulating strategic consultation maps fits you perfectly.`,
      growthPotential: 'Medium',
      salaryRange: '$110,000 - $185,000',
      demandLevel: 'Stable',
    });
  }

  // Ensure at least 3 career matches
  if (careers.length < 3) {
    careers.push({
      careerName: 'Technical Project Manager',
      category: 'Technology',
      matchScore: 82,
      reasoning: `Your diverse background and structured organizational thinking makes you an excellent candidate for keeping cross-functional teams aligned.`,
      growthPotential: 'Medium',
      salaryRange: '$90,000 - $140,000',
      demandLevel: 'Stable',
    });
    careers.push({
      careerName: 'Growth Marketing Architect',
      category: 'Business',
      matchScore: 80,
      reasoning: `Using analytics combined with marketing triggers matches your balanced creative-analytical score.`,
      growthPotential: 'High',
      salaryRange: '$80,000 - $135,000',
      demandLevel: 'High',
    });
  }

  const primaryCareer = careers[0].careerName;

  // Assemble simulated Ikigai
  const ikigai: AIAnalysisResult['ikigai'] = {
    love: [
      profileData.purpose.excites || 'Solving difficult cognitive puzzles',
      'Learning new digital tools and technologies',
      profileData.purpose.flow || 'Building aesthetic project designs'
    ],
    goodAt: [
      ...userSkills.slice(0, 3),
      isAnalytical ? 'Logical frameworks and research' : 'Empathetic storytelling',
      'Self-directed study and fast execution'
    ],
    worldNeeds: [
      'Accessible AI technology simplified for normal people',
      'Data-driven solutions that reduce global energy consumption',
      profileData.purpose.impact || 'Mentorship for younger professionals'
    ],
    paidFor: [
      `Expert roles in ${primaryCareer}`,
      'Freelance technical consulting contracts',
      'Creating online educational assets and masterclasses'
    ],
    summary: `Your Ikigai centers on merging ${userSkills.join(', ')} to construct tools that create real impact. You thrive when combining structured workflows with creative execution.`,
    purposeStatement: `To empower others by designing intelligent, ethical solutions at the intersection of technology and human potential.`,
    analysis: `Your career profile indicates a highly autonomous mindset with a preference for modern remote-friendly roles. Focus on building public proof-of-work rather than simple academic credentials.`
  };

  // Compile Milestone Phases
  const roadmap: AIAnalysisResult['roadmap'] = {
    '0-3 Months': {
      skills: [userSkills[0] || 'Core Industry Fundamentals', 'Git/GitHub Version Control', 'Basic CLI Navigation'],
      projects: ['Personal portfolio site', 'Simple open-source contributions'],
      courses: [`Introduction to ${primaryCareer} (Coursera)`, 'Modern Workflow Productivity (Udemy)'],
      certifications: ['Scrum Fundamentals Cert (SFC)', 'Foundational Career Badge'],
      networkingTasks: ['Set up a high-quality LinkedIn banner and headline', 'Connect with 10 professionals in your target field'],
      portfolioTasks: ['Create clean GitHub profile page', 'Write a blog post detailing your learning roadmap'],
      interviewPrep: ['Write dynamic answers for behavioral questions', 'Optimize your resume using modern ATS standards'],
      milestones: ['Completed foundational online course', 'Setup public sandbox repository']
    },
    '3-6 Months': {
      skills: ['Advanced technical toolsets', 'System Design and Architecture basics'],
      projects: ['A fully-functional utility application', 'Recreating a famous system clone'],
      courses: ['System Architecture & APIs (edX)', 'Advanced CSS Grid & Tailwind (YouTube)'],
      certifications: ['AWS Certified Cloud Practitioner', 'Professional Industry Credentials'],
      networkingTasks: ['Attend a virtual hackathon or conference', 'Conduct 2 informational interviews with senior staff'],
      portfolioTasks: ['Deploy live URL for your primary project', 'Upload dynamic case studies of your designs'],
      interviewPrep: ['Start daily mock interviews with technical prompts', 'Understand standard salary benchmarking'],
      milestones: ['First complex project deployed', 'Participated in a regional meet-up']
    },
    '6-12 Months': {
      skills: ['Production-level testing', 'CI/CD pipeline configuration'],
      projects: ['A collaborative team product with active users', 'Contributing to a major software framework'],
      courses: ['Advanced Professional Specialization (Coursera)', 'Microservices Architecture'],
      certifications: ['Google Professional Data Engineer', 'Advanced Specialty Certificate'],
      networkingTasks: ['Form a peer study circle with 3 other candidates', 'Reach out to 5 local agency directors'],
      portfolioTasks: ['Polished case study detailing data validation', 'Video walk-through of your project codebase'],
      interviewPrep: ['Solve 50 intermediate algorithm questions', 'Practice salary negotiations'],
      milestones: ['Completed collaboration project', 'Gained AWS Developer Associate']
    },
    '1-3 Years': {
      skills: ['Team mentorship', 'Cloud infrastructure scaling', 'Financial modeling'],
      projects: ['Lead a major architectural rewrite', 'Build a side-SaaS earning recurring revenue'],
      courses: ['Product Leadership masterclasses', 'UX Strategy Fundamentals'],
      certifications: ['Prisma Certified Specialist', 'Professional Scrum Master (PSM II)'],
      networkingTasks: ['Speak at a local meetup or webinar', 'Mentor junior candidates entering the field'],
      portfolioTasks: ['Consolidate all proof-of-work into a custom domain', 'Write an in-depth technical whitepaper'],
      interviewPrep: ['Design case studies for director-level roles', 'Review stock-option evaluation matrices'],
      milestones: ['Promoted to Senior Lead / Launched successful side startup', 'Mentored 3 junior developers']
    },
    '3-5 Years': {
      skills: ['Organizational design', 'Venture Capital frameworks', 'Enterprise planning'],
      projects: ['Manage a multi-department team of 15+', 'Direct product lifecycle from concept to $1M ARR'],
      courses: ['Executive Business Management (Harvard Online)', 'AI Ethics Governance'],
      certifications: ['Enterprise Architect TOGAF', 'Executive Leadership Certificate'],
      networkingTasks: ['Host an industry roundtable event', 'Serve as an advisory board member for a startup'],
      portfolioTasks: ['Publish a complete book or series of guides in your field', 'Create a prominent open-source package'],
      interviewPrep: ['Prepare executive board presentations', 'Perform media readiness training'],
      milestones: ['Reached Principal Status / Founded scalable venture', 'First international conference talk']
    }
  };

  // Compile recommended Books
  const books: AIAnalysisResult['books'] = {
    beginner: [
      {
        title: 'Atomic Habits',
        author: 'James Clear',
        summary: 'A structured guide to building good habits, breaking bad ones, and mastering the tiny behaviors that lead to remarkable results.',
        whyItMatters: 'Essential for maintaining study streaks and building consistency during deep focus blocks.',
        amazonLink: 'https://www.amazon.com/Atomic-Habits-Proven-Build-Break/dp/0735211299',
        goodreadsLink: 'https://www.goodreads.com/book/show/40121378-atomic-habits'
      },
      {
        title: 'So Good They Can\'t Ignore You',
        author: 'Cal Newport',
        summary: 'Argues that "follow your passion" is flawed advice. Instead, build rare and valuable skills (career capital) to unlock great jobs.',
        whyItMatters: 'Crucial mindset change for developing technical mastery in your chosen career path.',
        amazonLink: 'https://www.amazon.com/Good-They-Cant-Ignore-You/dp/1455509124',
        goodreadsLink: 'https://www.goodreads.com/book/show/13521381-so-good-they-can-t-ignore-you'
      }
    ],
    intermediate: [
      {
        title: 'Deep Work',
        author: 'Cal Newport',
        summary: 'Rules for focused success in a distracted world. Explains how to focus without distraction on cognitively demanding tasks.',
        whyItMatters: 'Necessary to survive modern workspaces and achieve high study hours per day.',
        amazonLink: 'https://www.amazon.com/Deep-Work-Focused-Success-Distracted/dp/1455586692',
        goodreadsLink: 'https://www.goodreads.com/book/show/25744928-deep-work'
      },
      {
        title: 'The Lean Startup',
        author: 'Eric Ries',
        summary: 'A methodology for creating startups through rapid experimentation, validated learning, and iterative product releases.',
        whyItMatters: 'Important for understanding product lifecycles and validating career roadmap projects.',
        amazonLink: 'https://www.amazon.com/Lean-Startup-Entrepreneurs-Continuous-Innovation/dp/0307887898',
        goodreadsLink: 'https://www.goodreads.com/book/show/10127019-the-lean-startup'
      }
    ],
    advanced: [
      {
        title: 'The Hard Thing About Hard Things',
        author: 'Ben Horowitz',
        summary: 'Honest business advice on building and running startups, managing layoffs, hiring, and handling difficult executive decisions.',
        whyItMatters: 'Prepares you for the realities of leadership, management, and high-stakes entrepreneurship.',
        amazonLink: 'https://www.amazon.com/Hard-Thing-About-Things-Building/dp/0062273202',
        goodreadsLink: 'https://www.goodreads.com/book/show/18176747-the-hard-thing-about-hard-thing'
      }
    ]
  };

  // Compile recommended Courses
  const courses: AIAnalysisResult['courses'] = [
    {
      title: `Google Career Certificate: ${primaryCareer} Specialist`,
      platform: 'Coursera',
      difficulty: 'Beginner',
      duration: '4-6 Months',
      rating: 4.8,
      priority: 'High'
    },
    {
      title: 'Advanced System Architecture Masterclass',
      platform: 'Udemy',
      difficulty: 'Intermediate',
      duration: '12 Hours',
      rating: 4.7,
      priority: 'High'
    },
    {
      title: 'AI Product Management Foundations',
      platform: 'edX',
      difficulty: 'Intermediate',
      duration: '6 Weeks',
      rating: 4.5,
      priority: 'Medium'
    },
    {
      title: 'Enterprise Scalability & Distributed Systems',
      platform: 'Coursera',
      difficulty: 'Advanced',
      duration: '3 Months',
      rating: 4.9,
      priority: 'Low'
    }
  ];

  return {
    careerMatches: careers,
    ikigai,
    roadmap,
    books,
    courses
  };
}
