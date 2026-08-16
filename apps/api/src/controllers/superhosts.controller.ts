import { Request, Response } from 'express';
import { prisma } from '@itvara/db';
import { MentorshipTopic } from '@itvara/db';
import { randomUUID } from 'crypto';

export const getMentors = async (req: Request, res: Response) => {
  try {
    const superhosts = await prisma.user.findMany({
      where: {
        role: 'SUPERHOST'
      },
      select: {
        id: true,
        name: true,
        profilePhoto: true,
        bio: true,
        hometown: true,
        createdAt: true,
      }
    });

    return res.status(200).json({ success: true, data: superhosts });
  } catch (error) {
    console.error('Error fetching mentors:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const requestSession = async (req: Request, res: Response) => {
  try {
    const aspiringHostId = (req as any).user.userId;
    const { superhostId, scheduledAt, topic, notes } = req.body;

    if (!superhostId || !scheduledAt || !topic) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    // Verify the mentor is actually a SUPERHOST
    const mentor = await prisma.user.findUnique({
      where: { id: superhostId }
    });

    if (!mentor || mentor.role !== 'SUPERHOST') {
      return res.status(400).json({ success: false, error: 'Invalid mentor selected' });
    }

    const sessionDate = new Date(scheduledAt);

    const session = await prisma.superhostMentorshipSession.create({
      data: {
        superhostId,
        aspiringHostId,
        scheduledAt: sessionDate,
        topic: topic as MentorshipTopic,
        notes: notes || null,
        status: 'SCHEDULED'
      }
    });

    // Generate .ics calendar invite content
    const startTime = sessionDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const endTimeObj = new Date(sessionDate.getTime() + 60 * 60 * 1000); // 1 hour session
    const endTime = endTimeObj.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const uid = randomUUID();

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Itvara//Ask a Superhost//EN
BEGIN:VEVENT
UID:${uid}
DTSTAMP:${startTime}
DTSTART:${startTime}
DTEND:${endTime}
SUMMARY:Itvara Mentorship Session: ${topic.replace('_', ' ')}
DESCRIPTION:1-on-1 session with Superhost ${mentor.name}. Notes: ${notes || 'None'}
END:VEVENT
END:VCALENDAR`;

    return res.status(201).json({ 
      success: true, 
      data: {
        session,
        icsContent
      }
    });
  } catch (error) {
    console.error('Error requesting mentorship session:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};
