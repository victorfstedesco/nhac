import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MealSchema } from "@/lib/validations";

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

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corpo da requisição inválido" }, { status: 400 });
  }

  const parsed = MealSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const { type, description, calories, date } = parsed.data;

  const meal = await prisma.meal.update({
    where: { id },
    data: { type, description, calories, date: new Date(date) },
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
