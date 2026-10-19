"use client";

const STEPS = [
  { key: "scan", label: "Scan ID" },
  { key: "verify", label: "Verify Face" },
  { key: "confirm", label: "Confirm" },
  { key: "complete", label: "Done" },
] as const;

interface CheckinHeaderProps {
  activeStep: (typeof STEPS)[number]["key"] | "start";
}

export default function CheckinHeader({ activeStep }: CheckinHeaderProps) {
  const activeIndex = STEPS.findIndex((s) => s.key === activeStep);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-center gap-2 mb-6">
        <div className="h-8 w-8 rounded-lg bg-brand-accent flex items-center justify-center text-white font-bold text-sm">
          H
        </div>
        <span className="font-semibold text-slate-800 tracking-tight">
          Hotel Check-In
        </span>
      </div>

      {activeStep !== "start" && (
        <div className="flex items-center justify-between max-w-md mx-auto">
          {STEPS.map((step, i) => {
            const isDone = i < activeIndex;
            const isActive = i === activeIndex;
            return (
              <div key={step.key} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={[
                      "h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors",
                      isDone
                        ? "bg-green-500 text-white"
                        : isActive
                        ? "bg-brand-accent text-white"
                        : "bg-slate-200 text-slate-500",
                    ].join(" ")}
                  >
                    {isDone ? "✓" : i + 1}
                  </div>
                  <span
                    className={[
                      "text-[11px] font-medium whitespace-nowrap",
                      isActive ? "text-brand-accent" : "text-slate-400",
                    ].join(" ")}
                  >
                    {step.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={[
                      "h-0.5 flex-1 mx-1 mb-4 rounded transition-colors",
                      isDone ? "bg-green-500" : "bg-slate-200",
                    ].join(" ")}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
