import { Carousel } from "@material-tailwind/react";

import type { ParagraphProps, ResultProperties } from "~/models/block.server";

import Text from "./Text";

export default function Paragraph({
  order,
  properties,
  childrenContent,
}: {
  order: number;
  properties: ParagraphProps;
  childrenContent: ResultProperties[] | undefined;
}) {
  const direction = order % 2 == 0 ? "flex-row" : "flex-row-reverse";
  const padding =
    order % 2 == 0
      ? "pr-8 mr-auto sm:pr-10 lg:pr-16"
      : "ml-auto md:pl-10 lg:pl-16";

  const imageCarousel = properties.images && (
    <Carousel className="w-full md:w-1/2 lg:w-1/3 flex items-center">
      {properties.images.map((image: string | undefined, index: number) => (
        <img
          key={index}
          src={image}
          alt={index.toString()}
          className="h-full w-full object-cover rounded-xl"
        />
      ))}
    </Carousel>
  );
  return (
    <div
      className={`flex flex-wrap ${direction} w-full px-8 mx-auto sm:px-10 lg:px-16`}
    >
      {properties.text ? (
        // This is just a normal text block
        <div
          className={`flex-1 text-lg font-light ${padding} font-sans text-black text-${properties.align} font-sans`}
        >
          {properties.text}
        </div>
      ) : (
        // This is a nested text block
        <Text
          blockType="Text"
          properties={{ align: properties.align }}
          childrenContent={childrenContent}
        />
      )}
      {imageCarousel}
    </div>
  );
}
