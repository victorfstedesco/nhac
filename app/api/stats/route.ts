import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const todayUTC = new Date().toISOString().split("T")[0];
  const sevenDaysAgo = new Date(`${todayUTC}T00:00:00.000Z`);
  sevenDaysAgo.setUTCDate(sevenDaysAgo.getUTCDate() - 6);

  const meals = await prisma.meal.findMany({
    where: { userId: session.userId, date: { gte: sevenDaysAgo } },
    orderBy: { date: "asc" },
  });

  const fastingSessions = await prisma.fastingSession.findMany({
    where: {
      userId: session.userId,
      startTime: { gte: sevenDaysAgo },
      status: { in: ["completed", "interrupted"] },
    },
    orderBy: { startTime: "asc" },
  });

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { calorieGoal: true },
  });

  const dailyCalories: Record<string, number> = {};
  for (let i = 0; i < 7; i++) {
    const d = new Date(sevenDaysAgo);
    d.setUTCDate(sevenDaysAgo.getUTCDate() + i);
    dailyCalories[d.toISOString().split("T")[0]] = 0;
  }

  for (const meal of meals) {
    const day = meal.date.toISOString().split("T")[0];
    if (day in dailyCalories) {
      dailyCalories[day] += meal.calories;
    }
  }

  const days = Object.entries(dailyCalories).map(([date, calories]) => ({
    date,
    calories,
    label: new Date(date + "T12:00:00").toLocaleDateString("pt-BR", { weekday: "short" }),
  }));

  const totalCals = Object.values(dailyCalories).reduce((a, b) => a + b, 0);
  const activeDays = Object.values(dailyCalories).filter((c) => c > 0).length;
  const avgCalories = activeDays > 0 ? Math.round(totalCals / activeDays) : 0;

  const completedFasts = fastingSessions.filter((s) => s.status === "completed").length;

  const fastDurations = fastingSessions
    .filter((s) => s.endTime)
    .map((s) => (s.endTime!.getTime() - s.startTime.getTime()) / (1000 * 60 * 60));

  const avgFastHours =
    fastDurations.length > 0
      ? fastDurations.reduce((a, b) => a + b, 0) / fastDurations.length
      : 0;

  const fastingByDay: Record<string, number> = {};
  for (const key of Object.keys(dailyCalories)) fastingByDay[key] = 0;
  for (const s of fastingSessions) {
    if (s.endTime) {
      const day = s.startTime.toISOString().split("T")[0];
      if (day in fastingByDay) {
        fastingByDay[day] += (s.endTime.getTime() - s.startTime.getTime()) / (1000 * 60 * 60);
      }
    }
  }

  const fastingDays = Object.entries(fastingByDay).map(([date, hours]) => ({
    date,
    hours: Math.round(hours * 10) / 10,
    label: new Date(date + "T12:00:00").toLocaleDateString("pt-BR", { weekday: "short" }),
  }));

  return NextResponse.json({
    avgCalories,
    completedFasts,
    avgFastHours: Math.round(avgFastHours * 10) / 10,
    calorieGoal: user?.calorieGoal ?? 2000,
    days,
    fastingDays,
  });
}
