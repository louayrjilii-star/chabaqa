export type {
  ActivityItem,
  Community,
  ContentItem,
  KpiCard,
  OnboardStep,
  TrendDir,
} from './dashboard-types'

import type { KpiCard, ActivityItem, ContentItem } from './dashboard-types'

export const kpiCards: KpiCard[] = [
  {
    label: 'Total Members',
    value: '23',
    trend: '→ 0% from last month',
    trendDir: 'flat',
    iconColor: '#2a5cff',
    iconBg: '#eef1ff',
    icon: 'users',
  },
  {
    label: 'Total Courses',
    value: '1',
    trend: '→ 0% from last month',
    trendDir: 'flat',
    iconColor: '#1a7a4a',
    iconBg: '#eaf5ee',
    icon: 'book',
  },
  {
    label: 'Total Challenges',
    value: '1',
    trend: '↑ +100% from last month',
    trendDir: 'up',
    iconColor: '#8a5a00',
    iconBg: '#fef6e4',
    icon: 'bolt',
  },
  {
    label: 'Total Sessions',
    value: '0',
    trend: '— No sessions yet',
    trendDir: 'flat',
    iconColor: '#9a9890',
    iconBg: '#f5f4f0',
    icon: 'calendar',
  },
  {
    label: 'Total Revenue',
    value: '395.95',
    trend: '↑ +246% from last month',
    trendDir: 'up',
    iconColor: '#1a7a4a',
    iconBg: '#eaf5ee',
    icon: 'dollar',
  },
  {
    label: 'Avg. Engagement',
    value: '99%',
    trend: '↓ -4% from last month',
    trendDir: 'down',
    iconColor: '#2a5cff',
    iconBg: '#eef1ff',
    icon: 'pulse',
  },
]

export const activityItems: ActivityItem[] = [
  {
    type: 'challenge',
    label: 'New Challenge',
    name: 'rigging animation — 🏆 تحدي الـ ٧ أيام',
    time: '14 days ago',
  },
  {
    type: 'course',
    label: 'New Course',
    name: 'موشن غرافيك و أنيماشين',
    time: '20 days ago · 26 Feb at 15:46',
  },
]

export const contentItems: ContentItem[] = [
  {
    emoji: '🎬',
    name: 'موشن غرافيك و أنيماشين',
    type: 'Course',
    enrollPrompt: 'No students yet',
  },
  {
    emoji: '🏆',
    name: 'rigging animation — تحدي الـ ٧ أيام',
    type: 'Challenge',
    enrollPrompt: '0 participants',
  },
]
