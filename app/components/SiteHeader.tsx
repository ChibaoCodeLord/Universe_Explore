import Link from "next/link";

type SiteHeaderProps = {
  active?: "home" | "explore";
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
          Explore
        </Link>
      </nav>
    </header>
  );
}
