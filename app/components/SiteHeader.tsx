/* eslint-disable @next/next/no-html-link-for-pages */
import Image from "next/image";

type SiteHeaderProps = {
  active?: "home" | "explore" | "constellations";
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

export default function SiteHeader({ active }: SiteHeaderProps) {
  return (
    <header className="site-shell-header">
      <a href="/" className="site-shell-brand" aria-label="Universe home">
        <Brand />
      </a>

      <nav aria-label="Primary navigation">
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            aria-current={active === item.active ? "page" : undefined}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
