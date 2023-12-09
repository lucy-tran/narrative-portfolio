import { json } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import {
  Form,
  NavLink,
  LiveReload,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import { useEffect, useState } from "react";

import { getUsers } from "~/models/user.server";

// This runs when the URL changes due to a GET request,
// or when the app rerenders due to state changes
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const users = await getUsers(q);
  return json({ users, q });
};

export default function Directory() {
  const { users, q } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const submit = useSubmit();
  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has("q");
  // the query now needs to be kept in state
  const [query, setQuery] = useState(q || "");
  const [sideBarVisible, setSideBarVisible] = useState(true);

  // we still have a `useEffect` to synchronize the query
  // to the component state on back/forward button clicks
  useEffect(() => {
    setQuery(q || "");
  }, [q]);

  return (
    <body className="w-full h-screen">
      <aside
        className={
          "shrink-0 h-full sidebar w-64 lg:shadow transform transition-transform duration-150 ease-in bg-gray-50" +
          (sideBarVisible
            ? " translate-x-0"
            : " -translate-x-full lg:translate-x-0")
        }
      >
        <div className="sidebar-header flex items-center justify-center py-4">
          <div className="inline-flex">
            <a href="#" className="inline-flex flex-row items-center">
              <img
                width="48"
                height="48"
                src="https://img.icons8.com/color/96/story-book.png"
                alt="story-book"
              />
              <span className="leading-10 font-serif text-2xl font-bold ml-1">
                Narrative Portfolio
              </span>
            </a>
          </div>
        </div>
        <Form
          id="search-form"
          className="flex items-center py-6 mx-4 relative h-12 rounded-lg"
          role="search"
          onChange={(event) => {
            const isFirstSearch = q === null;
            submit(event.currentTarget, {
              replace: !isFirstSearch, // replace the previous entry in the navigation stack
            });
          }}
        >
          <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            id="q"
            aria-label="Search users"
            className="placeholder:text-lg h-12 text-sm sm:text-base placeholder-gray-500 pl-10 pr-4 rounded-lg border w-full focus:outline-none focus:border-gray-400"
            value={query}
            placeholder="Search..."
            type="search"
            name="q"
            // synchronize user's input to component state
            onChange={(event) => setQuery(event.currentTarget.value)}
          />
        </Form>
        <div className="sidebar-content px-4 py-6">
          <ul className="flex flex-col w-full">
            <li className="my-px">
              <span className="flex font-medium text-lg font-sans text-gray-500 px-3 mb-1 uppercase">
                My Portfolio
              </span>
            </li>
            <li className="my-px">
              <button className="w-full flex flex-row items-center h-10 px-3 rounded-lg text-gray-800 hover:bg-gray-100 hover:text-gray-700">
                <span className="flex items-center justify-center text-lg text-green-400">
                  <svg
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                <span className="text-lg ml-3 font-sans">Create mine</span>
              </button>
            </li>
            <li className="my-px">
              <span className="flex font-medium text-lg font-sans text-gray-500 px-3 mt-3 mb-1 uppercase">
                Explore
              </span>
            </li>
            {users?.map((user) => (
              <li key={user.id} className="my-px">
                <NavLink
                  className={
                    "flex flex-row items-center h-10 px-3 rounded-lg text-lg text-gray-800 hover:bg-gray-100 hover:text-gray-700" +
                    (({
                      isActive,
                      isPending,
                    }: {
                      isActive: boolean;
                      isPending: boolean;
                    }) => (isActive ? "active" : isPending ? "pending" : ""))
                  }
                  to={`../directory/${user.name}`}
                >
                  {user.firstName || user.lastName ? (
                    <>
                      {user.firstName} {user.lastName}
                    </>
                  ) : (
                    <i>No name</i>
                  )}{" "}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </aside>
      <main className="main flex flex-col flex-grow -ml-64 lg:ml-0 transition-all duration-150 ease-in">
        <header className="header bg-white shadow py-4 px-4">
          <div className="header-content flex items-center flex-row">
            <button className="w-8 h-8 lg:hidden border-0 bg-[url('https://img.icons8.com/cute-clipart/64/menu.png')]"/>
            <div className="flex ml-auto">
              <button className="border-0 flex flex-row items-center pr-2">
                <img
                  width="64"
                  height="64"
                  src="https://img.icons8.com/cute-clipart/64/gender-neutral-user.png"
                  alt="gender-neutral-user"
                />
                <span className="font-semibold font-sans leading-none ml-2">
                  John Doe
                </span>
              </button>
            </div>
          </div>
        </header>
        <div
          id="detail"
          className="main-content flex flex-col flex-grow p-4"
          onClick={() => setSideBarVisible(false)}
          onKeyDown={() => setSideBarVisible(true)}
          role="navigation"
        >
          <h1 className="font-bold font-serif text-3xl pl-1 text-gray-700">
            Portfolio Overview
          </h1>
          <div
            className={
              "mt-2 shadow-md flex-1 w-full px-8 py-8" +
              (navigation.state === "loading" && !searching
                ? "opacity-25 duration-200 delay-200"
                : "")
            }
            id="detail"
          >
            <Outlet />
          </div>
        </div>
        <footer className="footer px-4 py-6">
          <div className="footer-content">
            <p className="text-sm`` text-gray-600 text-center">
              © Narrative Portfolio 2023. All rights reserved.{" "}
            </p>
          </div>
        </footer>
      </main>
      <ScrollRestoration />
      <Scripts />
      <LiveReload />
    </body>
  );
}
