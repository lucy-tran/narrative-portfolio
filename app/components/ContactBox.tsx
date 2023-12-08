import { Form } from "@remix-run/react";
import { ContactBoxProps } from "~/models/block.server";

export default function ContactBox({
  properties,
}: {
  properties: ContactBoxProps;
}) {
  return (
    <div className="flex flex-col w-full lg:w-2/3 gap-4 px-8 mx-auto sm:px-10 lg:px-16 py-4">
      <h2 className="w-full text-center font-serif text-4xl">
        {properties.headline}
      </h2>
      <div className="w-full bg-red-200 h-1 rounded-full drop-shadow-md" />
      <div className="flex flex-wrap-reverse">
        <div className="flex-1 flex flex-col gap-2">
          {properties.phone && (
            <div className="w-full inline-flex">
              <img
                src="https://img.icons8.com/ios/100/apple-phone.png"
                className="w-8 h-8"
              />
              <p className="font-sans font-light text-lg pl-4">
                {properties.phone}
              </p>
            </div>
          )}
          {properties.websites?.map(
            (website: { logoUrl: string; url: string }, index: number) => (
              <div key={index} className="w-full inline-flex items-center">
                <img src={website.logoUrl} className="w-8 h-8" />
                <p className="font-sans font-light text-lg pl-4">
                  {website.url}
                </p>
              </div>
            ),
          )}
          <Form className="w-full flex flex-col gap-2 pr-8">
            <p className="font-sans font-light text-lg">or email me:</p>
            <input
              placeholder="Your name or email"
              className="placeholder:font-sans placeholder:font-light w-full rounded-lg px-4 py-2 bg-gray-100"
            />
            <input
              placeholder="Subject"
              className="placeholder:font-sans placeholder:font-light w-full rounded-lg px-4 py-2  bg-gray-100"
            />
            <input
              placeholder="Message"
              className="placeholder:font-sans placeholder:font-light placeholder:-translate-y-7 placeholder:align-top w-full align-top rounded-lg h-24 px-4 py-2 bg-gray-100"
            />
          </Form>
        </div>
        <div className="w-full sm:w-1/2 md:w-1/3 aspect-square flex items-center justify-center mb-4">
          <img src={properties.image} className="rounded-full object-cover" />
        </div>
      </div>
    </div>
  );
}
