const SIZES = {
  sm: { icon: "h-6 w-6", word: "text-base", tagline: "text-[9px] mt-0.5", gap: "gap-1.5" },
  md: { icon: "h-8 w-8", word: "text-xl", tagline: "text-[10px] mt-0.5", gap: "gap-2" },
  lg: { icon: "h-11 w-11", word: "text-2xl", tagline: "text-xs mt-1", gap: "gap-2.5" },
} as const;

// Two color variants of the same mark: "light" for placement on light
// surfaces, "dark" for placement on the sidebar/header — a single
// fixed-color PNG would go invisible on one of the two, so this is an
// inline SVG that recolors instead. Same icon shape and colors as the
// shop's own LoopWearLogo (components/LoopWearLogo.tsx in the storefront
// repo). These are the company's actual brand colors (navy + gold) as
// fixed hex, not the admin theme's `--color-brand-*` tokens — the logo is
// the EveryOccasion identity and should look the same no matter what
// palette this console's own UI chrome is using (see globals.css).
const COLORS = {
  light: { fill: "#172B4D", stroke: "#D69A2D", dot: "#FDFBF7", first: "#172B4D", second: "#D69A2D", tagline: "text-ink-muted" },
  dark: { fill: "#FDFBF7", stroke: "#D69A2D", dot: "#172B4D", first: "#FDFBF7", second: "#D69A2D", tagline: "text-brand-cream/50" },
} as const;

export function Logo({
  size = "md",
  variant = "light",
  showWordmark = true,
  showTagline = false,
  className,
}: {
  size?: keyof typeof SIZES;
  variant?: keyof typeof COLORS;
  showWordmark?: boolean;
  showTagline?: boolean;
  className?: string;
}) {
  const s = SIZES[size];
  const c = COLORS[variant];

  return (
    <span className={`inline-flex items-center ${s.gap} ${className ?? ""}`}>
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={`${s.icon} shrink-0`}>
        <path
          d="M12.6 2.6 21.4 11.4a2 2 0 0 1 0 2.8l-7.2 7.2a2 2 0 0 1-2.8 0L2.6 12.6A2 2 0 0 1 2 11.2V4a2 2 0 0 1 2-2h7.2a2 2 0 0 1 1.4.6Z"
          fill={c.fill}
          stroke={c.stroke}
          strokeWidth={1.4}
          strokeLinejoin="round"
        />
        <circle cx="7.2" cy="7.2" r="1.5" fill={c.dot} />
      </svg>

      {showWordmark ? (
        <span className="flex flex-col leading-none">
          {/* font-ui, not font-display — matches the shop's own wordmark,
              which has no font override and inherits its body's font-ui. */}
          <span className={`font-ui font-extrabold tracking-[-0.02em] leading-none ${s.word}`}>
            <span style={{ color: c.first }}>Every</span>
            <span style={{ color: c.second }}>Occasion</span>
          </span>
          {showTagline ? (
            <span className={`font-ui font-medium uppercase tracking-[0.18em] ${s.tagline} ${c.tagline}`}>Admin Console</span>
          ) : null}
        </span>
      ) : null}
    </span>
  );
}
