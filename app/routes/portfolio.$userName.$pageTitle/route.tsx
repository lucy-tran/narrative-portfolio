import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useNavigation } from "@remix-run/react";
import invariant from "tiny-invariant";

import BlogPostGallery from "~/components/blocks/BlogPostGallery";
import ContactBox from "~/components/blocks/ContactBox";
import Paragraph from "~/components/blocks/Paragraph";
import SkillsTable from "~/components/blocks/SkillsTable";
import Text from "~/components/blocks/Text";
import Footer from "~/components/Footer";
import HorizontalNavBar from "~/components/HorizontalNavBar";
import type {
  BlogPostGalleryProps,
  ContactBoxProps,
  JsonBlock,
  ParagraphProps,
  ResultBlock,
  SkillsTableProps,
  TextProps,
} from "~/models/block.server";
import { getBlocksByPageId, processBlocks } from "~/models/block.server";
import {
  getPageByUserIdAndTitle,
  getPageTitlesByUserId,
} from "~/models/page.server";
import { getUserByUsername } from "~/models/user.server";

async function loadPageBlocks(
  userId: number,
  pageId: number,
): Promise<ResultBlock[]> {
  try {
    const jsonBlocks: JsonBlock[] = await getBlocksByPageId(pageId);
    const resultBlocks: ResultBlock[] = await processBlocks(jsonBlocks, userId);
    return resultBlocks;
  } catch (error) {
    console.log(error);
    throw new Response("Not Found", { status: 404 });
  }
}

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.userName, "Missing userName param");
  invariant(params.pageTitle, "Missing userName param");

  const user = await getUserByUsername(params.userName);
  if (!user) {
    throw new Response("Not Found", { status: 404 });
  }

  const pageTitles = await getPageTitlesByUserId(user.id);
  invariant(pageTitles, `Cannot find user pages for user ${user.id}`);

  const currentPage = await getPageByUserIdAndTitle(user.id, params.pageTitle);
  invariant(currentPage, `Cannot find page ${params.pageTitle}`);

  const blocks = await loadPageBlocks(user.id, currentPage.id);

  return json({ user, pageTitles, currentPage, blocks });
};

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  {
    title:
      `${data?.user.firstName} ${data?.user.lastName} |` +
      " Narrative Portfolio",
  },
];

export default function PortfolioPage() {
  const { pageTitles, currentPage, blocks } = useLoaderData<typeof loader>();

  const navigation = useNavigation();

  const nextPageTitle =
    currentPage.order + 1 <= pageTitles.length
      ? pageTitles[currentPage.order] // this is index
      : "./"; // back to home page
  const prevPageTitle = pageTitles[currentPage.order - 2];

  return (
    <div className="w-full h-full">
      <div
        className={
          "fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-gray-700 opacity-75 flex flex-col items-center justify-center" +
          (navigation.state === "loading" ? "" : " hidden")
        }
      >
        <div className="animate-spin ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
        <h2 className="text-center text-white text-xl font-sans">Loading...</h2>
      </div>
      <HorizontalNavBar
        pageTitles={pageTitles}
        currentPage={currentPage.title}
      />
      <header className="relative w-full h-screen">
        <img
          src={
            currentPage.bgImage ??
            "https://github.com/lucy-tran/lucytran-portfolio/assets/54861558/5376ac75-6eb8-4ddf-a3a5-3ee9a96fa603"
          }
          alt="background"
          className="z-[-1] absolute top-0 left-0 h-full w-full object-cover"
        />
        <div className="absolute bottom-12 w-full flex flex-col align-center justify-center gap-8">
          <div className="self-stretch text-center w-full px-4 mx-auto sm:px-6 lg:px-8 bottom-0 relative text-4xl font-serif leading-tight sm:text-5xl lg:text-6xl">
            {currentPage.heroTitle}
          </div>
          <div className="self-stretch font-light font-sans text-lg w-full px-8 mx-auto sm:px-10 md:px-16 lg:px-24">
            {currentPage.tldr}
          </div>
          <div className="self-stretch w-full flex justify-center">
            <button
              onClick={() =>
                window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
              }
              className="animate-bounce w-8 sm:w-10 lg:w-12 h-auto"
              >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={4}
                stroke="currentColor"
                className="stroke-gray-300"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>
      <main className="flex flex-col gap-4 pt-4">
        {blocks.map((block, index) => {
          if (block.blockType.includes("H") || block.blockType === "Text") {
            return (
              <Text
                key={index}
                blockType={block.blockType}
                properties={block.properties as TextProps}
                childrenContent={block.childrenContent}
              />
            );
          }
          if (block.blockType === "Paragraph") {
            return (
              <Paragraph
                key={index}
                order={block.order}
                properties={block.properties as ParagraphProps}
                childrenContent={block.childrenContent}
              />
            );
          }
          if (block.blockType === "SkillsTable") {
            return (
              <SkillsTable
                key={index}
                properties={block.properties as SkillsTableProps}
              />
            );
          }
          if (block.blockType === "ContactBox") {
            return (
              <ContactBox
                key={index}
                properties={block.properties as ContactBoxProps}
              />
            );
          }
          if (block.blockType === "BlogPostGallery") {
            return (
              <BlogPostGallery
                key={index}
                properties={block.properties as BlogPostGalleryProps}
              />
            );
          }
        })}
      </main>
      <Footer prevPage={prevPageTitle} nextPage={nextPageTitle} />
    </div>
  );
}
