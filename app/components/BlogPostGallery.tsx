import type { Article, BlogPostGalleryProps } from "~/models/block.server";

export default function BlogPostGallery({
  properties,
}: {
  properties: BlogPostGalleryProps;
}) {
  const articles = properties.articles;
  return (
    <section className="py-4 bg-gray-50 px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
      <div className="grid max-w-md grid-cols-1 gap-6 mx-auto my-3 lg:grid-cols-3 lg:max-w-full rounded-md">
        {articles.map((article: Article, index: number) => {
          return (
            <div
              key={index}
              className="overflow-hidden bg-white rounded-md shadow h-98"
            >
              <div className="p-5">
                <div className="relative">
                  <a
                    href={article.articleUrl}
                    target="_blank"
                    title=""
                    className="block aspect-[3/2]"
                  >
                    <img
                      className="object-cover w-full h-full"
                      src={article.imageUrl}
                      alt=""
                    />
                  </a>
                  {article.topTag && (
                    <div className="absolute top-4 left-4">
                      <span className="px-4 py-2 text-xs font-semibold font-sans tracking-widest text-gray-900 uppercase bg-white rounded-full">
                        {" "}
                        {article.topTag}{" "}
                      </span>
                    </div>
                  )}
                </div>
                <span className="block mt-6 text-sm font-sans font-semibold tracking-widest text-gray-500 uppercase">
                  {" "}
                  {article.publishedDate} &bull; {article.minutesRead} minutes
                  read{" "}
                </span>
                <div className="flex-1">
                  <p className="mt-5 text-2xl font-semibold">
                    <a
                      href={article.articleUrl}
                      target="_blank"
                      title=""
                      className="text-black font-serif"
                    >
                      {" "}
                      {article.title}{" "}
                    </a>
                  </p>
                  <p className="mt-4 text-gray-600 font-sans text-lg">
                    {article.subtitle}
                  </p>
                  <p className="mt-4 text-gray-600 font-sans text-lg font-light line-clamp-4">
                    {article.contentStart}
                  </p>
                </div>
                <a
                  href={article.articleUrl}
                  target="_blank"
                  title=""
                  className="font-sans inline-flex items-center justify-center pb-0.5 mt-5 text-base font-semibold text-blue-600 transition-all duration-200 border-b-2 border-transparent hover:border-blue-600 focus:border-blue-600"
                >
                  Continue Reading
                  <svg
                    className="w-5 h-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-center mt-8 space-x-3 lg:hidden">
        <button
          type="button"
          className="flex items-center justify-center text-gray-400 transition-all duration-200 bg-transparent border border-gray-300 rounded w-9 h-9 hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <button
          type="button"
          className="flex items-center justify-center text-gray-400 transition-all duration-200 bg-transparent border border-gray-300 rounded w-9 h-9 hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </section>
  );
}
