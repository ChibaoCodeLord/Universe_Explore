import Link from "next/link";

type SiteHeaderProps = {
  active?: "home" | "explore" | "constellations";
};

export default function SiteHeader({ active }: SiteHeaderProps) {
  return (
    <header className="site-shell-header">
      <Link href="/" className="site-shell-brand" aria-label="Universe home">
        Universe
      </Link>

      <nav aria-label="Primary navigation">
        <Link href="/" aria-current={active === "home" ? "page" : undefined}>
          Home
        </Link>
        <Link
          href="/explore"
          aria-current={active === "explore" ? "page" : undefined}
        >
          Planets
        </Link>
        <Link
          href="/constellations"
          aria-current={active === "constellations" ? "page" : undefined}
        >
          Constellations
        </Link>
      </nav>
    </header>
  );
}
