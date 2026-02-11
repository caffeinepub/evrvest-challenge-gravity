import { UserProfile, ExperienceLevel, SportFocus } from '../../backend';

export interface AIResponse {
  message: string;
  suggestions?: string[];
}

export function getLoadRecommendationResponse(profile: UserProfile | null): AIResponse {
  if (!profile) {
    return {
      message: "You need to complete your profile first. I can't give load recommendations without knowing your bodyweight and experience level."
    };
  }

  const basePercent = getExperiencePercent(profile.experienceLevel);
  const recommendedLoad = Math.round(profile.bodyweightKg * basePercent * 2) / 2;

  return {
    message: `Based on your ${profile.experienceLevel} level and ${profile.bodyweightKg}kg bodyweight, start with ${recommendedLoad}kg vest load. This is ${Math.round(basePercent * 100)}% of your bodyweight. Progress by 2-5% weekly if recovery is solid.`,
    suggestions: [
      'How do I progress load safely?',
      'What if the load feels too heavy?',
      'Tell me about deload weeks'
    ]
  };
}

export function getPlanCreationResponse(profile: UserProfile | null): AIResponse {
  if (!profile) {
    return {
      message: "Complete your profile first. I need to know your training frequency and goals to build a plan."
    };
  }

  const frequency = Number(profile.weeklyTrainingFrequency);
  
  if (frequency < 3) {
    return {
      message: `With ${frequency} sessions per week, focus on full-body workouts. Start with 2-3 compound movements per session. Vest load: 5-8% bodyweight. Build consistency before adding volume.`,
      suggestions: ['Show me beginner exercises', 'How long should sessions be?']
    };
  }

  if (frequency <= 4) {
    return {
      message: `${frequency} sessions per week is solid. Split: 2 upper, 2 lower. Vest load 8-12% bodyweight. Include one high-intensity day, one volume day per split. Recovery is critical.`,
      suggestions: ['What exercises for upper body?', 'How to structure lower body days?']
    };
  }

  return {
    message: `${frequency} sessions per week is high volume. Ensure you're managing fatigue. Consider: 3 strength, 2 conditioning, 1 active recovery. Vest load 10-15% bodyweight on strength days, 5-8% on conditioning.`,
    suggestions: ['How do I track recovery?', 'What are signs of overtraining?']
  };
}

export function getRecoveryAdviceResponse(experienceLevel: ExperienceLevel): AIResponse {
  const advice: Record<ExperienceLevel, string> = {
    [ExperienceLevel.beginner]: "Recovery is where you grow. Sleep 7-9 hours. Eat protein (1.6-2.2g/kg bodyweight). Take 1-2 full rest days per week. Don't chase soreness—chase performance.",
    [ExperienceLevel.intermediate]: "You know the basics. Now dial in: sleep quality over quantity, manage stress, track HRV if possible. Deload every 4-6 weeks. Active recovery beats full rest for most athletes.",
    [ExperienceLevel.advanced]: "Recovery is a skill. Periodize intensity. Use RPE to auto-regulate. Consider contrast therapy, massage, or mobility work. Monitor performance metrics—if numbers drop, back off.",
    [ExperienceLevel.elite]: "You're operating at the edge. Recovery is non-negotiable. Track sleep, HRV, readiness scores. Micro-dose deloads. Consider blood work quarterly. Performance > volume."
  };

  return {
    message: advice[experienceLevel],
    suggestions: ['What is RPE?', 'How often should I deload?', 'Tell me about nutrition']
  };
}

export function getTechniqueResponse(exerciseName?: string): AIResponse {
  if (!exerciseName) {
    return {
      message: "Technique is everything with vest training. The load amplifies bad patterns. Core principles: maintain neutral spine, control eccentric phase, breathe rhythmically, stop before form breaks.",
      suggestions: ['Push-up technique', 'Pull-up technique', 'Running form with vest']
    };
  }

  const techniques: Record<string, string> = {
    'push-up': "Vest push-ups: hands shoulder-width, rigid plank from head to heels. Lower chest to deck in 2 seconds, explode up in 1 second. If hips sag or shoulders shrug, reduce load or reps.",
    'pull-up': "Vest pull-ups: dead hang start, pull chin over bar, control down. Don't kip. If you can't maintain form, reduce vest load or use bands. Quality > quantity.",
    'running': "Running with vest: maintain natural stride, don't overstride. Vest should sit high and tight. Start with 50% normal distance. Monitor knee and ankle feedback. Stop if gait changes.",
    'lunge': "Vest lunges: torso vertical, front knee tracks over toe, back knee hovers. Drive through front heel. The vest challenges balance—go slow until stable.",
    'burpee': "Vest burpees: fast transitions but controlled landing. Chest to deck, explosive jump. If you're crashing down, reduce load. This is high-impact—respect it."
  };

  const key = exerciseName.toLowerCase();
  const matchedKey = Object.keys(techniques).find(k => key.includes(k));

  if (matchedKey) {
    return {
      message: techniques[matchedKey],
      suggestions: ['What if form breaks down?', 'How to progress this exercise?']
    };
  }

  return {
    message: "I don't have specific cues for that exercise yet. General rule: vest load amplifies everything. If form degrades, reduce load or reps. Control is king.",
    suggestions: ['Show me exercise catalog', 'General technique principles']
  };
}

export function getProductEducationResponse(): AIResponse {
  return {
    message: "EVRVEST is built for progressive overload. The weight is real. Start conservative, progress systematically. Use the load calculator, follow the plans, track your metrics. Challenge gravity.",
    suggestions: ['How does the load calculator work?', 'What are the training plans?', 'How to use the dashboard?']
  };
}

function getExperiencePercent(level: ExperienceLevel): number {
  switch (level) {
    case ExperienceLevel.beginner:
      return 0.06;
    case ExperienceLevel.intermediate:
      return 0.09;
    case ExperienceLevel.advanced:
      return 0.12;
    case ExperienceLevel.elite:
      return 0.15;
    default:
      return 0.06;
  }
}
