type Props = { variant?: "hero" | "nav"; className?: string };

export function AntennaLogo({ variant = "hero", className }: Props) {
  const isNav = variant === "nav";
  const size = isNav ? 30 : undefined;
  const ariaProps = isNav
    ? { "aria-hidden": true as const }
    : { role: "img" as const, "aria-label": "Sunset Social Club rooftop antenna" };

  return (
    <svg
      viewBox="0 0 240 250"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      className={className}
      {...ariaProps}
    >
      {!isNav && (
        <>
          <path data-sig="3" d="M 86 50 A 46 46 0 0 1 154 50" fill="none" stroke="#EC6A4C" strokeWidth="6" strokeLinecap="round" />
          <path data-sig="2" d="M 96 40 A 34 34 0 0 1 144 40" fill="none" stroke="#EC6A4C" strokeWidth="6" strokeLinecap="round" />
          <path data-sig="1" d="M 106 31 A 22 22 0 0 1 134 31" fill="none" stroke="#EC6A4C" strokeWidth="6" strokeLinecap="round" />
        </>
      )}
      <line x1="120" y1="62" x2="120" y2="232" stroke="#1D1C1A" strokeWidth="8" strokeLinecap="round" />
      <line x1="120" y1="104" x2="34" y2="58" stroke="#1D1C1A" strokeWidth="8" strokeLinecap="round" />
      <line x1="120" y1="104" x2="28" y2="82" stroke="#1D1C1A" strokeWidth="8" strokeLinecap="round" />
      <line x1="120" y1="104" x2="28" y2="108" stroke="#1D1C1A" strokeWidth="8" strokeLinecap="round" />
      <line x1="120" y1="104" x2="44" y2="132" stroke="#1D1C1A" strokeWidth="8" strokeLinecap="round" />
      <line x1="120" y1="100" x2="208" y2="70" stroke="#1D1C1A" strokeWidth="8" strokeLinecap="round" />
      <line x1="120" y1="112" x2="210" y2="108" stroke="#1D1C1A" strokeWidth="8" strokeLinecap="round" />
      <line x1="150" y1="90" x2="150" y2="120" stroke="#1D1C1A" strokeWidth="8" strokeLinecap="round" />
      <line x1="176" y1="83" x2="176" y2="115" stroke="#1D1C1A" strokeWidth="8" strokeLinecap="round" />
      <line x1="120" y1="152" x2="56" y2="142" stroke="#1D1C1A" strokeWidth="8" strokeLinecap="round" />
      <line x1="120" y1="152" x2="52" y2="164" stroke="#1D1C1A" strokeWidth="8" strokeLinecap="round" />
    </svg>
  );
}
