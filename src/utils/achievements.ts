import type { Achievement, UserProgress } from '../types';

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-node',
    title: 'First Step',
    description: 'Place your first component on the canvas',
    icon: '🌱',
    condition: (p) => p.totalNodesPlaced >= 1,
  },
  {
    id: 'ten-nodes',
    title: 'Architect in Training',
    description: 'Place 10 components total',
    icon: '🏗️',
    condition: (p) => p.totalNodesPlaced >= 10,
  },
  {
    id: 'fifty-nodes',
    title: 'Master Builder',
    description: 'Place 50 components total',
    icon: '🏰',
    condition: (p) => p.totalNodesPlaced >= 50,
  },
  {
    id: 'hundred-nodes',
    title: 'Legendary Architect',
    description: 'Place 100 components total',
    icon: '⛩️',
    condition: (p) => p.totalNodesPlaced >= 100,
  },
  {
    id: 'first-connection',
    title: 'Data Flows',
    description: 'Create your first connection',
    icon: '🔗',
    condition: (p) => p.totalConnectionsMade >= 1,
  },
  {
    id: 'ten-connections',
    title: 'Network Weaver',
    description: 'Create 10 connections total',
    icon: '🕸️',
    condition: (p) => p.totalConnectionsMade >= 10,
  },
  {
    id: 'fifty-connections',
    title: 'Web of Power',
    description: 'Create 50 connections total',
    icon: '⚡',
    condition: (p) => p.totalConnectionsMade >= 50,
  },
  {
    id: 'first-save',
    title: 'Prepared Ninja',
    description: 'Save your first design',
    icon: '💾',
    condition: (p) => p.totalDesignsSaved >= 1,
  },
  {
    id: 'first-challenge',
    title: 'Challenger',
    description: 'Complete your first challenge',
    icon: '🎯',
    condition: (p) => p.completedChallenges.length >= 1,
  },
  {
    id: 'three-challenges',
    title: 'Rising Star',
    description: 'Complete 3 challenges',
    icon: '⭐',
    condition: (p) => p.completedChallenges.length >= 3,
  },
  {
    id: 'all-challenges',
    title: 'Grand Master',
    description: 'Complete all challenges',
    icon: '👑',
    condition: (p) => p.completedChallenges.length >= 6,
  },
  {
    id: 'level-5',
    title: 'Jonin Rank',
    description: 'Reach level 5',
    icon: '🥷',
    condition: (p) => p.level >= 5,
  },
  {
    id: 'level-10',
    title: 'Hokage',
    description: 'Reach the maximum level',
    icon: '🔥',
    condition: (p) => p.level >= 10,
  },
];

export function checkNewAchievements(progress: UserProgress): Achievement[] {
  return ACHIEVEMENTS.filter(a =>
    !progress.achievements.includes(a.id) && a.condition(progress)
  );
}
