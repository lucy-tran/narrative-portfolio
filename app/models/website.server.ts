import { prisma } from "~/db.server";

export async function getUrlByUserIdAndWebsiteType(
  userId: number,
  websiteType: string,
) {
  return prisma.userWebsite.findUnique({
    select: { url: true },
    where: { userId_userWebsiteType: { userId, userWebsiteType: websiteType } },
  });
}

export async function getLogoUrlByWebsiteType(websiteType: string) {
  return prisma.website.findUnique({
    select: { logoUrl: true },
    where: { type: websiteType },
  });
}
