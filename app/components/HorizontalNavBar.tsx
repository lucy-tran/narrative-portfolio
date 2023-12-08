import { Link } from "@remix-run/react";

export default function HorizontalNavBar({
  pageTitles,
  currentPage,
}: {
  pageTitles: string[];
  currentPage: string;
}) {
  return (
    <div className="!bg-white opacity-90 w-full overflow-x-scroll pt-4 pb-4 xl:pr-2 lg:pr-4 m:pr-6 sm:pr-6 ">
      <div className="z-10 w-full flex xl:justify-center items-center ">
        {pageTitles.map((title, index) => {
          const last = index == pageTitles.length - 1;
          const targetStyling =
            currentPage === title
              ? "text-gray-800 drop-shadow-md"
              : "text-gray-400 relative w-fit block after:block after:content-[''] after:absolute after:h-[3px] after:bg-gray-400 after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-500 after:origin-left";
          return (
            <div className="flex" key={index}>
              <Link
                to={`../${title}`}
                className={
                  "text-3xl font-serif leading-tight sm:text-3xl lg:text-3xl ml-4 mr-4 sm:ml-5 sm:mr-5 lg:ml-6 lg:mr-6 " +
                  targetStyling
                }
              >
                {title}
              </Link>
              <div className="w-10 sm:w-12 lg:w-14 flex items-center">
                {/* {!first && ( */}
                <span className="h-2 w-full bg-gray-300 rounded-full" />
                {/* )} */}
              </div>
              {last && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={4}
                  stroke="currentColor"
                  className="w-7 sm:w-8 md:w-9 lg:w-10 stroke-gray-300 ml-[-18px] sm:ml-[-22px] md:ml-[-24px]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
