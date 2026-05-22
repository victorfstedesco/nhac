import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const format = searchParams.get("format") ?? "json";

  const meals = await prisma.meal.findMany({
    where: { userId: session.userId },
    orderBy: { date: "desc" },
    select: { type: true, description: true, calories: true, date: true },
  });

  const fastingSessions = await prisma.fastingSession.findMany({
    where: { userId: session.userId },
    orderBy: { startTime: "desc" },
    select: { protocol: true, targetHours: true, startTime: true, endTime: true, status: true },
  });

  if (format === "csv") {
    const mealRows = meals.map((m) =>
      [m.type, `"${m.description.replace(/"/g, '""')}"`, m.calories, m.date.toISOString()].join(",")
    );
    const fastingRows = fastingSessions.map((f) =>
      [f.protocol, f.targetHours, f.startTime.toISOString(), f.endTime?.toISOString() ?? "", f.status].join(",")
    );

    const csv = [
      "=== REFEIÇÕES ===",
      "tipo,descrição,calorias,data",
      ...mealRows,
      "",
      "=== JEJUNS ===",
      "protocolo,horas_alvo,início,fim,status",
      ...fastingRows,
    ].join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="nhac-export-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  }

  return NextResponse.json({ meals, fastingSessions });
}
