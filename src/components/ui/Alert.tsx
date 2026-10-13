import type { ReactNode } from "react";

type Variant = "info" | "success" | "warning" | "error";

const variants: Record<Variant, string> = {
  info: "border-[#b2ddff] bg-[#eff8ff] text-[#004eba]",
  success: "border-[#a6f4c5] bg-[#ecfdf3] text-[#067647]",
  warning: "border-[#fedf89] bg-[#fffaeb] text-[#b25e09]",
  error: "border-[#fecdca] bg-[#fef3f2] text-[#b42318]",
};

export function Alert({ children, variant = "info" }: { children: ReactNode; variant?: Variant }) {
  return (
    <div className={"rounded-[8px] border px-4 py-3 text-sm " + variants[variant]}>{children}</div>
  );
}
