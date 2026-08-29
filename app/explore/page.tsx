import type { Metadata } from "next";
import SiteHeader from "@/app/components/SiteHeader";
import { planets } from "@/lib/data";
import ExploreExperience from "./ExploreExperience";
import "./explore.css";

export const metadata: Metadata = {
  title: "Explore the Solar System | Universe",
  description:
    "Travel from Mercury to Neptune in an interactive orbit map, then open any world in detailed 3D.",
};

type ExplorePageProps = {
  searchParams: Promise<{
    view?: string | string[];
    planet?: string | string[];
  }>;
};

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const query = await searchParams;
  const requestedView = Array.isArray(query.view) ? query.view[0] : query.view;
  const requestedPlanet = Array.isArray(query.planet)
    ? query.planet[0]
    : query.planet;
  const initialPlanet = planets.some((planet) => planet.slug === requestedPlanet)
    ? requestedPlanet
    : "earth";

  return (
    <div className="explore-page">
      <div className="explore-sky" aria-hidden="true" />
      <SiteHeader active="explore" hardNavigation />
      <ExploreExperience
        initialView={requestedView === "orbit" ? "orbit" : "gallery"}
        initialPlanet={initialPlanet ?? "earth"}
      />
    </div>
  );
}
