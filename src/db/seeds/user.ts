import { db } from '@/db';
import { user } from '@/db/schema';

async function main() {
    const sampleUsers = [
        {
            id: 'user_1',
            name: 'Sarah Johnson',
            email: 'sarah.j@example.com',
            emailVerified: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 'user_2',
            name: 'Mike Chen',
            email: 'mike.chen@example.com',
            emailVerified: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 'user_3',
            name: 'Emily Rodriguez',
            email: 'emily.r@example.com',
            emailVerified: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ];

    await db.insert(user).values(sampleUsers);
    
    console.log('✅ Users seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});