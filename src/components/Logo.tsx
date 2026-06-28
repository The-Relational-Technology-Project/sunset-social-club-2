import logo from "../assets/ssc-logo-v3.png.asset.json";

type Props = { variant?: "hero" | "nav"; className?: string };

export function Logo({ variant = "hero", className }: Props) {
  const sizes = {
    hero: "h-72 sm:h-96 md:h-[28rem]",
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
