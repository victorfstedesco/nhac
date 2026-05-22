import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const active = await prisma.fastingSession.findFirst({
    where: { userId: session.userId, status: "active" },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(active ?? null);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { protocol, targetHours, startTime } = await req.json();

  if (!protocol || !targetHours || !startTime) {
    return NextResponse.json({ error: "Campos obrigatórios ausentes" }, { status: 400 });
  }

  await prisma.fastingSession.updateMany({
    where: { userId: session.userId, status: "active" },
    data: { status: "interrupted", endTime: new Date() },
  });

  const session_ = await prisma.fastingSession.create({
    data: {
      protocol,
      targetHours: Number(targetHours),
      startTime: new Date(startTime),
      status: "active",
      userId: session.userId,
    },
  });

  return NextResponse.json(session_, { status: 201 });
}
