"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Apple, Brain, TrendingUp, Award, MessageSquare, Utensils } from "lucide-react";

export default function Home() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user && !isPending) {
      router.push("/dashboard");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <NavBar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }

  if (session?.user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <NavBar />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="flex justify-center mb-6">
          <Apple className="h-20 w-20 text-green-600" />
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          Your AI-Powered Nutrition Coach
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Personalized meal plans, smart nutrition tracking, and AI-powered guidance to help you achieve your health goals.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/register">
            <Button size="lg" className="text-lg px-8">
              Get Started Free
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="text-lg px-8">
              Sign In
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Everything You Need to Succeed</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <Brain className="h-10 w-10 text-green-600 mb-2" />
              <CardTitle>AI Nutritionist</CardTitle>
              <CardDescription>
                Chat with our AI coach for personalized nutrition advice based on your goals and preferences
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Utensils className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Custom Meal Plans</CardTitle>
              <CardDescription>
                Get tailored meal plans that match your dietary preferences, allergies, and health goals
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <TrendingUp className="h-10 w-10 text-purple-600 mb-2" />
              <CardTitle>Progress Tracking</CardTitle>
              <CardDescription>
                Track calories, macros, water intake, and visualize your progress over time
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Award className="h-10 w-10 text-yellow-600 mb-2" />
              <CardTitle>Achievements</CardTitle>
              <CardDescription>
                Stay motivated with achievements and streaks as you build healthy habits
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <MessageSquare className="h-10 w-10 text-pink-600 mb-2" />
              <CardTitle>Chat History</CardTitle>
              <CardDescription>
                Your AI coach remembers your preferences and previous conversations for better advice
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Apple className="h-10 w-10 text-red-600 mb-2" />
              <CardTitle>Multi-Diet Support</CardTitle>
              <CardDescription>
                Support for vegetarian, vegan, keto, paleo, Mediterranean, and more dietary preferences
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white border-0">
          <CardContent className="py-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Nutrition?</h2>
            <p className="text-lg mb-8 opacity-90">
              Join thousands of users achieving their health goals with personalized AI guidance
            </p>
            <Link href="/register">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Start Your Journey Today
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2024 NutriAI. Your personalized nutrition companion.</p>
        </div>
      </footer>
    </div>
  );
}