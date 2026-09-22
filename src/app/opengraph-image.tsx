import { ImageResponse } from "next/og";
import { person } from "@/content/site";

export const alt = `${person.name}: ${person.headline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "#08090b", color: "#ffffff" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 24, letterSpacing: 4, color: "#a7adb6" }}>
          <div style={{ width: 14, height: 14, borderRadius: 14, background: "#7ce0b0" }} />
          {person.name.toUpperCase()} · OPERATOR WHO BUILDS
        </div>
        <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2, maxWidth: 980 }}>{person.headline}</div>
        <div style={{ display: "flex", gap: 56, fontSize: 30, color: "#e9ebee" }}>
          <span>~$210K/mo losses cut</span>
          <span>0 → 50K orders/day</span>
          <span>99.6% reconciled</span>
        </div>
      </div>
    ),
    size,
  );
}
