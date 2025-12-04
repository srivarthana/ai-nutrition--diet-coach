import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { mealPlans } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ 
        error: 'Authentication required',
        code: 'AUTHENTICATION_REQUIRED' 
      }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    const results = await db.select()
      .from(mealPlans)
      .where(eq(mealPlans.userId, user.id))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ 
        error: 'Authentication required',
        code: 'AUTHENTICATION_REQUIRED' 
      }, { status: 401 });
    }

    const body = await request.json();

    if ('userId' in body || 'user_id' in body) {
      return NextResponse.json({ 
        error: "User ID cannot be provided in request body",
        code: "USER_ID_NOT_ALLOWED" 
      }, { status: 400 });
    }

    const { name, description, targetCalories, mealData, isActive } = body;

    if (!name) {
      return NextResponse.json({ 
        error: "Name is required",
        code: "MISSING_NAME" 
      }, { status: 400 });
    }

    if (!targetCalories && targetCalories !== 0) {
      return NextResponse.json({ 
        error: "Target calories is required",
        code: "MISSING_TARGET_CALORIES" 
      }, { status: 400 });
    }

    if (!mealData) {
      return NextResponse.json({ 
        error: "Meal data is required",
        code: "MISSING_MEAL_DATA" 
      }, { status: 400 });
    }

    const trimmedName = name.trim();
    if (!trimmedName) {
      return NextResponse.json({ 
        error: "Name cannot be empty",
        code: "INVALID_NAME" 
      }, { status: 400 });
    }

    const newMealPlan = await db.insert(mealPlans)
      .values({
        userId: user.id,
        name: trimmedName,
        description: description?.trim() || null,
        targetCalories: parseFloat(targetCalories),
        mealData: mealData,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
        createdAt: new Date().toISOString(),
      })
      .returning();

    return NextResponse.json(newMealPlan[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ 
        error: 'Authentication required',
        code: 'AUTHENTICATION_REQUIRED' 
      }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    const body = await request.json();

    if ('userId' in body || 'user_id' in body) {
      return NextResponse.json({ 
        error: "User ID cannot be provided in request body",
        code: "USER_ID_NOT_ALLOWED" 
      }, { status: 400 });
    }

    const existing = await db.select()
      .from(mealPlans)
      .where(and(eq(mealPlans.id, parseInt(id)), eq(mealPlans.userId, user.id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ 
        error: 'Meal plan not found',
        code: 'NOT_FOUND' 
      }, { status: 404 });
    }

    const updates: Record<string, any> = {};

    if (body.name !== undefined) {
      const trimmedName = body.name.trim();
      if (!trimmedName) {
        return NextResponse.json({ 
          error: "Name cannot be empty",
          code: "INVALID_NAME" 
        }, { status: 400 });
      }
      updates.name = trimmedName;
    }

    if (body.description !== undefined) {
      updates.description = body.description?.trim() || null;
    }

    if (body.targetCalories !== undefined) {
      updates.targetCalories = parseFloat(body.targetCalories);
    }

    if (body.mealData !== undefined) {
      updates.mealData = body.mealData;
    }

    if (body.isActive !== undefined) {
      updates.isActive = Boolean(body.isActive);
    }

    const updated = await db.update(mealPlans)
      .set(updates)
      .where(and(eq(mealPlans.id, parseInt(id)), eq(mealPlans.userId, user.id)))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ 
        error: 'Meal plan not found',
        code: 'NOT_FOUND' 
      }, { status: 404 });
    }

    return NextResponse.json(updated[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ 
        error: 'Authentication required',
        code: 'AUTHENTICATION_REQUIRED' 
      }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    const existing = await db.select()
      .from(mealPlans)
      .where(and(eq(mealPlans.id, parseInt(id)), eq(mealPlans.userId, user.id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ 
        error: 'Meal plan not found',
        code: 'NOT_FOUND' 
      }, { status: 404 });
    }

    const deleted = await db.delete(mealPlans)
      .where(and(eq(mealPlans.id, parseInt(id)), eq(mealPlans.userId, user.id)))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json({ 
        error: 'Meal plan not found',
        code: 'NOT_FOUND' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      message: 'Meal plan deleted successfully',
      deleted: deleted[0] 
    }, { status: 200 });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}