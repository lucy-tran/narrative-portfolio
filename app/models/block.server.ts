import Axios from "axios";
import { setupCache } from "axios-cache-interceptor";

import { prisma } from "~/db.server";
import { getUserSkillByUserIdAndSkill } from "~/models/skill.server";
import { getUserById } from "~/models/user.server";
import {
  getUrlByUserIdAndWebsiteType,
  getLogoUrlByWebsiteType,
} from "~/models/website.server";

const axios = setupCache(Axios);

// types from the parsed version of the original block
export interface JsonSkillsTableProps {
  techSkills: string[];
  softSkills: string[];
}

export interface JsonContactBoxProps {
  headline?: string; // sth like ‘Contact me’ or ‘Let’s connect’
  image?: string; // default = the url to the profilePic
  phone?: string;
  websites?: string[];
  hasEmailForm: boolean;
}

export interface JsonBlogPostGalleryProps {
  mediumUsername: string;
  numPosts: number;
}

export interface JsonProperties {
  text?: string;
  align?: string;
  embeddedUrl?: string;
  images?: string[];
  techSkills?: string[];
  softSkills?: string[];
  headline?: string;
  image?: string;
  phone?: string;
  websites?: string[];
  hasEmailForm?: boolean;
  mediumUsername?: string;
  numPosts?: number;
  bold?: boolean;
  italics?: boolean;
  underline?: boolean;
}

export interface JsonBlock {
  id: string;
  pageId: number;
  order: number; // its order among all blocks in the page, not among its siblings
  blockType: string;
  properties: JsonProperties;
  childrenContent?: JsonProperties[] | undefined;
  parentId?: string | null;
}

// types for storing the blocks that are returned to the frontend
export interface TextProps {
  // H1, H2, H3, Text
  text?: string;
  align: "left" | "center" | "right" | "justify";
  embeddedUrl?: string;
  bold?: boolean;
  italics?: boolean;
  underline?: boolean;
}

export interface BulletedItemProps {
  text?: string;
  align: "left" | "center" | "right" | "justify";
}

export interface NumberedItemProps {
  number: number;
  text?: string;
  align: "left" | "center" | "right" | "justify";
}

export interface ToggleProps {
  text?: string;
  align: "left" | "center" | "right" | "justify";
}

export interface ParagraphProps {
  text?: string;
  align: "left" | "center" | "right" | "justify";
  images?: string[];
}

export interface ResultSkill {
  skillName: string;
  level?: string | null;
}

export interface SkillsTableProps {
  // will be auto-filled based on the User’s skills, but the user can choose to hide/display specific skills in this block
  techSkills: ResultSkill[]; // a stringified json array of UserSkill ids
  softSkills: ResultSkill[]; // a stringified json array of UserSkill ids
}

export interface ResultWebsite {
  type: string;
  url: string;
  logoUrl: string;
}

export interface ContactBoxProps {
  // This element includes the user’s phone, social media, websites, and optionally a form to email the user.
  headline?: string; // sth like ‘Contact me’ or ‘Let’s connect’
  image?: string; // default = the url to the profilePic
  phone?: string;
  websites?: ResultWebsite[];
  hasEmailForm: boolean;
}

export interface BlogPostGalleryProps {
  mediumUsername: string; // simply put in your Medium user name, and the site will automatically pull data and create a gallery
  numPosts: number; // number of blogs to render on the page, max 10. We don't want too much.
  articles: Article[];
}

export interface Article {
  title: string;
  imageUrl: string; // url to the medium post
  minutesRead: number;
  subtitle: string;
  contentStart: string;
  articleUrl: string;
  topTag?: string;
  publishedDate: string;
}

export interface ResultProperties {
  text?: string;
  align?: string;
  embeddedUrl?: string;
  images?: string[];
  techSkills?: ResultSkill[];
  softSkills?: ResultSkill[];
  headline?: string;
  image?: string;
  phone?: string;
  websites?: ResultWebsite[];
  hasEmailForm?: boolean;
  mediumUsername?: string;
  numPosts?: number;
  articles?: Article[];
  bold?: boolean;
  italics?: boolean;
  underline?: boolean;
}

export interface ResultBlock {
  id: string;
  pageId: number;
  order: number; // its order among all blocks in the page, not among its siblings
  blockType: string;
  properties: ResultProperties;
  childrenContent?: TextProps[] | undefined;
  parentId?: string | null;
}

export async function getBlocksByPageId(pageId: number): Promise<JsonBlock[]> {
  const blocks = await prisma.block.findMany({
    where: { AND: [{ pageId }] },
    orderBy: { order: "asc" },
  });

  // Parse the properties json strings of each block
  const jsonBlocks = [];
  for (const origBlock of blocks) {
    const jsonBlock: JsonBlock = {
      id: origBlock.id,
      pageId: origBlock.pageId,
      order: origBlock.order, // its order among all blocks in the page, not among its siblings
      blockType: origBlock.blockType,
      properties: JSON.parse(origBlock.properties),
      parentId: origBlock.parentId, // a stringified json array of objects
    };
    jsonBlocks.push(jsonBlock);
  }

  return jsonBlocks;
}

