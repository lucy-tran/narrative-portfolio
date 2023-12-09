import { redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";

export const action = async () => {
  // only for POST requests
  return redirect(`/directory/`);
};

export default function Index() {
  return (
    <div className="h-screen w-full">
        <img
          alt="background"
          src="https://github.com/lucy-tran/lucytran-portfolio/assets/54861558/20ac45d4-3f2f-4030-a9c8-404d8112dba0"
          className="absolute z-[-1] w-full h-full bg-white opacity-50 object-cover"
        />
        <div className="w-full h-full flex flex-col self-center justify-center items-center">
          <h1 className="text-center font-serif font-bold text-5xl 2xl:text-6xl mb-8 shadow-white px-8 mx-auto sm:px-10 md:px-16 lg:px-24 ">
            Welcome to Narrative Portfolio
          </h1>
          <h2 className="text-center font-serif text-3xl 2xl:text-4xl mb-12 px-8 mx-auto sm:px-10 md:px-16 lg:px-24">
            where achievements are more than just numbers
          </h2>
          <Form method="post">
            <button
              className="bg-red-300 hover:bg-red-400 font-serif text-white text-2xl 2xl:text-3xl font-bold py-5 px-5 rounded-full mx-auto sm:px-10 lg:px-16 hover:translate-y-1 duration-500"
              type="submit"
            >
              Explore now
            </button>
          </Form>
        </div>
    </div>
  );
}
