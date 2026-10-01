const LOREM_IPSUM =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

function isLightColor(hexColor: string): boolean {
  const hex = hexColor.replace("#", "");
  if (hex.length !== 6) {
    return true;
  }
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 160;
}

interface CompanyEmailPreviewProps {
  primaryColor: string;
  secondaryColor: string;
  signature?: string;
  companyImageURL?: string;
  companyName: string;
}

export default function CompanyEmailPreview({ primaryColor, secondaryColor, signature, companyImageURL, companyName }: CompanyEmailPreviewProps) {
  const isLight = isLightColor(primaryColor);
  const outerBg = isLight ? "#F8FAFC" : primaryColor;
  const cardBg = isLight ? "#FFFFFF" : "#1E293B";
  const cardBorder = isLight ? "#E2E8F0" : "rgba(255, 255, 255, 0.1)";
  const bodyTextColor = isLight ? "#334155" : "#CBD5E1";
  const mutedTextColor = isLight ? "#64748B" : "#94A3B8";
  const badgeBg = isLight ? "#F1F5F9" : "#0F172A";
  const badgeBorder = isLight ? "#E2E8F0" : "#334155";
  const footerBg = isLight ? "#F8FAFC" : "rgba(0, 0, 0, 0.2)";
  const footerBorder = isLight ? "#E2E8F0" : "rgba(255, 255, 255, 0.08)";

  return (
    <div className="overflow-hidden rounded-lg border" style={{ backgroundColor: outerBg, borderColor: cardBorder }}>
      <div className="h-1" style={{ backgroundColor: secondaryColor }} />
      <div className="mx-auto my-4 max-w-md overflow-hidden rounded-xl border" style={{ backgroundColor: cardBg, borderColor: cardBorder }}>
        <div className="flex flex-col items-center gap-2 px-8 pt-6 pb-2">
          {companyImageURL ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={companyImageURL} alt={companyName} className="max-h-12 max-w-50 object-contain" />
          ) : (
            <span
              className="rounded-full border px-4 py-1.5 text-xs font-bold tracking-wide uppercase"
              style={{ backgroundColor: badgeBg, borderColor: badgeBorder, color: secondaryColor }}
            >
              {companyName}
            </span>
          )}
        </div>
        <div className="px-8 pt-4 pb-6 text-sm leading-relaxed" style={{ color: bodyTextColor }}>
          <p>{LOREM_IPSUM}</p>
          {signature && (
            <p className="mt-6 whitespace-pre-line" style={{ color: mutedTextColor }}>
              {signature}
            </p>
          )}
        </div>
        <div className="border-t px-8 py-4 text-center text-xs" style={{ backgroundColor: footerBg, borderColor: footerBorder, color: mutedTextColor }}>
          Sent by <strong style={{ color: bodyTextColor }}>{companyName}</strong> via OutScout.
        </div>
      </div>
    </div>
  );
}
