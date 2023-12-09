import { LoaderFunctionArgs, redirect } from '@remix-run/node';

export const loader = async ({ params }: LoaderFunctionArgs) => {
  return redirect("../directory")
}

export default function Portfolio() {
  return <div></div>
}