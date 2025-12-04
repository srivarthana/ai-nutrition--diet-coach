import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { dailyNutrition } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'AUTHENTICATION_REQUIRED' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get('date');

    if (!date) {
      return NextResponse.json(
        { error: 'Date parameter is required', code: 'MISSING_DATE' },
        { status: 400 }
      );
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return NextResponse.json(
        { error: 'Invalid date format. Expected YYYY-MM-DD', code: 'INVALID_DATE_FORMAT' },
        { status: 400 }
      );
    }

    const nutrition = await db
      .select()
      .from(dailyNutrition)
      .where(
        and(
          eq(dailyNutrition.userId, user.id),
          eq(dailyNutrition.date, date)
        )
      )
      .limit(1);

    if (nutrition.length === 0) {
      return NextResponse.json(
        { error: 'Nutrition log not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    return NextResponse.json(nutrition[0], { status: 200 });
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
        { error: 'Authentication required', code: 'AUTHENTICATION_REQUIRED' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Security check: reject if userId provided in body
    if ('userId' in body || 'user_id' in body) {
      return NextResponse.json(
        {
          error: 'User ID cannot be provided in request body',
          code: 'USER_ID_NOT_ALLOWED',
        },
        { status: 400 }
      );
    }

    const {
      date,
      caloriesConsumed,
      proteinG,
      carbsG,
      fatG,
      fiberG,
      waterMl,
    } = body;

    // Validate required fields
    if (!date) {
      return NextResponse.json(
        { error: 'Date is required', code: 'MISSING_DATE' },
        { status: 400 }
      );
    }

    if (caloriesConsumed === undefined || caloriesConsumed === null) {
      return NextResponse.json(
        { error: 'Calories consumed is required', code: 'MISSING_CALORIES' },
        { status: 400 }
      );
    }

    if (proteinG === undefined || proteinG === null) {
      return NextResponse.json(
        { error: 'Protein is required', code: 'MISSING_PROTEIN' },
        { status: 400 }
      );
    }

    if (carbsG === undefined || carbsG === null) {
      return NextResponse.json(
        { error: 'Carbs is required', code: 'MISSING_CARBS' },
        { status: 400 }
      );
    }

    if (fatG === undefined || fatG === null) {
      return NextResponse.json(
        { error: 'Fat is required', code: 'MISSING_FAT' },
        { status: 400 }
      );
    }

    if (fiberG === undefined || fiberG === null) {
      return NextResponse.json(
        { error: 'Fiber is required', code: 'MISSING_FIBER' },
        { status: 400 }
      );
    }

    if (waterMl === undefined || waterMl === null) {
      return NextResponse.json(
        { error: 'Water is required', code: 'MISSING_WATER' },
        { status: 400 }
      );
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return NextResponse.json(
        { error: 'Invalid date format. Expected YYYY-MM-DD', code: 'INVALID_DATE_FORMAT' },
        { status: 400 }
      );
    }

    // Create nutrition log entry
    const newNutrition = await db
      .insert(dailyNutrition)
      .values({
        userId: user.id,
        date,
        caloriesConsumed,
        proteinG,
        carbsG,
        fatG,
        fiberG,
        waterMl,
        createdAt: new Date().toISOString(),
      })
      .returning();

    return NextResponse.json(newNutrition[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}