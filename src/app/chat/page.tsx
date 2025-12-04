"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import NavBar from "@/components/NavBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, Send, Bot } from "lucide-react";

interface Message {
  id: number;
  role: "user" | "assistant";
  message: string;
  createdAt: string;
}

export default function ChatPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (session?.user) {
      fetchChatHistory();
    }
  }, [session]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchChatHistory = async () => {
    const token = localStorage.getItem("bearer_token");
    try {
      const res = await fetch(`/api/chat-history?userId=${session?.user?.id}&limit=50`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data.reverse());
      }
    } catch (error) {
      console.error("Error fetching chat history:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sending) return;

    const userMessage = input.trim();
    setInput("");
    setSending(true);

    // Add user message to UI immediately
    const tempUserMessage: Message = {
      id: Date.now(),
      role: "user",
      message: userMessage,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMessage]);

    const token = localStorage.getItem("bearer_token");

    try {
      // Save user message
      await fetch("/api/chat-history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: "user", message: userMessage }),
      });

      // Get AI response (simulated for now - you can integrate with OpenAI later)
      const aiResponse = await generateAIResponse(userMessage);

      // Add AI response to UI
      const tempAIMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        message: aiResponse,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, tempAIMessage]);

      // Save AI response
      await fetch("/api/chat-history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: "assistant", message: aiResponse }),
      });
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    // Simulated AI responses based on keywords
    // In production, integrate with OpenAI or your preferred AI service
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes("protein") || lowerMessage.includes("muscle")) {
      return "For muscle building, aim for 1.6-2.2g of protein per kg of body weight daily. Great sources include lean meats, fish, eggs, Greek yogurt, and legumes. Spread protein intake throughout the day for optimal muscle synthesis.";
    } else if (lowerMessage.includes("weight loss") || lowerMessage.includes("lose weight")) {
      return "Weight loss requires a caloric deficit while maintaining proper nutrition. Focus on whole foods, lean proteins, vegetables, and complex carbs. Aim for a deficit of 300-500 calories daily for sustainable loss. Stay hydrated and track your progress!";
    } else if (lowerMessage.includes("carb") || lowerMessage.includes("carbohydrate")) {
      return "Carbohydrates are your body's primary energy source. Choose complex carbs like whole grains, oats, quinoa, and sweet potatoes over refined options. Time carbs around workouts for best energy and recovery.";
    } else if (lowerMessage.includes("water") || lowerMessage.includes("hydration")) {
      return "Hydration is crucial for metabolism and overall health. Aim for at least 2-2.5 liters daily, more if you're active. Water helps with digestion, nutrient absorption, and can reduce false hunger signals.";
    } else if (lowerMessage.includes("meal plan") || lowerMessage.includes("diet plan")) {
      return "A good meal plan should align with your goals, dietary preferences, and lifestyle. I can help create a personalized plan! Could you tell me more about your health goals and any dietary restrictions?";
    } else if (lowerMessage.includes("vegetarian") || lowerMessage.includes("vegan")) {
      return "Plant-based diets can be very healthy! Focus on varied protein sources like legumes, tofu, tempeh, quinoa, and nuts. Ensure adequate B12, iron, and omega-3s. Consider fortified foods or supplements for optimal nutrition.";
    } else if (lowerMessage.includes("diabetes")) {
      return "Managing diabetes through diet involves controlling carb portions, choosing low glycemic foods, and eating regular meals. Focus on fiber-rich foods, lean proteins, and healthy fats. Monitor blood sugar and work with your healthcare team.";
    } else {
      return "I'm here to help with your nutrition questions! I can provide guidance on meal planning, macronutrients, dietary preferences, weight management, and more. What specific aspect of nutrition would you like to discuss?";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (isPending || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <NavBar />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (!session?.user) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <NavBar />
      <div className="container mx-auto px-4 py-8 flex-1 flex flex-col max-w-4xl">
        <Card className="flex-1 flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-6 w-6 text-green-600" />
              AI Nutrition Coach
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-0">
            <ScrollArea className="flex-1 p-6" ref={scrollRef}>
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <Bot className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Start a conversation</h3>
                  <p className="text-muted-foreground">
                    Ask me anything about nutrition, meal planning, or your health goals!
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {msg.role === "assistant" && (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-green-600 text-white">
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`rounded-lg px-4 py-2 max-w-[70%] ${
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p className="text-sm">{msg.message}</p>
                      </div>
                      {msg.role === "user" && (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{getInitials(session.user.name)}</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                  {sending && (
                    <div className="flex gap-3 justify-start">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-green-600 text-white">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="rounded-lg px-4 py-2 bg-muted">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>
            <div className="border-t p-4">
              <form onSubmit={sendMessage} className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about nutrition, meal plans, or health goals..."
                  disabled={sending}
                />
                <Button type="submit" disabled={sending || !input.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
