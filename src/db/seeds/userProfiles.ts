import { db } from '@/db';
import { userProfiles } from '@/db/schema';

async function main() {
    const sampleUserProfiles = [
        {
            userId: 'user_1',
            age: 32,
            gender: 'female',
            height: 165,
            weight: 78.5,
            activityLevel: 'lightly_active',
            healthGoal: 'lose_weight',
            targetWeight: 68.0,
            dietaryPreference: 'mediterranean',
            allergies: 'shellfish',
            medicalConditions: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            userId: 'user_2',
            age: 28,
            gender: 'male',
            height: 178,
            weight: 72.0,
            activityLevel: 'very_active',
            healthGoal: 'build_muscle',
            targetWeight: 80.0,
            dietaryPreference: 'none',
            allergies: '',
            medicalConditions: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            userId: 'user_3',
            age: 45,
            gender: 'female',
            height: 160,
            weight: 65.0,
            activityLevel: 'moderately_active',
            healthGoal: 'improve_health',
            targetWeight: null,
            dietaryPreference: 'vegetarian',
            allergies: 'dairy',
            medicalConditions: 'type 2 diabetes',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
    ];

    await db.insert(userProfiles).values(sampleUserProfiles);
    
    console.log('✅ User profiles seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});