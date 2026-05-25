import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { FastingStartSchema } from "@/lib/validations";

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

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corpo da requisição inválido" }, { status: 400 });
  }

  const parsed = FastingStartSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const { protocol, targetHours, startTime } = parsed.data;

  await prisma.fastingSession.updateMany({
    where: { userId: session.userId, status: "active" },
    data: { status: "interrupted", endTime: new Date() },
  });

  const session_ = await prisma.fastingSession.create({
    data: {
      protocol,
      targetHours,
      startTime: new Date(startTime),
      status: "active",
      userId: session.userId,
    },
  });

  return NextResponse.json(session_, { status: 201 });
}
