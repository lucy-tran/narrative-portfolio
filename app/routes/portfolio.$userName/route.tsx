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
        // initial={{ x: "5%", opacity: 0 }}
        // animate={{ x: "0", opacity: 1 }}
        // exit={{ y: "5%", opacity: 0 }}
        initial={{ y: "0.25%", opacity: 0 }}
        animate={{ y: "0", opacity: 1 }}
        exit={{ y: "-0.25%", opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </motion.main>
    </AnimatePresence>
  );
}
