import { UserProfile, ExperienceLevel } from '../../backend';
import {
  getLoadRecommendationResponse,
  getPlanCreationResponse,
  getRecoveryAdviceResponse,
  getTechniqueResponse,
  getProductEducationResponse,
  type AIResponse
} from './knowledge';

export function generateAIResponse(message: string, profile: UserProfile | null): AIResponse {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('load') || lowerMessage.includes('weight') || lowerMessage.includes('how much')) {
    return getLoadRecommendationResponse(profile);
  }

  if (lowerMessage.includes('plan') || lowerMessage.includes('program') || lowerMessage.includes('routine')) {
    return getPlanCreationResponse(profile);
  }

  if (lowerMessage.includes('recover') || lowerMessage.includes('rest') || lowerMessage.includes('sleep') || lowerMessage.includes('sore')) {
    return getRecoveryAdviceResponse(profile?.experienceLevel || ExperienceLevel.beginner);
  }

  if (lowerMessage.includes('technique') || lowerMessage.includes('form') || lowerMessage.includes('how to')) {
    const exerciseMatch = lowerMessage.match(/(push-?up|pull-?up|running|run|lunge|burpee|squat)/);
    return getTechniqueResponse(exerciseMatch?.[1]);
  }

  if (lowerMessage.includes('product') || lowerMessage.includes('evrvest') || lowerMessage.includes('app') || lowerMessage.includes('feature')) {
    return getProductEducationResponse();
  }

  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return {
      message: "I'm GravityAI. Direct. Athletic. Performance-focused. Ask me about load recommendations, plan creation, recovery, technique, or product features.",
      suggestions: ['Recommend my starting load', 'Help me build a plan', 'Recovery advice']
    };
  }

  return {
    message: "I can help with: load recommendations, plan creation, recovery advice, exercise technique, and product education. What do you need?",
    suggestions: ['Recommend my starting load', 'Help me build a plan', 'Recovery advice', 'Technique tips']
  };
}
