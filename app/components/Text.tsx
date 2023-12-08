import type { ResultProperties, TextProps } from "~/models/block.server";

export default function Text({
  blockType,
  properties,
  childrenContent,
}: {
  blockType: string;
  properties: TextProps;
  childrenContent?: ResultProperties[];
}) {
  let textClasses = "font-sans font-light text-lg";
  let emptyLineHeight = "h-4";
  switch (blockType) {
    case "H1":
      textClasses = "font-serif text-3xl sm:text-4xl lg:text-5xl";
      emptyLineHeight = "h-3xl sm:h-4xl lg:h-5xl";
      break;
    case "H2":
      textClasses = "font-serif text-2xl sm:text-3xl lg:text-4xl";
      emptyLineHeight = "h-2xl sm:h-3xl lg:h-4xl";
      break;
    case "H3":
      textClasses = "font-serif text-xl sm:text-2xl lg:text-3xl";
      emptyLineHeight = "h-xl sm:h-2xl lg:h-3xl";
      break;
  }

  if (childrenContent && Object.keys(properties).length === 0) {
    // This text block has inline stylings
    return (
      <div className="self-stretch w-full px-8 mx-auto sm:px-10 lg:px-16">
        {childrenContent.map((child: ResultProperties, index: number) => {
          const bold = child.bold ? "font-bold" : "";
          const italics = child.italics ? "italic" : "";
          const underline = child.underline ? "underline" : "";
          if (child.embeddedUrl) {
            return (
              <a
                key={index}
                href={child.embeddedUrl}
                target="_blank"
                rel="noreferrer"
                className={`inline text-blue-500 hover:text-blue-800 hover:cursor-pointer ${bold} ${italics} ${underline} ${textClasses}`}
              >
                {child.text}
              </a>
            );
          }
          return (
            <p
              key={index}
              className={`inline ${bold} ${italics} ${underline} ${textClasses}`}
            >
              {child.text}
            </p>
          );
        })}
      </div>
    );
  }

  if (properties.text?.trim() === "") {
    return <div className={`w-full ${emptyLineHeight}`} />;
  }

  return (
    <div
      className={`self-stretch w-full px-8 mx-auto sm:px-10 lg:px-16 font-sans text-black text-${properties.align} ${textClasses}`}
    >
      {properties.text}
    </div>
  );
}
