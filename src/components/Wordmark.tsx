import wordmark from "../assets/ssc-script-wordmark.svg.asset.json";

type Props = { variant?: "hero" | "nav" | "footer"; className?: string };

export function Wordmark({ variant = "hero", className }: Props) {
  const sizes: Record<NonNullable<Props["variant"]>, string> = {
    hero: "h-20 sm:h-24 md:h-28",
    nav: "h-7",
    footer: "h-6",
  };
  return (
    <img
      src={wordmark.url}
      alt="Sunset social club"
      className={`${sizes[variant]} w-auto ${className ?? ""}`}
    />
  );
}
