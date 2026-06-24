import logo from "../assets/ssc-logo.png.asset.json";

type Props = { variant?: "hero" | "nav"; className?: string };

export function Logo({ variant = "hero", className }: Props) {
  const sizes = {
    hero: "h-56 sm:h-64 md:h-72",
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
