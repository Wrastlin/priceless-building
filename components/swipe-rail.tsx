import { cn } from "@/lib/utils";

/**
 * Mobile: horizontal snap-scroll rail (Rejuvenation-style).
 * md+: normal CSS grid — pass grid cols via `className` (e.g. `md:grid-cols-3`).
 */
export function SwipeRail({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        "md:mx-0 md:grid md:gap-8 md:overflow-visible md:px-0 md:pb-0",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Pair with SwipeRail — fixed card width on mobile, fluid in the md+ grid. */
export function SwipeCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("w-[min(78vw,20rem)] shrink-0 snap-center md:w-auto md:shrink", className)}>
      {children}
    </div>
  );
}
