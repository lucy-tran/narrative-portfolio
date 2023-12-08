import { prisma } from "~/db.server";

export type { User } from "@prisma/client";

export async function getPageTitleByUserIdAndOrder(
  userId: number,
  order: number,
) {
  const page = await prisma.page.findUnique({
    select: { title: true },
    where: { userId_order: { userId, order } },
  });
  if (!page) {
    return null;
  }
  return page.title;
}

export async function getPageTitlesByUserId(userId: number) {
  const pages = await prisma.page.findMany({
    select: { title: true, order: true },
    where: { userId },
    orderBy: { order: "asc" },
  });
  if (!pages) {
    return null;
  }
  const result = [];
  for (const page of pages) {
    result.push(page.title);
  }
  return result;
}

export async function getPageByUserIdAndTitle(userId: number, title: string) {
  const page = await prisma.page.findUnique({
    where: { userId_title: { userId, title } },
  });
  if (!page) {
    return null;
  }
  return page;
}
