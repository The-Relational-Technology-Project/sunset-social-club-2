import logo from "../assets/ssc-logo.png.asset.json";
import wordmark from "../assets/ssc-script-wordmark-v2.svg.asset.json";

type Props = { variant?: "hero" | "nav" | "wordmark" | "wordmark-nav"; className?: string };

export function Logo({ variant = "hero", className }: Props) {
  if (variant === "wordmark" || variant === "wordmark-nav") {
    const size = variant === "wordmark-nav" ? "h-6 sm:h-7" : "h-16 sm:h-20";
    return (
      <img
        src={wordmark.url}
        alt="Sunset social club"
        className={`${size} w-auto ${className ?? ""}`}
      />
    );
  }
  const sizes = {
    hero: "h-64 sm:h-80 md:h-96",
    nav: "h-10",
  } as const;
  return (
    <img
      src={logo.url}
      alt="Sunset social club"
      className={`${sizes[variant]} w-auto ${className ?? ""}`}
    />
  );
}
