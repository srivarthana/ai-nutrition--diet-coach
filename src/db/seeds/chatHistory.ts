import { db } from '@/db';
import { chatHistory } from '@/db/schema';

async function main() {
    const sampleChatHistory = [
        // User 1 (Sarah - weight loss journey) - 8 messages
        {
            userId: 'user_1',
            role: 'user',
            message: "Hi! I'm trying to lose weight and want to follow a Mediterranean diet. Where should I start?",
            createdAt: new Date('2024-01-15T09:30:00').toISOString(),
        },
        {
            userId: 'user_1',
            role: 'assistant',
            message: "Great choice! The Mediterranean diet is excellent for sustainable weight loss. I recommend starting with these key principles: focus on whole grains, lean proteins like fish and chicken, plenty of vegetables, healthy fats from olive oil and nuts, and limit processed foods. Based on your profile, aim for around 1600 calories per day. Would you like me to create a meal plan for you?",
            createdAt: new Date('2024-01-15T09:30:45').toISOString(),
        },
        {
            userId: 'user_1',
            role: 'user',
            message: "Yes please! Also, I have a shellfish allergy, so please avoid those.",
            createdAt: new Date('2024-01-15T09:32:10').toISOString(),
        },
        {
            userId: 'user_1',
            role: 'assistant',
            message: "Absolutely, I've noted your shellfish allergy. I'll create a Mediterranean meal plan that focuses on other protein sources like chicken, turkey, and non-shellfish fish like salmon and tuna. The plan will include plenty of vegetables, whole grains, and healthy fats. You should see steady progress toward your target weight of 68kg.",
            createdAt: new Date('2024-01-15T09:33:00').toISOString(),
        },
        {
            userId: 'user_1',
            role: 'user',
            message: "What's a good breakfast option that's filling but not too many calories?",
            createdAt: new Date('2024-01-16T08:15:00').toISOString(),
        },
        {
            userId: 'user_1',
            role: 'assistant',
            message: "For a satisfying Mediterranean breakfast around 350 calories, try Greek yogurt (plain, non-fat) with mixed berries, a tablespoon of honey, and a handful of almonds or walnuts. This gives you protein, healthy fats, and fiber to keep you full until lunch. The protein from yogurt is especially important for satiety.",
            createdAt: new Date('2024-01-16T08:15:50').toISOString(),
        },
        {
            userId: 'user_1',
            role: 'user',
            message: "Perfect! How much water should I be drinking daily?",
            createdAt: new Date('2024-01-17T14:20:00').toISOString(),
        },
        {
            userId: 'user_1',
            role: 'assistant',
            message: "For your activity level and weight loss goals, aim for at least 2-2.5 liters (2000-2500ml) of water per day. Staying well-hydrated helps with metabolism, reduces false hunger signals, and supports overall health. Try to spread it throughout the day rather than drinking it all at once.",
            createdAt: new Date('2024-01-17T14:20:40').toISOString(),
        },

        // User 2 (Mike - muscle building) - 8 messages
        {
            userId: 'user_2',
            role: 'user',
            message: "I'm working out 5 days a week and want to build muscle. How much protein do I need?",
            createdAt: new Date('2024-01-14T10:00:00').toISOString(),
        },
        {
            userId: 'user_2',
            role: 'assistant',
            message: "For muscle building with your activity level, aim for 1.6-2.2g of protein per kg of body weight. At 72kg, that's approximately 115-158g per day, but since you're very active and building muscle, I recommend targeting 180-200g daily. Spread this across 5-6 meals to optimize muscle protein synthesis throughout the day.",
            createdAt: new Date('2024-01-14T10:01:00').toISOString(),
        },
        {
            userId: 'user_2',
            role: 'user',
            message: "What are the best protein sources?",
            createdAt: new Date('2024-01-14T10:02:30').toISOString(),
        },
        {
            userId: 'user_2',
            role: 'assistant',
            message: "Excellent protein sources for muscle building include: lean meats (chicken breast, turkey, lean beef), fish (salmon, tuna, tilapia), eggs and egg whites, Greek yogurt, cottage cheese, and protein powder for convenience. Plant-based options like lentils, quinoa, and tofu are also great. Aim to include a protein source in every meal.",
            createdAt: new Date('2024-01-14T10:03:15').toISOString(),
        },
        {
            userId: 'user_2',
            role: 'user',
            message: "Should I eat more on workout days?",
            createdAt: new Date('2024-01-15T16:45:00').toISOString(),
        },
        {
            userId: 'user_2',
            role: 'assistant',
            message: "Yes! On training days, increase your calories by 200-300, focusing on carbs around your workout for energy and recovery. A good strategy is to eat a carb-rich meal 2-3 hours before training and another carb and protein meal within an hour after. This supports performance and muscle recovery.",
            createdAt: new Date('2024-01-15T16:46:00').toISOString(),
        },
        {
            userId: 'user_2',
            role: 'user',
            message: "What about rest days?",
            createdAt: new Date('2024-01-16T11:30:00').toISOString(),
        },
        {
            userId: 'user_2',
            role: 'assistant',
            message: "On rest days, you can slightly reduce calories (by about 200), primarily from carbs, but keep protein high (180g+) as your muscles still need it for recovery and growth. Don't cut calories too much - recovery is when muscles actually grow! Focus on nutrient-dense foods and stay hydrated.",
            createdAt: new Date('2024-01-16T11:31:00').toISOString(),
        },

        // User 3 (Emily - diabetes management) - 10 messages
        {
            userId: 'user_3',
            role: 'user',
            message: "I was recently diagnosed with type 2 diabetes and need help managing my diet.",
            createdAt: new Date('2024-01-13T13:00:00').toISOString(),
        },
        {
            userId: 'user_3',
            role: 'assistant',
            message: "I'm here to help! Managing type 2 diabetes through diet is very effective. Key principles include: controlling carbohydrate portions and timing, choosing low glycemic index foods, increasing fiber intake, eating regular meals to stabilize blood sugar, and balancing carbs with protein and healthy fats. Your vegetarian preference actually works well with diabetes management.",
            createdAt: new Date('2024-01-13T13:01:30').toISOString(),
        },
        {
            userId: 'user_3',
            role: 'user',
            message: "What vegetables are best for blood sugar control?",
            createdAt: new Date('2024-01-13T13:05:00').toISOString(),
        },
        {
            userId: 'user_3',
            role: 'assistant',
            message: "Excellent choices include: leafy greens (spinach, kale, lettuce), cruciferous vegetables (broccoli, cauliflower, Brussels sprouts), peppers, tomatoes, cucumbers, and zucchini. These are all low in carbs and high in fiber. Limit starchy vegetables like potatoes and corn, or pair them with protein and fat to slow glucose absorption.",
            createdAt: new Date('2024-01-13T13:06:00').toISOString(),
        },
        {
            userId: 'user_3',
            role: 'user',
            message: "Can I still eat fruit with diabetes?",
            createdAt: new Date('2024-01-14T09:30:00').toISOString(),
        },
        {
            userId: 'user_3',
            role: 'assistant',
            message: "Yes! Choose fruits with lower glycemic index like berries (strawberries, blueberries, blackberries), apples, pears, and citrus fruits. Avoid fruit juices and dried fruits which cause rapid blood sugar spikes. Pair fruit with protein or healthy fat (like berries with Greek yogurt or apple with almond butter) to minimize blood sugar impact.",
            createdAt: new Date('2024-01-14T09:31:00').toISOString(),
        },
        {
            userId: 'user_3',
            role: 'user',
            message: "What about carbs? Should I avoid them completely?",
            createdAt: new Date('2024-01-15T15:00:00').toISOString(),
        },
        {
            userId: 'user_3',
            role: 'assistant',
            message: "No need to eliminate carbs completely! Focus on complex carbs with high fiber: whole grains (quinoa, brown rice, oats), legumes (lentils, chickpeas, black beans), and vegetables. Aim for 160-200g of carbs daily, spread across meals. Avoid refined carbs like white bread, white rice, and sugary foods. The fiber in complex carbs slows glucose absorption.",
            createdAt: new Date('2024-01-15T15:01:30').toISOString(),
        },
        {
            userId: 'user_3',
            role: 'user',
            message: "Thank you! This is very helpful.",
            createdAt: new Date('2024-01-16T10:00:00').toISOString(),
        },
        {
            userId: 'user_3',
            role: 'assistant',
            message: "You're welcome! Remember to monitor your blood sugar levels regularly, especially when trying new foods. Stay consistent with meal timing, keep up your moderate activity, and don't hesitate to ask if you have more questions. You're taking great steps toward managing your diabetes!",
            createdAt: new Date('2024-01-16T10:01:00').toISOString(),
        },
    ];

    await db.insert(chatHistory).values(sampleChatHistory);
    
    console.log('✅ Chat history seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});