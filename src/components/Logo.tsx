import logo from "../assets/ssc-logo.png.asset.json";
import wordmark from "../assets/ssc-script-wordmark-v2.svg.asset.json";

type Props = { variant?: "hero" | "nav" | "wordmark"; className?: string };

export function Logo({ variant = "hero", className }: Props) {
  if (variant === "wordmark") {
    return (
      <img
        src={wordmark.url}
        alt="Sunset social club"
        className={`h-16 sm:h-20 w-auto ${className ?? ""}`}
      />
    );
  }
  const sizes = {
    hero: "h-56 sm:h-64 md:h-72",
    nav: "h-20 sm:h-24",
  } as const;
  return (
    <img
      src={logo.url}
      alt="Sunset social club"
      className={`${sizes[variant]} w-auto ${className ?? ""}`}
    />
  );
}