// Process different types of blocks, i.e. filling their properties and childrenContent
// with useful data for the frontend to render
export async function processBlocks(
  jsonBlocks: JsonBlock[],
  userId: number,
): Promise<ResultBlock[]> {
  const resultBlocks: ResultBlock[] = [];
  for (let i = jsonBlocks.length - 1; i >= 0; i--) {
    // Loop from the bottom of the page to process the child nodes first before
    // appending them to their parents.
    const jsonBlock = jsonBlocks[i];

    if (jsonBlock.blockType === "SkillsTable") {
      const resultBlock = await processSkillsTableBlock(
        jsonBlock,
        jsonBlock.properties as JsonSkillsTableProps,
        userId,
      );
      resultBlocks.push(resultBlock);
    } else if (jsonBlock.blockType === "ContactBox") {
      const resultBlock = await processContactBoxBlock(
        jsonBlock,
        jsonBlock.properties as JsonContactBoxProps,
        userId,
      );
      resultBlocks.push(resultBlock);
    } else if (jsonBlock.blockType === "BlogPostGallery") {
      const resultBlock = await processBlogPostGalleryBlock(
        jsonBlock,
        jsonBlock.properties as JsonBlogPostGalleryProps,
      );
      if (resultBlock) resultBlocks.push(resultBlock);
    } else if (
      !jsonBlock.properties ||
      jsonBlock.properties.text == undefined
    ) {
      // this is a parent block
      const resultBlock = await processParentBlock(jsonBlock, jsonBlocks);
      resultBlocks.push(resultBlock);
    } else if (!jsonBlock.parentId) {
      // We don't want to add child nodes to the resultBlocks, only
      // add them to their parents within the childrenContent
      const resultBlock = {
        id: jsonBlock.id,
        pageId: jsonBlock.pageId,
        order: jsonBlock.order,
        blockType: jsonBlock.blockType,
        properties: jsonBlock.properties as ResultProperties,
        parentId: jsonBlock.parentId,
      };
      resultBlocks.push(resultBlock);
    }
  }
  resultBlocks.sort((a, b) => a.order - b.order);
  return resultBlocks;
}

// ============== Utils for processing different types of blocks =================

async function processSkillsTableBlock(
  jsonBlock: JsonBlock,
  blockProperties: JsonSkillsTableProps,
  userId: number,
): Promise<ResultBlock> {
  const techSkills: ResultSkill[] = [];
  for (const techSkill of blockProperties.techSkills) {
    const userSkill = await getUserSkillByUserIdAndSkill(userId, techSkill);
    if (userSkill) {
      techSkills.push({
        skillName: userSkill.skillName,
        level: userSkill.level,
      });
    }
  }
  const softSkills: ResultSkill[] = [];
  for (const softSkill of blockProperties.softSkills) {
    const userSkill = await getUserSkillByUserIdAndSkill(userId, softSkill);
    if (userSkill) {
      softSkills.push({
        skillName: userSkill.skillName,
        level: userSkill.level,
      });
    }
  }
  const resultProperties: ResultProperties = { techSkills, softSkills };

  const resultBlock: ResultBlock = {
    id: jsonBlock.id,
    pageId: jsonBlock.pageId,
    order: jsonBlock.order,
    blockType: jsonBlock.blockType,
    properties: resultProperties,
    parentId: jsonBlock.parentId,
  };
  return resultBlock;
}

export async function processContactBoxBlock(
  jsonBlock: JsonBlock,
  blockProperties: JsonContactBoxProps,
  userId: number,
): Promise<ResultBlock> {
  const resultWebsites: ResultWebsite[] = [];

  if (blockProperties.websites) {
    for (const website of blockProperties.websites) {
      const userWebsiteUrl = await getUrlByUserIdAndWebsiteType(
        userId,
        website,
      );
      const websiteLogo = await getLogoUrlByWebsiteType(website);
      if (userWebsiteUrl !== null && websiteLogo !== null) {
        resultWebsites.push({
          type: website,
          url: userWebsiteUrl.url,
          logoUrl: websiteLogo.logoUrl,
        });
      }
    }
  }

  if (!blockProperties.image) {
    const user = await getUserById(userId);
    blockProperties.image = user?.profilePic ?? "https://picsum.photos/500/500";
  }
  const resultProperties: ContactBoxProps = {
    headline: blockProperties.headline,
    image: blockProperties.image,
    phone: blockProperties.phone,
    websites: resultWebsites,
    hasEmailForm: blockProperties.hasEmailForm,
  };

  const resultBlock: ResultBlock = {
    id: jsonBlock.id,
    pageId: jsonBlock.pageId,
    order: jsonBlock.order,
    blockType: jsonBlock.blockType,
    properties: resultProperties as ContactBoxProps,
    parentId: jsonBlock.parentId,
  };
  return resultBlock;
}

