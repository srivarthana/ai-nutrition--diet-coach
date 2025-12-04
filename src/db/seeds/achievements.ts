import { db } from '@/db';
import { achievements } from '@/db/schema';

async function main() {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const fourDaysAgo = new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000);
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);

    const sampleAchievements = [
        {
            userId: 'user_1',
            achievementType: 'first_meal_logged',
            title: 'First Step',
            description: "Logged your first meal! You're on your way to reaching your health goals.",
            earnedAt: sevenDaysAgo.toISOString(),
        },
        {
            userId: 'user_1',
            achievementType: 'streak_7_days',
            title: 'Week Warrior',
            description: 'Logged your nutrition for 7 consecutive days! Consistency is key to success.',
            earnedAt: now.toISOString(),
        },
        {
            userId: 'user_1',
            achievementType: 'water_goal_met',
            title: 'Hydration Hero',
            description: 'Met your daily water intake goal of 2.5 liters! Staying hydrated supports your metabolism.',
            earnedAt: threeDaysAgo.toISOString(),
        },
        {
            userId: 'user_2',
            achievementType: 'first_meal_logged',
            title: 'First Step',
            description: "Logged your first meal! You're on your way to reaching your health goals.",
            earnedAt: sevenDaysAgo.toISOString(),
        },
        {
            userId: 'user_2',
            achievementType: 'protein_goal_met',
            title: 'Protein Pro',
            description: 'Hit your daily protein goal of 180g! Keep up the great work building muscle.',
            earnedAt: twoDaysAgo.toISOString(),
        },
        {
            userId: 'user_2',
            achievementType: 'streak_7_days',
            title: 'Week Warrior',
            description: 'Logged your nutrition for 7 consecutive days! Consistency is key to success.',
            earnedAt: now.toISOString(),
        },
        {
            userId: 'user_3',
            achievementType: 'first_meal_logged',
            title: 'First Step',
            description: "Logged your first meal! You're on your way to reaching your health goals.",
            earnedAt: sevenDaysAgo.toISOString(),
        },
        {
            userId: 'user_3',
            achievementType: 'fiber_goal_met',
            title: 'Fiber Champion',
            description: 'Exceeded your daily fiber goal of 30g! High fiber intake helps manage blood sugar.',
            earnedAt: fourDaysAgo.toISOString(),
        },
        {
            userId: 'user_3',
            achievementType: 'balanced_meals',
            title: 'Balance Master',
            description: 'Maintained balanced macros for 5 consecutive days! Great work managing your diabetes.',
            earnedAt: oneDayAgo.toISOString(),
        },
    ];

    await db.insert(achievements).values(sampleAchievements);
    
    console.log('✅ Achievements seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});