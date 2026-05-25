import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  try {
    const sessions = await prisma.fastingSession.findMany({
      where: {
        userId: session.userId,
        status: { in: ["completed", "interrupted"] },
      },
      orderBy: { startTime: "desc" },
    });

    return NextResponse.json(sessions);
  } catch (err) {
    console.error("[fasting/history]", err);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
