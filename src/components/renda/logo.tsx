export function RendaLogo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="1" y="1" width="22" height="22" rx="7" fill="currentColor" />
        <path
          d="M8.4 17V7.4h4.05c1.9 0 3.05 1.05 3.05 2.72 0 1.24-.68 2.15-1.8 2.5L15.9 17h-2.15l-1.95-4.02h-1.5V17H8.4Zm1.9-5.55h1.95c.93 0 1.45-.44 1.45-1.25 0-.8-.52-1.24-1.45-1.24H10.3v2.49Z"
          fill="var(--color-background)"
        />
      </svg>
      <span className="text-[17px] font-semibold tracking-tight">Renda</span>
    </span>
  );
}
