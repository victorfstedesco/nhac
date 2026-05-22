import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  const existing = await prisma.fastingSession.findUnique({ where: { id } });
  if (!existing || existing.userId !== session.userId) {
    return NextResponse.json({ error: "Sessão não encontrada" }, { status: 404 });
  }

  const { status } = await req.json();
  const endTime = new Date();

  const targetMs = existing.targetHours * 60 * 60 * 1000;
  const elapsedMs = endTime.getTime() - existing.startTime.getTime();
  const finalStatus = status ?? (elapsedMs >= targetMs ? "completed" : "interrupted");

  const updated = await prisma.fastingSession.update({
    where: { id },
    data: { status: finalStatus, endTime },
  });

  return NextResponse.json(updated);
}
