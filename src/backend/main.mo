import Map "mo:core/Map";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import List "mo:core/List";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Types
  type UserId = Principal;
  type AdminId = Principal;

  type ExperienceLevel = {
    #beginner;
    #intermediate;
    #advanced;
    #elite;
  };

  type SportFocus = {
    #hyrox;
    #bodyweight;
    #running;
    #trail;
    #gym;
    #rehab;
    #general;
  };

  type SubscriptionTier = {
    #free;
    #pro;
    #annualPro;
  };

  type UserProfile = {
    userId : UserId;
    bodyweightKg : Float;
    heightCm : Float;
    experienceLevel : ExperienceLevel;
    sportFocus : SportFocus;
    goals : Text;
    weeklyTrainingFrequency : Nat;
    recommendedLoadPercent : Float;
    subscriptionTier : SubscriptionTier;
    annualDiscountEligible : Bool;
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  let users = Map.empty<UserId, UserProfile>();

  // Helper Functions
  func getCurrentTime() : Time.Time {
    Time.now();
  };

  // User Profile Functions
  public shared ({ caller }) func createProfile(
    bodyweightKg : Float,
    heightCm : Float,
    experienceLevel : ExperienceLevel,
    sportFocus : SportFocus,
    goals : Text,
    weeklyTrainingFrequency : Nat
  ) : async UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can create profiles");
    };

    let userId = caller;

    switch (users.get(userId)) {
      case (?_) { Runtime.trap("Profile already exists. Use update function instead") };
      case (null) {};
    };

    let recommendedLoadPercent = switch (experienceLevel) {
      case (#beginner) { 5.0 };
      case (#intermediate) { 8.0 };
      case (#advanced) { 10.0 };
      case (#elite) { 15.0 };
    };

    let profile : UserProfile = {
      userId;
      bodyweightKg;
      heightCm;
      experienceLevel;
      sportFocus;
      goals;
      weeklyTrainingFrequency;
      recommendedLoadPercent;
      subscriptionTier = #free;
      annualDiscountEligible = false;
      createdAt = getCurrentTime();
      updatedAt = Time.now();
    };

    users.add(userId, profile);
    profile;
  };

  public shared ({ caller }) func updateProfile(
    bodyweightKg : Float,
    heightCm : Float,
    experienceLevel : ExperienceLevel,
    sportFocus : SportFocus,
    goals : Text,
    weeklyTrainingFrequency : Nat
  ) : async UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update profiles");
    };

    let userId = caller;

    switch (users.get(userId)) {
      case (null) { Runtime.trap("Profile does not exist. Please create profile.") };
      case (?existingProfile) {
        let recommendedLoadPercent = switch (experienceLevel) {
          case (#beginner) { 5.0 };
          case (#intermediate) { 8.0 };
          case (#advanced) { 10.0 };
          case (#elite) { 15.0 };
        };

        let updatedProfile : UserProfile = {
          userId;
          bodyweightKg;
          heightCm;
          experienceLevel;
          sportFocus;
          goals;
          weeklyTrainingFrequency;
          recommendedLoadPercent;
          subscriptionTier = existingProfile.subscriptionTier;
          annualDiscountEligible = existingProfile.annualDiscountEligible;
          createdAt = existingProfile.createdAt;
          updatedAt = Time.now();
        };

        users.add(userId, updatedProfile);
        updatedProfile;
      };
    };
  };

  // Required frontend functions per instructions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    users.get(caller);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    
    // Ensure user can only save their own profile
    if (profile.userId != caller) {
      Runtime.trap("Unauthorized: Can only save your own profile");
    };

    users.add(caller, profile);
  };

  // Subscription Management
  public shared ({ caller }) func upgradeToPro(
    discountCode : ?Text,
    tier : SubscriptionTier,
  ) : async UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can upgrade subscription");
    };

    let userId = caller;

    let profile = switch (users.get(userId)) {
      case (null) { Runtime.trap("Profile not found") };
      case (?p) { p };
    };

    let isAnnual = switch (tier) {
      case (#annualPro) { true };
      case (_) { false };
    };

    let updatedProfile : UserProfile = {
      userId = profile.userId;
      bodyweightKg = profile.bodyweightKg;
      heightCm = profile.heightCm;
      experienceLevel = profile.experienceLevel;
      sportFocus = profile.sportFocus;
      goals = profile.goals;
      weeklyTrainingFrequency = profile.weeklyTrainingFrequency;
      recommendedLoadPercent = profile.recommendedLoadPercent;
      subscriptionTier = tier;
      annualDiscountEligible = isAnnual;
      createdAt = profile.createdAt;
      updatedAt = Time.now();
    };

    users.add(userId, updatedProfile);
    updatedProfile;
  };

  // Admin Functions
  public shared ({ caller }) func setUserTier(userId : UserId, tier : SubscriptionTier) : async Text {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can update user tiers");
    };

    switch (users.get(userId)) {
      case (null) { Runtime.trap("User not found") };
      case (?profile) {
        let isAnnual = switch (tier) {
          case (#annualPro) { true };
          case (_) { false };
        };

        let updatedProfile : UserProfile = {
          userId = profile.userId;
          bodyweightKg = profile.bodyweightKg;
          heightCm = profile.heightCm;
          experienceLevel = profile.experienceLevel;
          sportFocus = profile.sportFocus;
          goals = profile.goals;
          weeklyTrainingFrequency = profile.weeklyTrainingFrequency;
          recommendedLoadPercent = profile.recommendedLoadPercent;
          subscriptionTier = tier;
          annualDiscountEligible = isAnnual;
          createdAt = profile.createdAt;
          updatedAt = Time.now();
        };

        users.add(userId, updatedProfile);
        "User subscription tier updated successfully";
      };
    };
  };

  // Query Functions
  module UserProfile {
    public func compare(a : UserProfile, b : UserProfile) : Order.Order {
      Text.compare(a.userId.toText(), b.userId.toText());
    };
  };

  public query ({ caller }) func getUserProfile(userId : UserId) : async UserProfile {
    // Users can only view their own profile, admins can view any profile
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };

    switch (users.get(userId)) {
      case (null) { Runtime.trap("User profile not found") };
      case (?profile) { profile };
    };
  };

  public query ({ caller }) func getAllUsers() : async [UserProfile] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can view all users");
    };

    users.values().toArray().sort();
  };

  // Delete Profile
  public shared ({ caller }) func deleteProfile() : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can delete profiles");
    };

    if (users.containsKey(caller)) {
      users.remove(caller);
    } else {
      Runtime.trap("Profile does not exist");
    };
  };

  public query ({ caller }) func isAdmin() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };

  // Subscribe for notifications (simulation)
  type NotificationType = {
    #workoutReminder;
    #challengeUpdate;
    #newExercise;
    #planUpdate;
  };

  type NotificationSubscription = {
    userId : UserId;
    notificationType : NotificationType;
    createdAt : Time.Time;
  };

  let subscriptions = Map.empty<UserId, List.List<NotificationSubscription>>();

  public shared ({ caller }) func subscribe(notificationType : NotificationType) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can subscribe to notifications");
    };

    let subscription : NotificationSubscription = {
      userId = caller;
      notificationType;
      createdAt = getCurrentTime();
    };

    let existingSubscriptions = switch (subscriptions.get(caller)) {
      case (null) { List.empty<NotificationSubscription>() };
      case (?subs) { subs };
    };

    existingSubscriptions.add(subscription);
    subscriptions.add(caller, existingSubscriptions);
  };

  public query ({ caller }) func getSubscriptions() : async [NotificationSubscription] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view subscriptions");
    };

    switch (subscriptions.get(caller)) {
      case (null) { [] };
      case (?subs) { subs.toArray() };
    };
  };

  public shared ({ caller }) func unsubscribeAll() : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can unsubscribe");
    };

    subscriptions.remove(caller);
  };
};
