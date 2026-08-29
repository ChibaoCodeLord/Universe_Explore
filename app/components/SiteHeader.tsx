import Link from "next/link";
import Image from "next/image";

type SiteHeaderProps = {
  active?: "home" | "explore" | "constellations";
  hardNavigation?: boolean;
};

const navItems = [
  { href: "/", label: "Home", active: "home" },
  { href: "/explore", label: "Planets", active: "explore" },
  { href: "/constellations", label: "Constellations", active: "constellations" },
] as const;

function Brand() {
  return (
    <>
      <Image
        src="/logo.png"
        alt="Universe Galaxy Logo"
        width={32}
        height={32}
        className="site-logo-icon"
        priority
      />
      <span>Universe</span>
    </>
  );
}

export default function SiteHeader({ active, hardNavigation = false }: SiteHeaderProps) {
  return (
    <header className="site-shell-header">
      {hardNavigation ? (
        // Intentional full-document navigation: release the active WebGL context
        // before loading another route from a planet detail page.
        // eslint-disable-next-line @next/next/no-html-link-for-pages
        <a href="/" className="site-shell-brand" aria-label="Universe home">
          <Brand />
        </a>
      ) : (
        <Link href="/" className="site-shell-brand" aria-label="Universe home">
          <Brand />
        </Link>
      )}

      <nav aria-label="Primary navigation">
        {navItems.map((item) =>
          hardNavigation ? (
            <a
              key={item.href}
              href={item.href}
              aria-current={active === item.active ? "page" : undefined}
            >
              {item.label}
            </a>
          ) : (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active === item.active ? "page" : undefined}
            >
              {item.label}
            </Link>
          ),
        )}
      </nav>
    </header>
  );
}
