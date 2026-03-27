export interface Event {
  id: string;
  title: string;
  type: 'class' | 'assignment' | 'recruiting' | 'social' | 'health' | 'personal';
  time: string;
  endTime?: string;
  location?: string;
  commute?: {
    distance: string;
    duration: string;
    mode: 'walk' | 'drive' | 'transit';
  };
  priority: 'high' | 'medium' | 'low';
  isHardBlock?: boolean;
  color: string;
}

export interface HealthData {
  sleep: number;
  sleepQuality: 'good' | 'fair' | 'poor';
  recovery: number;
  steps: number;
  stepsGoal: number;
  hrv: number;
  stress: 'low' | 'moderate' | 'high';
  lastWorkout?: string;
  hydration: number;
}

export interface Contact {
  id: string;
  name: string;
  company: string;
  role: string;
  email: string;
  avatar?: string;
  lastMeeting?: string;
  nextMeeting?: string;
  notes: string[];
  tags: string[];
  priority: 'hot' | 'warm' | 'cold';
}

export interface Assignment {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  dueTime: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
  estimatedHours: number;
}

export const todayEvents: Event[] = [
  {
    id: '1',
    title: 'Strategy & Competition',
    type: 'class',
    time: '9:00 AM',
    endTime: '10:30 AM',
    location: 'Aldrich Hall 112',
    commute: { distance: '0.3 mi', duration: '5 min', mode: 'walk' },
    priority: 'high',
    isHardBlock: true,
    color: '#7C3AED',
  },
  {
    id: '2',
    title: 'Coffee Chat - Sarah (McKinsey)',
    type: 'recruiting',
    time: '11:00 AM',
    endTime: '11:45 AM',
    location: 'Spangler Café',
    commute: { distance: '0.1 mi', duration: '2 min', mode: 'walk' },
    priority: 'high',
    color: '#F59E0B',
  },
  {
    id: '3',
    title: 'Finance Case Prep',
    type: 'assignment',
    time: '1:00 PM',
    endTime: '3:00 PM',
    location: 'Baker Library',
    commute: { distance: '0.2 mi', duration: '4 min', mode: 'walk' },
    priority: 'high',
    color: '#7C3AED',
  },
  {
    id: '4',
    title: 'Gym - Cardio Day',
    type: 'health',
    time: '4:00 PM',
    endTime: '5:00 PM',
    location: 'Shad Hall Fitness',
    commute: { distance: '0.4 mi', duration: '7 min', mode: 'walk' },
    priority: 'medium',
    color: '#10B981',
  },
  {
    id: '5',
    title: 'Section Dinner',
    type: 'social',
    time: '7:00 PM',
    endTime: '9:00 PM',
    location: 'Legal Sea Foods',
    commute: { distance: '2.1 mi', duration: '12 min', mode: 'drive' },
    priority: 'medium',
    color: '#EC4899',
  },
];

export const healthData: HealthData = {
  sleep: 6.5,
  sleepQuality: 'fair',
  recovery: 68,
  steps: 4250,
  stepsGoal: 10000,
  hrv: 45,
  stress: 'moderate',
  lastWorkout: 'Yesterday - 45min run',
  hydration: 5,
};

export const contacts: Contact[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    company: 'McKinsey & Company',
    role: 'Associate Partner',
    email: 'sarah.chen@mckinsey.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    lastMeeting: '2 days ago',
    nextMeeting: 'Today, 11:00 AM',
    notes: ['Interested in tech practice', 'Met at HBS recruiting event', 'She mentioned a new project in AI'],
    tags: ['Consulting', 'Tech', 'Referral Possible'],
    priority: 'hot',
  },
  {
    id: '2',
    name: 'Michael Rodriguez',
    company: 'Goldman Sachs',
    role: 'VP, Investment Banking',
    email: 'm.rodriguez@gs.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    lastMeeting: '1 week ago',
    notes: ['HBS alum 2019', 'Prefers morning calls', 'Offered to intro to MD'],
    tags: ['Finance', 'IB', 'Alum'],
    priority: 'warm',
  },
  {
    id: '3',
    name: 'Emily Watson',
    company: 'Google',
    role: 'Product Manager',
    email: 'emily.w@google.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    lastMeeting: '3 days ago',
    notes: ['Discussed PM track', 'She recommends APM program', 'Follow up on referral'],
    tags: ['Tech', 'PM', 'APM'],
    priority: 'hot',
  },
  {
    id: '4',
    name: 'James Park',
    company: 'Sequoia Capital',
    role: 'Principal',
    email: 'jpark@sequoia.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    lastMeeting: '2 weeks ago',
    notes: ['Met at VC panel', 'Interested in my startup experience'],
    tags: ['VC', 'Startup'],
    priority: 'warm',
  },
];

export const assignments: Assignment[] = [
  {
    id: '1',
    title: 'Strategy Case Write-up',
    course: 'Strategy & Competition',
    dueDate: 'Tomorrow',
    dueTime: '11:59 PM',
    priority: 'high',
    status: 'in_progress',
    estimatedHours: 3,
  },
  {
    id: '2',
    title: 'Finance Problem Set 4',
    course: 'Corporate Finance',
    dueDate: 'In 3 days',
    dueTime: '5:00 PM',
    priority: 'medium',
    status: 'pending',
    estimatedHours: 4,
  },
  {
    id: '3',
    title: 'Marketing Group Project',
    course: 'Marketing Strategy',
    dueDate: 'In 5 days',
    dueTime: '9:00 AM',
    priority: 'medium',
    status: 'pending',
    estimatedHours: 6,
  },
];

export const insights = [
  {
    id: '1',
    type: 'health' as const,
    title: 'Hey, your sleep was kinda rough last night 😴',
    message: "6.5 hours isn't ideal. I've moved your deep work session to tomorrow when you'll be sharper. Maybe grab that 20-min power nap after lunch?",
    action: 'View adjusted schedule',
    priority: 'high',
  },
  {
    id: '2',
    type: 'recruiting' as const,
    title: 'Coffee chat with Sarah in 2 hours ☕',
    message: "Quick reminder: She's at McKinsey's tech practice. Last time you talked about AI healthcare. I've pulled up your notes!",
    action: 'View prep notes',
    priority: 'high',
  },
  {
    id: '3',
    type: 'grades' as const,
    title: 'Strategy case due tomorrow 📚',
    message: "You've got a 2-hour block this afternoon for case prep. Based on your pace, that should be enough. You got this!",
    action: 'Start focus session',
    priority: 'medium',
  },
  {
    id: '4',
    type: 'social' as const,
    title: 'Section dinner tonight! 🍽️',
    message: "Legal Sea Foods at 7pm. It's about 12 min by car. Heads up - parking can be tricky, maybe Uber?",
    action: 'Get directions',
    priority: 'low',
  },
];

export type Priority = 'grades' | 'health' | 'recruiting' | 'social';

export const priorityOptions: { id: Priority; label: string; emoji: string; description: string; color: string }[] = [
  {
    id: 'grades',
    label: 'Academics',
    emoji: '📚',
    description: 'Classes, assignments, case prep',
    color: '#7C3AED',
  },
  {
    id: 'health',
    label: 'Health & Wellness',
    emoji: '💪',
    description: 'Sleep, workouts, mental health',
    color: '#10B981',
  },
  {
    id: 'recruiting',
    label: 'Recruiting',
    emoji: '💼',
    description: 'Coffee chats, interviews, networking',
    color: '#F59E0B',
  },
  {
    id: 'social',
    label: 'Social Life',
    emoji: '🎉',
    description: 'Friends, events, section activities',
    color: '#EC4899',
  },
];
