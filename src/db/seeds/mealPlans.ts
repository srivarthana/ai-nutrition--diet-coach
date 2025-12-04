import { db } from '@/db';
import { mealPlans } from '@/db/schema';

async function main() {
    const sampleMealPlans = [
        {
            userId: 'user_1',
            name: 'Mediterranean Weight Loss Plan',
            description: 'Balanced Mediterranean diet focused on whole grains, lean proteins, and healthy fats',
            targetCalories: 1600,
            mealData: {
                breakfast: {
                    name: 'Greek Yogurt Bowl',
                    items: ['Greek yogurt', 'mixed berries', 'walnuts', 'honey drizzle'],
                    calories: 350,
                    protein: 20,
                    carbs: 45,
                    fat: 12
                },
                lunch: {
                    name: 'Grilled Chicken Salad',
                    items: ['grilled chicken breast', 'mixed greens', 'cherry tomatoes', 'cucumber', 'feta cheese', 'olive oil dressing'],
                    calories: 450,
                    protein: 35,
                    carbs: 25,
                    fat: 22
                },
                dinner: {
                    name: 'Baked Salmon with Quinoa',
                    items: ['baked salmon fillet', 'quinoa', 'roasted vegetables', 'lemon', 'herbs'],
                    calories: 550,
                    protein: 40,
                    carbs: 50,
                    fat: 20
                },
                snacks: {
                    name: 'Hummus and Vegetables',
                    items: ['hummus', 'carrots', 'celery', 'bell peppers'],
                    calories: 250,
                    protein: 8,
                    carbs: 30,
                    fat: 10
                }
            },
            isActive: true,
            createdAt: new Date().toISOString(),
        },
        {
            userId: 'user_1',
            name: 'Low-Carb Mediterranean',
            description: 'Mediterranean approach with reduced carbs for faster weight loss',
            targetCalories: 1500,
            mealData: {
                breakfast: {
                    name: 'Egg White Omelet',
                    items: ['egg whites', 'spinach', 'mushrooms', 'tomatoes', 'olive oil'],
                    calories: 300,
                    protein: 25,
                    carbs: 15,
                    fat: 15
                },
                lunch: {
                    name: 'Tuna Salad',
                    items: ['tuna', 'mixed greens', 'cucumber', 'red onion', 'lemon dressing'],
                    calories: 400,
                    protein: 35,
                    carbs: 20,
                    fat: 20
                },
                dinner: {
                    name: 'Grilled Fish with Vegetables',
                    items: ['grilled white fish', 'roasted zucchini', 'bell peppers', 'asparagus'],
                    calories: 550,
                    protein: 45,
                    carbs: 30,
                    fat: 25
                },
                snacks: {
                    name: 'Almonds and Olives',
                    items: ['raw almonds', 'kalamata olives'],
                    calories: 250,
                    protein: 8,
                    carbs: 10,
                    fat: 20
                }
            },
            isActive: false,
            createdAt: new Date().toISOString(),
        },
        {
            userId: 'user_2',
            name: 'Muscle Building High Protein',
            description: 'High protein plan to support muscle growth with 5 meals per day',
            targetCalories: 2800,
            mealData: {
                breakfast: {
                    name: 'Protein Oatmeal',
                    items: ['oatmeal', 'whey protein powder', 'banana', 'almond butter'],
                    calories: 550,
                    protein: 35,
                    carbs: 70,
                    fat: 15
                },
                lunch: {
                    name: 'Chicken and Rice',
                    items: ['grilled chicken breast', 'brown rice', 'broccoli', 'olive oil'],
                    calories: 700,
                    protein: 55,
                    carbs: 80,
                    fat: 15
                },
                dinner: {
                    name: 'Lean Beef Bowl',
                    items: ['lean ground beef', 'sweet potato', 'green beans', 'seasoning'],
                    calories: 800,
                    protein: 60,
                    carbs: 85,
                    fat: 25
                },
                snack1: {
                    name: 'Protein Shake',
                    items: ['whey protein', 'peanut butter', 'milk', 'ice'],
                    calories: 400,
                    protein: 40,
                    carbs: 30,
                    fat: 15
                },
                snack2: {
                    name: 'Greek Yogurt Parfait',
                    items: ['Greek yogurt', 'granola', 'honey'],
                    calories: 350,
                    protein: 25,
                    carbs: 45,
                    fat: 10
                }
            },
            isActive: true,
            createdAt: new Date().toISOString(),
        },
        {
            userId: 'user_2',
            name: 'Clean Bulk Plan',
            description: 'Nutrient-dense foods for lean muscle gain',
            targetCalories: 2900,
            mealData: {
                breakfast: {
                    name: 'Power Breakfast',
                    items: ['scrambled eggs', 'whole grain toast', 'avocado', 'turkey bacon'],
                    calories: 600,
                    protein: 40,
                    carbs: 50,
                    fat: 28
                },
                lunch: {
                    name: 'Turkey Quinoa Bowl',
                    items: ['ground turkey', 'quinoa', 'mixed vegetables', 'tahini dressing'],
                    calories: 750,
                    protein: 50,
                    carbs: 85,
                    fat: 20
                },
                dinner: {
                    name: 'Salmon Pasta',
                    items: ['baked salmon', 'whole wheat pasta', 'asparagus', 'olive oil'],
                    calories: 850,
                    protein: 55,
                    carbs: 90,
                    fat: 30
                },
                snack1: {
                    name: 'Protein Bar and Fruit',
                    items: ['protein bar', 'apple'],
                    calories: 350,
                    protein: 20,
                    carbs: 50,
                    fat: 8
                },
                snack2: {
                    name: 'Cottage Cheese Bowl',
                    items: ['cottage cheese', 'blueberries', 'strawberries'],
                    calories: 350,
                    protein: 30,
                    carbs: 40,
                    fat: 8
                }
            },
            isActive: false,
            createdAt: new Date().toISOString(),
        },
        {
            userId: 'user_3',
            name: 'Vegetarian Diabetes-Friendly',
            description: 'Plant-based meals with controlled carbs and low glycemic index foods',
            targetCalories: 1800,
            mealData: {
                breakfast: {
                    name: 'Steel-Cut Oats Bowl',
                    items: ['steel-cut oats', 'almond butter', 'blueberries', 'chia seeds'],
                    calories: 400,
                    protein: 15,
                    carbs: 55,
                    fat: 18
                },
                lunch: {
                    name: 'Lentil Soup and Salad',
                    items: ['lentil soup', 'mixed greens', 'cucumber', 'tomatoes', 'olive oil'],
                    calories: 500,
                    protein: 20,
                    carbs: 65,
                    fat: 15
                },
                dinner: {
                    name: 'Tofu Stir-Fry',
                    items: ['firm tofu', 'cauliflower rice', 'bell peppers', 'broccoli', 'tamari sauce'],
                    calories: 550,
                    protein: 30,
                    carbs: 50,
                    fat: 25
                },
                snacks: {
                    name: 'Vegetables and Hummus',
                    items: ['raw carrots', 'celery', 'bell peppers', 'hummus'],
                    calories: 350,
                    protein: 12,
                    carbs: 45,
                    fat: 15
                }
            },
            isActive: true,
            createdAt: new Date().toISOString(),
        },
        {
            userId: 'user_3',
            name: 'High Fiber Vegetarian',
            description: 'Fiber-rich vegetarian meals to help manage blood sugar',
            targetCalories: 1750,
            mealData: {
                breakfast: {
                    name: 'Chia Pudding',
                    items: ['chia seeds', 'almond milk', 'walnuts', 'raspberries'],
                    calories: 380,
                    protein: 12,
                    carbs: 45,
                    fat: 20
                },
                lunch: {
                    name: 'Chickpea Salad',
                    items: ['chickpeas', 'mixed greens', 'cucumber', 'tomatoes', 'whole grain pita'],
                    calories: 480,
                    protein: 18,
                    carbs: 70,
                    fat: 12
                },
                dinner: {
                    name: 'Black Bean Curry',
                    items: ['black beans', 'mixed vegetables', 'brown rice', 'curry spices', 'coconut milk'],
                    calories: 540,
                    protein: 22,
                    carbs: 80,
                    fat: 15
                },
                snacks: {
                    name: 'Apple with Almond Butter',
                    items: ['apple', 'almond butter'],
                    calories: 350,
                    protein: 8,
                    carbs: 45,
                    fat: 16
                }
            },
            isActive: false,
            createdAt: new Date().toISOString(),
        }
    ];

    await db.insert(mealPlans).values(sampleMealPlans);
    
    console.log('✅ Meal plans seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});