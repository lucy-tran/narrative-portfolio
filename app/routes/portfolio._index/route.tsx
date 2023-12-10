import { redirect } from "@remix-run/node";

export const loader = async () => {
  return redirect("../directory");
};

export default function Portfolio() {
  return <div></div>;
}
