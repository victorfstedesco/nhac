import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");

  const meals = await prisma.meal.findMany({
    where: date
      ? {
          userId: session.userId,
          date: {
            gte: new Date(`${date}T00:00:00.000Z`),
            lte: new Date(`${date}T23:59:59.999Z`),
          },
        }
      : { userId: session.userId },
    orderBy: { date: "asc" },
  });

  return NextResponse.json(meals);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { type, description, calories, date } = await req.json();

  if (!type || !description || !calories || !date) {
    return NextResponse.json({ error: "Campos obrigatórios ausentes" }, { status: 400 });
  }

  const meal = await prisma.meal.create({
    data: {
      type,
      description,
      calories: Number(calories),
      date: new Date(date),
      userId: session.userId,
    },
  });

  return NextResponse.json(meal, { status: 201 });
}
