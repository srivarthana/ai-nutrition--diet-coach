import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { userProfiles } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required', code: 'MISSING_USER_ID' },
        { status: 400 }
      );
    }

    if (userId !== user.id) {
      return NextResponse.json(
        { error: 'Access denied', code: 'FORBIDDEN' },
        { status: 403 }
      );
    }

    const profile = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, userId))
      .limit(1);

    if (profile.length === 0) {
      return NextResponse.json(
        { error: 'Profile not found', code: 'PROFILE_NOT_FOUND' },
        { status: 404 }
      );
    }

    return NextResponse.json(profile[0], { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const body = await request.json();

    if ('userId' in body && body.userId !== user.id) {
      return NextResponse.json(
        {
          error: 'Cannot create or update profile for another user',
          code: 'USER_ID_MISMATCH',
        },
        { status: 400 }
      );
    }

    const {
      age,
      gender,
      height,
      weight,
      activityLevel,
      healthGoal,
      targetWeight,
      dietaryPreference,
      allergies,
      medicalConditions,
    } = body;

    if (!age) {
      return NextResponse.json(
        { error: 'age is required', code: 'MISSING_AGE' },
        { status: 400 }
      );
    }

    if (!gender) {
      return NextResponse.json(
        { error: 'gender is required', code: 'MISSING_GENDER' },
        { status: 400 }
      );
    }

    if (!height) {
      return NextResponse.json(
        { error: 'height is required', code: 'MISSING_HEIGHT' },
        { status: 400 }
      );
    }

    if (!weight) {
      return NextResponse.json(
        { error: 'weight is required', code: 'MISSING_WEIGHT' },
        { status: 400 }
      );
    }

    if (!activityLevel) {
      return NextResponse.json(
        { error: 'activityLevel is required', code: 'MISSING_ACTIVITY_LEVEL' },
        { status: 400 }
      );
    }

    if (!healthGoal) {
      return NextResponse.json(
        { error: 'healthGoal is required', code: 'MISSING_HEALTH_GOAL' },
        { status: 400 }
      );
    }

    const existingProfile = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, user.id))
      .limit(1);

    const profileData = {
      age: parseInt(age),
      gender: gender.trim(),
      height: parseInt(height),
      weight: parseFloat(weight),
      activityLevel: activityLevel.trim(),
      healthGoal: healthGoal.trim(),
      targetWeight: targetWeight ? parseFloat(targetWeight) : null,
      dietaryPreference: dietaryPreference?.trim() || 'none',
      allergies: allergies?.trim() || null,
      medicalConditions: medicalConditions?.trim() || null,
      updatedAt: new Date().toISOString(),
    };

    if (existingProfile.length > 0) {
      const updated = await db
        .update(userProfiles)
        .set(profileData)
        .where(eq(userProfiles.userId, user.id))
        .returning();

      return NextResponse.json(updated[0], { status: 200 });
    } else {
      const newProfile = await db
        .insert(userProfiles)
        .values({
          userId: user.id,
          ...profileData,
          createdAt: new Date().toISOString(),
        })
        .returning();

      return NextResponse.json(newProfile[0], { status: 201 });
    }
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}