import type { SVGProps } from "react";

type ZodiacGlyphProps = SVGProps<SVGSVGElement> & {
  slug: string;
  size?: number;
  color?: string;
};

export default function ZodiacGlyph({
  slug,
  size = 18,
  color = "currentColor",
  className = "",
  ...props
}: ZodiacGlyphProps) {
  const normalizedSlug = slug.toLowerCase();

  const commonProps = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: "2",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: `zodiac-svg-glyph ${className}`,
    ...props,
  };

  switch (normalizedSlug) {
    case "aries":
      // ♈ Ram horns: curved path from center splitting into two graceful horns
      return (
        <svg {...commonProps}>
          <path d="M12 21V8" />
          <path d="M12 8C10.5 4.5 7 3.5 4.5 5.5C2 7.5 2.5 11 5 11.5" />
          <path d="M12 8C13.5 4.5 17 3.5 19.5 5.5C22 7.5 21.5 11 19 11.5" />
        </svg>
      );

    case "taurus":
      // ♉ Bull head: circle at bottom with crescent horns at top
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="14" r="6" />
          <path d="M5 4C7.5 8 16.5 8 19 4" />
        </svg>
      );

    case "gemini":
      // ♊ Twins: two vertical pillars linked by top and bottom arches
      return (
        <svg {...commonProps}>
          <path d="M4 4C8.5 6 15.5 6 20 4" />
          <path d="M4 20C8.5 18 15.5 18 20 20" />
          <path d="M9 5V19" />
          <path d="M15 5V19" />
        </svg>
      );

    case "cancer":
      // ♋ Crab: two interlocking claws/circles with swooping tails
      return (
        <svg {...commonProps}>
          <circle cx="6" cy="8" r="3" />
          <path d="M9 8C13 8 19 10 19 13" />
          <circle cx="18" cy="16" r="3" />
          <path d="M15 16C11 16 5 14 5 11" />
        </svg>
      );

    case "leo":
      // ♌ Lion: mane loop curving down into a sweeping tail
      return (
        <svg {...commonProps}>
          <circle cx="6.5" cy="15.5" r="2.5" />
          <path d="M8.5 14C9.5 8.5 15.5 5 17.5 10C19 14 18 17 21 17.5" />
        </svg>
      );

    case "virgo":
      // ♍ Maiden: M shape with looped tail and cross
      return (
        <svg {...commonProps}>
          <path d="M4 19V5C4 3.5 7 3.5 7 5V17" />
          <path d="M7 5C7 3.5 11 3.5 11 5V17" />
          <path d="M11 5C11 3.5 15 3.5 15 5V19C15 21 18 21.5 19.5 19.5C20.5 18 19.5 15 16 16" />
        </svg>
      );

    case "libra":
      // ♎ Scales: upper beam with arch over bottom horizontal line
      return (
        <svg {...commonProps}>
          <path d="M3 19H21" />
          <path d="M3 14H8C8.5 11 10 9 12 9C14 9 15.5 11 16 14H21" />
        </svg>
      );

    case "scorpius":
      // ♏ Scorpion: M shape ending in an arrow stinger
      return (
        <svg {...commonProps}>
          <path d="M4 19V5C4 3.5 7 3.5 7 5V17" />
          <path d="M7 5C7 3.5 11 3.5 11 5V17" />
          <path d="M11 5C11 3.5 15 3.5 15 5V18C15 19.5 17 19.5 18.5 18.5L21 16" />
          <path d="M17.5 16H21V19.5" />
        </svg>
      );

    case "sagittarius":
      // ♐ Archer: diagonal arrow with cross line
      return (
        <svg {...commonProps}>
          <path d="M5 19L19 5" />
          <path d="M13 5H19V11" />
          <path d="M8 12L12 16" />
        </svg>
      );

    case "capricornus":
      // ♑ Sea-goat: V with curved horn and looped fish tail
      return (
        <svg {...commonProps}>
          <path d="M4 5L8 16L12 7" />
          <path d="M12 7C14 7 16 9 16 12V16C16 18.5 19 19.5 20.5 18C21.5 17 21 14.5 18.5 14.5" />
        </svg>
      );

    case "aquarius":
      // ♒ Water bearer: two parallel wavy lines
      return (
        <svg {...commonProps}>
          <path d="M3 8L6.5 5.5L10 8L13.5 5.5L17 8L20.5 5.5" />
          <path d="M3 15L6.5 12.5L10 15L13.5 12.5L17 15L20.5 12.5" />
        </svg>
      );

    case "pisces":
      // ♓ Fishes: two outward curved arcs joined by a horizontal line
      return (
        <svg {...commonProps}>
          <path d="M6 4C9 8.5 9 15.5 6 20" />
          <path d="M18 4C15 8.5 15 15.5 18 20" />
          <path d="M3 12H21" />
        </svg>
      );

    case "ophiuchus":
      // ⛎ Serpent Bearer: U-shaped frame with entwined serpent wave
      return (
        <svg {...commonProps}>
          <path d="M7 4V14C7 17.5 10 19.5 12 19.5C14 19.5 17 17.5 17 14V4" />
          <path d="M3 11C6 9.5 8 12.5 12 11C16 9.5 18 12.5 21 11" />
        </svg>
      );

    default:
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 3V21M3 12H21" />
        </svg>
      );
  }
}
