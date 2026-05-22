import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function getOwnedMeal(id: string, userId: string) {
  const meal = await prisma.meal.findUnique({ where: { id } });
  if (!meal || meal.userId !== userId) return null;
  return meal;
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  const meal = await getOwnedMeal(id, session.userId);
  if (!meal) return NextResponse.json({ error: "Refeição não encontrada" }, { status: 404 });

  return NextResponse.json(meal);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  const existing = await getOwnedMeal(id, session.userId);
  if (!existing) return NextResponse.json({ error: "Refeição não encontrada" }, { status: 404 });

  const { type, description, calories, date } = await req.json();

  const meal = await prisma.meal.update({
    where: { id },
    data: {
      ...(type && { type }),
      ...(description && { description }),
      ...(calories !== undefined && { calories: Number(calories) }),
      ...(date && { date: new Date(date) }),
    },
  });

  return NextResponse.json(meal);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  const existing = await getOwnedMeal(id, session.userId);
  if (!existing) return NextResponse.json({ error: "Refeição não encontrada" }, { status: 404 });

  await prisma.meal.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
