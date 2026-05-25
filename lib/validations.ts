import { z } from "zod";

export const RegisterSchema = z.object({
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

export const LoginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "Senha obrigatória"),
});

export const MealSchema = z.object({
  type: z.enum(["Café da manhã", "Almoço", "Lanche", "Jantar", "Ceia"], {
    error: "Tipo de refeição inválido",
  }),
  description: z
    .string()
    .min(1, "Descrição obrigatória")
    .max(500, "Descrição muito longa"),
  calories: z
    .number({ error: "Calorias devem ser um número" })
    .int("Calorias devem ser um número inteiro")
    .min(0, "Calorias não podem ser negativas")
    .max(10_000, "Máximo de 10.000 kcal"),
  date: z.string().min(1, "Data obrigatória"),
});

export const FastingStartSchema = z.object({
  protocol: z.string().min(1, "Protocolo obrigatório"),
  targetHours: z
    .number({ error: "Duração inválida" })
    .min(1, "Mínimo de 1 hora")
    .max(72, "Máximo de 72 horas"),
  startTime: z.string().min(1, "Horário de início obrigatório"),
});

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Senha atual obrigatória"),
  newPassword: z
    .string()
    .min(6, "Nova senha deve ter no mínimo 6 caracteres"),
});

export const SettingsSchema = z.object({
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres").optional(),
  email: z.string().email("E-mail inválido").optional(),
  calorieGoal: z
    .number({ error: "Meta calórica inválida" })
    .int()
    .min(500, "Mínimo de 500 kcal")
    .max(10_000, "Máximo de 10.000 kcal")
    .optional(),
});
