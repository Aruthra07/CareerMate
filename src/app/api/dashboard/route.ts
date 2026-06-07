import { NextRequest, NextResponse } from 'next/server';
import { prisma, mockDbStore } from '@/lib/db';
import { verifyJWT } from '@/lib/jwt';

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
    const { action, payload } = body;

    if (!action) {
      return NextResponse.json({ error: 'Missing action' }, { status: 400 });
    }

    // --- ADD STUDY TASK ---
    if (action === 'add-task') {
      const { title, date, type, durationMinutes } = payload;
      let newTask;

      try {
        newTask = await prisma.studyTask.create({
          data: {
            userId: user.userId,
            title,
            date,
            type: type || 'DAILY',
            durationMinutes: durationMinutes || 0,
            isCompleted: false,
          },
        });
      } catch (dbErr) {
        console.warn('Database error, writing study task to mock store');
        newTask = {
          id: 'mock-task-' + Math.random().toString(36).substring(2, 9),
          userId: user.userId,
          title,
          date,
          type: type || 'DAILY',
          durationMinutes: durationMinutes || 0,
          isCompleted: false,
          createdAt: new Date(),
        };
        mockDbStore.studyTasks.push(newTask);
      }
      return NextResponse.json({ success: true, task: newTask });
    }

    // --- TOGGLE STUDY TASK ---
    if (action === 'toggle-task') {
      const { id, isCompleted } = payload;
      let updatedTask;

      try {
        updatedTask = await prisma.studyTask.update({
          where: { id },
          data: { isCompleted },
        });
      } catch (dbErr) {
        console.warn('Database error, toggling task in mock store');
        const task = mockDbStore.studyTasks.find(t => t.id === id);
        if (task) {
          task.isCompleted = isCompleted;
          updatedTask = task;
        }
      }
      return NextResponse.json({ success: true, task: updatedTask });
    }

    // --- ADD STUDY METRIC (LOG HOURS) ---
    if (action === 'log-hours') {
      const { hours, skills, courses, books, certs, date } = payload;
      let newMetric;

      try {
        newMetric = await prisma.studyMetric.create({
          data: {
            userId: user.userId,
            hoursStudied: parseFloat(hours) || 0.0,
            skillsLearned: parseInt(skills) || 0,
            coursesCompleted: parseInt(courses) || 0,
            booksRead: parseInt(books) || 0,
            certsEarned: parseInt(certs) || 0,
            date: date || new Date().toISOString().split('T')[0],
          },
        });
      } catch (dbErr) {
        console.warn('Database error, logging metric in mock store');
        newMetric = {
          id: 'mock-metric-' + Math.random().toString(36).substring(2, 9),
          userId: user.userId,
          hoursStudied: parseFloat(hours) || 0.0,
          skillsLearned: parseInt(skills) || 0,
          coursesCompleted: parseInt(courses) || 0,
          booksRead: parseInt(books) || 0,
          certsEarned: parseInt(certs) || 0,
          date: date || new Date().toISOString().split('T')[0],
          createdAt: new Date(),
        };
        mockDbStore.studyMetrics.push(newMetric);
      }
      return NextResponse.json({ success: true, metric: newMetric });
    }

    // --- SEND COACH CHAT MESSAGE ---
    if (action === 'coach-chat') {
      const { message, history } = payload;
      
      // Save User Message
      try {
        await prisma.chatHistory.create({
          data: { userId: user.userId, role: 'user', message },
        });
      } catch (dbErr) {
        mockDbStore.chats.push({ userId: user.userId, role: 'user', message, createdAt: new Date() });
      }

      // Generate simulated AI Coach response based on bio/profile matching
      let aiResponse = "I'm reviewing your profile. Focus on finalizing your AWS Certification this month and building your portfolio project. That will build the 'career capital' you need.";
      const msgLower = message.toLowerCase();

      if (msgLower.includes('skill') || msgLower.includes('learn')) {
        aiResponse = "Based on your Career Blueprint, I recommend mastering CSS Grid & Tailwind CSS in the next 14 days, followed by learning basic Git branching models. Let's aim to unlock 2 new skill badges this week!";
      } else if (msgLower.includes('stuck') || msgLower.includes('motivate') || msgLower.includes('tired')) {
        aiResponse = "It is normal to hit a wall. Take a 20-minute break, log out of socials, and return for a short 25-minute Pomodoro study block. Consistency beats intensity. You have got this!";
      } else if (msgLower.includes('job') || msgLower.includes('interview')) {
        aiResponse = "Let's work on resume optimization first. Make sure your GitHub link is in the header, and write dynamic description lines starting with action verbs (e.g., 'Architected...', 'Designed...').";
      }

      // Save Coach Response
      try {
        await prisma.chatHistory.create({
          data: { userId: user.userId, role: 'assistant', message: aiResponse },
        });
      } catch (dbErr) {
        mockDbStore.chats.push({ userId: user.userId, role: 'assistant', message: aiResponse, createdAt: new Date() });
      }

      return NextResponse.json({ success: true, reply: aiResponse });
    }

    // --- GET CHAT HISTORY ---
    if (action === 'get-chats') {
      let chats = [];
      try {
        chats = await prisma.chatHistory.findMany({
          where: { userId: user.userId },
          orderBy: { createdAt: 'asc' },
        });
      } catch (dbErr) {
        chats = mockDbStore.chats.filter(c => c.userId === user.userId);
      }
      return NextResponse.json({ success: true, chats });
    }

    // --- CREATE COMMUNITY POST ---
    if (action === 'create-post') {
      const { title, content, groupName } = payload;
      let newPost;

      try {
        newPost = await prisma.communityPost.create({
          data: {
            userId: user.userId,
            userName: user.name,
            title,
            content,
            groupName: groupName || 'Tech',
            comments: '[]',
          },
        });
      } catch (dbErr) {
        newPost = {
          id: 'mock-post-' + Math.random().toString(36).substring(2, 9),
          userId: user.userId,
          userName: user.name,
          title,
          content,
          groupName: groupName || 'Tech',
          likes: 0,
          comments: '[]',
          createdAt: new Date(),
        };
        mockDbStore.posts.push(newPost);
      }
      return NextResponse.json({ success: true, post: newPost });
    }

    // --- GET COMMUNITY POSTS ---
    if (action === 'get-posts') {
      let posts = [];
      try {
        posts = await prisma.communityPost.findMany({
          orderBy: { createdAt: 'desc' },
        });
      } catch (dbErr) {
        posts = [...mockDbStore.posts].reverse();
      }
      return NextResponse.json({ success: true, posts });
    }

    return NextResponse.json({ error: 'Action not found' }, { status: 400 });

  } catch (err: any) {
    console.error('Dashboard Action Error:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
