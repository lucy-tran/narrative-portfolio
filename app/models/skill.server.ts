import { prisma } from "~/db.server";

export type { User } from "@prisma/client";

export async function getUserSkillByUserIdAndSkill(
  userId: number,
  skill: string,
) {
  return prisma.userSkill.findUnique({
    where: { userId_skillName: { userId, skillName: skill } },
  });
}
