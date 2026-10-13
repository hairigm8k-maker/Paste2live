import type { ReactNode } from "react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={
      "rounded-[16px] bg-white p-6 shadow-[rgba(71,103,136,0.04)_0px_4px_5px_0px,rgba(71,103,136,0.03)_0px_4px_10px_0px,rgba(71,103,136,0.05)_0px_10px_20px_0px] " +
      className
    }>
      {children}
    </div>
  );
}
