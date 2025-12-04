"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import NavBar from "@/components/NavBar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Award, TrendingUp, Utensils, MessageSquare, User } from "lucide-react";
import Link from "next/link";

interface UserProfile {
  age: number;
  gender: string;
  height: number;
  weight: number;
  activityLevel: string;
  healthGoal: string;
  targetWeight?: number;
  dietaryPreference: string;
}

interface DailyNutrition {
  date: string;
  caloriesConsumed: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  waterMl: number;
}

interface MealPlan {
  id: number;
  name: string;
  description: string;
  targetCalories: number;
  isActive: boolean;
}

interface Achievement {
  id: number;
  title: string;
  description: string;
  earnedAt: string;
}

export default function DashboardPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [todayNutrition, setTodayNutrition] = useState<DailyNutrition | null>(null);
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (session?.user) {
      fetchDashboardData();
    }
  }, [session]);

  const fetchDashboardData = async () => {
    const token = localStorage.getItem("bearer_token");
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    try {
      // Fetch profile
      const profileRes = await fetch(`/api/profile?userId=${session?.user?.id}`, { headers });
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setProfile(profileData);
      }

      // Fetch today's nutrition
      const today = new Date().toISOString().split("T")[0];
      const nutritionRes = await fetch(`/api/nutrition/daily?userId=${session?.user?.id}&date=${today}`, { headers });
      if (nutritionRes.ok) {
        const nutritionData = await nutritionRes.json();
        setTodayNutrition(nutritionData);
      }

      // Fetch meal plans
      const mealPlansRes = await fetch(`/api/meal-plans?userId=${session?.user?.id}`, { headers });
      if (mealPlansRes.ok) {
        const mealPlansData = await mealPlansRes.json();
        setMealPlans(mealPlansData);
      }

      // Fetch achievements
      const achievementsRes = await fetch(`/api/achievements?userId=${session?.user?.id}&limit=5`, { headers });
      if (achievementsRes.ok) {
        const achievementsData = await achievementsRes.json();
        setAchievements(achievementsData);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (isPending || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <NavBar />
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-10 w-64 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!session?.user) return null;

  const activeMealPlan = mealPlans.find((plan) => plan.isActive);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {session.user.name}!</h1>
          <p className="text-muted-foreground">Here's your nutrition overview for today</p>
        </div>

        {!profile && (
          <Card className="mb-6 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Complete Your Profile
              </CardTitle>
              <CardDescription>
                Set up your health profile to get personalized meal plans and AI recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/profile">
                <Button>Set Up Profile</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Today's Nutrition */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Today's Nutrition
              </CardTitle>
            </CardHeader>
            <CardContent>
              {todayNutrition ? (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Calories:</span>
                    <span className="font-semibold">{todayNutrition.caloriesConsumed} kcal</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Protein:</span>
                    <span className="font-semibold">{todayNutrition.proteinG}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Carbs:</span>
                    <span className="font-semibold">{todayNutrition.carbsG}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Fat:</span>
                    <span className="font-semibold">{todayNutrition.fatG}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Water:</span>
                    <span className="font-semibold">{todayNutrition.waterMl}ml</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground mb-4">No data logged today</p>
                  <Button size="sm">Log Nutrition</Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Active Meal Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Utensils className="h-5 w-5" />
                Active Meal Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activeMealPlan ? (
                <div>
                  <h3 className="font-semibold mb-2">{activeMealPlan.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{activeMealPlan.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Target: {activeMealPlan.targetCalories} kcal</span>
                    <Button size="sm" variant="outline">View Plan</Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground mb-4">No active meal plan</p>
                  <Button size="sm">Browse Plans</Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/chat">
                <Button className="w-full justify-start" variant="outline">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Chat with AI Nutritionist
                </Button>
              </Link>
              <Button className="w-full justify-start" variant="outline">
                <TrendingUp className="mr-2 h-4 w-4" />
                View Progress
              </Button>
              <Link href="/profile">
                <Button className="w-full justify-start" variant="outline">
                  <User className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Achievements */}
          <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              {achievements.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {achievements.map((achievement) => (
                    <div key={achievement.id} className="flex items-start gap-3 p-4 border rounded-lg">
                      <Award className="h-8 w-8 text-yellow-500 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold">{achievement.title}</h4>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(achievement.earnedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  Start logging your nutrition to earn achievements!
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