// : Promise<ResultBlock | null>
export async function processBlogPostGalleryBlock(
  jsonBlock: JsonBlock,
  blockProperties: JsonBlogPostGalleryProps,
): Promise<ResultBlock | null> {
  try {
    const userId: { data: { id: string } } = await axios.request({
      method: "GET",
      url:
        "https://medium2.p.rapidapi.com/user/id_for/" +
        blockProperties.mediumUsername,
      headers: {
        "X-RapidAPI-Key": "a2254f4486msh2f1b71806791765p16d307jsnf41a7ea0fdfc",
        "X-RapidAPI-Host": "medium2.p.rapidapi.com",
      },
    });

    const userTopArticlesRes = await axios.request({
      method: "GET",
      url:
        "https://medium2.p.rapidapi.com/user/" +
        userId.data.id +
        "/top_articles",
      headers: {
        "X-RapidAPI-Key": "a2254f4486msh2f1b71806791765p16d307jsnf41a7ea0fdfc",
        "X-RapidAPI-Host": "medium2.p.rapidapi.com",
      },
    });
    const userTopArticles: string[] = userTopArticlesRes.data.top_articles;
    const numArticles = Math.min(
      10,
      blockProperties.numPosts,
      userTopArticles.length,
    );

    const resultArticles: Article[] = [];

    for (let i = 0; i < numArticles; i++) {
      const articleId = userTopArticles[i];
      const articleInfoRes = await axios.request({
        method: "GET",
        url: "https://medium2.p.rapidapi.com/article/" + articleId,
        headers: {
          "X-RapidAPI-Key":
            "a2254f4486msh2f1b71806791765p16d307jsnf41a7ea0fdfc",
          "X-RapidAPI-Host": "medium2.p.rapidapi.com",
        },
      });
      const articleInfo = articleInfoRes.data;

      const articleMarkdownRes = await axios.request({
        method: "GET",
        url:
          "https://medium2.p.rapidapi.com/article/" + articleId + "/markdown",
        headers: {
          "X-RapidAPI-Key":
            "a2254f4486msh2f1b71806791765p16d307jsnf41a7ea0fdfc",
          "X-RapidAPI-Host": "medium2.p.rapidapi.com",
        },
      });
      const articleMarkdown = articleMarkdownRes.data.markdown;

      const indexOfContent =
        articleMarkdown.indexOf(articleInfo.image_url) +
        articleInfo.image_url.length +
        1;

      const resultArticle: Article = {
        title: articleInfo.title,
        subtitle: articleInfo.subtitle,
        imageUrl: articleInfo.image_url,
        minutesRead: Math.ceil(articleInfo.reading_time),
        publishedDate: new Date(
          articleInfo.published_at.split(" ")[0],
        ).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
        contentStart: articleMarkdown.substring(
          indexOfContent,
          indexOfContent + 300 - articleInfo.subtitle.length,
        ),
        articleUrl: articleInfo.url,
        topTag: articleInfo.tags?.[0],
      };

      resultArticles.push(resultArticle);
    }

    const resultProperties: BlogPostGalleryProps = {
      mediumUsername: blockProperties.mediumUsername,
      numPosts: blockProperties.numPosts,
      articles: resultArticles,
    };

    const resultBlock: ResultBlock = {
      id: jsonBlock.id,
      pageId: jsonBlock.pageId,
      order: jsonBlock.order,
      blockType: jsonBlock.blockType,
      properties: resultProperties,
      parentId: jsonBlock.parentId,
    };
    return resultBlock;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function getBlocksByParentId(
  blockId: string,
  jsonBlocks: JsonBlock[],
): Promise<JsonBlock[]> {
  const childBlocks = [];
  for (const block of jsonBlocks) {
    if (block.parentId && block.parentId === blockId) {
      childBlocks.push(block);
    }
  }
  return childBlocks;
}

async function processParentBlock(
  jsonBlock: JsonBlock,
  pageBlocks: JsonBlock[],
): Promise<ResultBlock> {
  // This is a parent block. In the case of a Paragraph, the text property will be undefined.
  const childrenBlocks = await getBlocksByParentId(jsonBlock.id, pageBlocks);
  const childrenContent: TextProps[] = [];
  for (const childBlock of childrenBlocks) {
    const childProps: JsonProperties = childBlock.properties;
    const resultChildTextProps = {
      text: childProps.text,
      align: childProps.align as "left" | "right" | "center" | "justify",
      embeddedUrl: childProps.embeddedUrl,
      bold: childProps.bold,
      italics: childProps.italics,
      underline: childProps.underline,
    };
    childrenContent.push(resultChildTextProps);
  }
  const resultParentBlock = {
    id: jsonBlock.id,
    pageId: jsonBlock.pageId,
    order: jsonBlock.order,
    blockType: jsonBlock.blockType,
    properties: jsonBlock.properties as TextProps,
    parentId: jsonBlock.parentId,
    childrenContent,
  };
  return resultParentBlock;
}
