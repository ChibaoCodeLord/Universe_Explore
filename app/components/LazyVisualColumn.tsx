"use client";

import dynamic from "next/dynamic";
import type { Planet } from "@/lib/data";

const VisualColumn = dynamic(() => import("./VisualColumn"), {
  ssr: false,
  loading: () => (
    <div
      className="w-full lg:w-1/2 aspect-square max-w-[500px] rounded-full bg-white/5 animate-pulse"
      role="status"
      aria-label="Loading interactive planet"
    />
  ),
});

export default function LazyVisualColumn({ planet }: { planet: Planet }) {
  return <VisualColumn planet={planet} />;
}
