import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import invariant from "tiny-invariant";

import { getUserByUsername } from "~/models/user.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.userName, "Missing userName param");
  const user = await getUserByUsername(params.userName);
  if (!user) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ user });
};

export default function PortfolioOverview() {
  const { user } = useLoaderData<typeof loader>();
  return (
    <div className="w-full h-full flex flex-wrap justify-center">
      <Link
        className="w-48 max-h-64 mr-8 rounded-lg "
        to={`../../portfolio/${user.name}`}
      >
        <img
          className="w-full h-full object-cover"
          alt={`${user.firstName} ${user.lastName}`}
          key={user.profilePic}
          src={
            user.profilePic ??
            "https://img.icons8.com/cute-clipart/64/gender-neutral-user.png"
          }
        />
      </Link>
      <div className="flex-1 flex flex-col">
        <h1 className="font-serif text-semibold text-4xl text-gray-700 mt-4 sm:mt-0 mb-4">
          {user.firstName || user.lastName ? (
            <>
              {user.firstName} {user.lastName}
            </>
          ) : (
            <i>No Name</i>
          )}{" "}
        </h1>
        {user.bio ? <p className="font-semibold font-sans text-lg text-gray-700 mb-4">
            {user.bio}
          </p> : null}
        {user.intro ? <p className="font-light font-sans text-lg">{user.intro}</p> : null}

        <div className="mt-4">
          <Link
            className="text-blue-500 hover:text-blue-700 text-lg"
            to={`../../portfolio/${user.name}`}
          >
            Check out my portfolio! &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
