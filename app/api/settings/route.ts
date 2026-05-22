import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, name: true, email: true, calorieGoal: true },
  });

  if (!user) return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });

  return NextResponse.json(user);
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { name, email, calorieGoal } = await req.json();

  const user = await prisma.user.update({
    where: { id: session.userId },
    data: {
      ...(name && { name }),
      ...(email && { email }),
      ...(calorieGoal !== undefined && { calorieGoal: Number(calorieGoal) }),
    },
    select: { id: true, name: true, email: true, calorieGoal: true },
  });

  return NextResponse.json(user);
}
