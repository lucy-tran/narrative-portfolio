import { useNavigate } from "@remix-run/react";

export default function Footer({
  prevPage,
  nextPage,
}: {
  prevPage?: string | null;
  nextPage?: string | null;
}) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-row w-full my-8 bg-transparent bottom-8">
      <div className="flex w-full h-full items-center justify-center gap-2 px-8 mx-auto sm:px-10 md:px-16 lg:px-24 py-8 relative bg-transparent">
        <div className="flex items-center gap-4 relative flex-1 self-stretch grow">
          {prevPage ? <button
              onClick={() => navigate(`../${prevPage}`)}
              className="flex items-center justify-center gap-2 py-2 relative flex-[0_0_auto] bg-white rounded-[8px] hover:-translate-x-4 transition duration-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={4}
                stroke="#DDDDDD"
                className="w-6 h-6 !relative !flex-[0_0_auto]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>

              <div className="relative w-fit font-serif text-3xl whitespace-nowrap">
                Previous
              </div>
            </button> : null}
        </div>
        <div className="flex items-center justify-end relative flex-1 self-stretch grow">
          {nextPage ? <button
              onClick={() => navigate(`../${nextPage}`)}
              className="flex items-center justify-center gap-2 py-2 relative flex-[0_0_auto] bg-white rounded-[8px] hover:translate-x-4 transition duration-500"
            >
              <div className="relative w-fit font-serif text-3xl whitespace-nowrap">
                {nextPage === "./" ? "Back to Home" : "Next"}
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={4}
                stroke="#DDDDDD"
                className="w-6 h-6 !relative !flex-[0_0_auto]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </button> : null}
        </div>
      </div>
    </div>
  );
}
