import {
  Outlet,
  LiveReload,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "@remix-run/react";
import { AnimatePresence, motion } from "framer-motion";

export default function UserPortfolio() {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.main
        className="w-full h-full"
        key={useLocation().pathname}
      >
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </motion.main>
    </AnimatePresence>
  );
}
