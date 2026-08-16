export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background">
      <div className="relative flex size-28 items-center justify-center">
        <span className="animate-radar-ring absolute inset-0 rounded-full border-2 border-primary" />
        <span className="animate-radar-ring absolute inset-0 rounded-full border-2 border-primary [animation-delay:0.7s]" />
        <span className="animate-radar-ring absolute inset-0 rounded-full border-2 border-primary [animation-delay:1.4s]" />

        <svg viewBox="0 0 100 100" className="relative size-16" aria-hidden="true">
          <circle cx="50" cy="50" r="48" className="fill-primary/10" />
          <g className="animate-radar-sweep origin-[50px_50px]">
            <path d="M50 50 L50 4 A46 46 0 0 1 91 62 Z" className="fill-primary/40" />
          </g>
          <circle cx="50" cy="50" r="48" className="fill-none stroke-primary/30" strokeWidth="1.5" />
          <path
            d="M50 26c-9.4 0-17 7.6-17 17 0 12.7 17 33 17 33s17-20.3 17-33c0-9.4-7.6-17-17-17Z"
            className="fill-primary stroke-background"
            strokeWidth="2"
          />
          <circle cx="50" cy="43" r="6" className="fill-background" />
        </svg>
      </div>
    </div>
  );
}
