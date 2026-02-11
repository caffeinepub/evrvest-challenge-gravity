import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type UserId = Principal;
export type Time = bigint;
export interface NotificationSubscription {
    userId: UserId;
    notificationType: NotificationType;
    createdAt: Time;
}
export interface UserProfile {
    experienceLevel: ExperienceLevel;
    heightCm: number;
    userId: UserId;
    createdAt: Time;
    subscriptionTier: SubscriptionTier;
    annualDiscountEligible: boolean;
    bodyweightKg: number;
    recommendedLoadPercent: number;
    updatedAt: Time;
    goals: string;
    weeklyTrainingFrequency: bigint;
    sportFocus: SportFocus;
}
export enum ExperienceLevel {
    intermediate = "intermediate",
    beginner = "beginner",
    advanced = "advanced",
    elite = "elite"
}
export enum NotificationType {
    planUpdate = "planUpdate",
    newExercise = "newExercise",
    workoutReminder = "workoutReminder",
    challengeUpdate = "challengeUpdate"
}
export enum SportFocus {
    gym = "gym",
    bodyweight = "bodyweight",
    trail = "trail",
    hyrox = "hyrox",
    general = "general",
    rehab = "rehab",
    running = "running"
}
export enum SubscriptionTier {
    pro = "pro",
    free = "free",
    annualPro = "annualPro"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createProfile(bodyweightKg: number, heightCm: number, experienceLevel: ExperienceLevel, sportFocus: SportFocus, goals: string, weeklyTrainingFrequency: bigint): Promise<UserProfile>;
    deleteProfile(): Promise<void>;
    getAllUsers(): Promise<Array<UserProfile>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getSubscriptions(): Promise<Array<NotificationSubscription>>;
    getUserProfile(userId: UserId): Promise<UserProfile>;
    isAdmin(): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setUserTier(userId: UserId, tier: SubscriptionTier): Promise<string>;
    subscribe(notificationType: NotificationType): Promise<void>;
    unsubscribeAll(): Promise<void>;
    updateProfile(bodyweightKg: number, heightCm: number, experienceLevel: ExperienceLevel, sportFocus: SportFocus, goals: string, weeklyTrainingFrequency: bigint): Promise<UserProfile>;
    upgradeToPro(discountCode: string | null, tier: SubscriptionTier): Promise<UserProfile>;
}
