import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export const Container = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8", className)} {...props} />
  ),
);
Container.displayName = "Container";

export function Section({
  className,
  tone = "surface",
  children,
  ...props
}: HTMLAttributes<HTMLElement> & { tone?: "surface" | "muted" | "primary" }) {
  const toneClasses = {
    surface: "bg-[hsl(var(--surface))]",
    muted: "bg-[hsl(var(--surface-muted))]",
    primary: "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]",
  }[tone];
  return (
    <section className={cn("py-14 sm:py-20", toneClasses, className)} {...props}>
      {children}
    </section>
  );
}

export function Heading({
  level = 2,
  className,
  children,
}: {
  level?: 1 | 2 | 3 | 4;
  className?: string;
  children: ReactNode;
}) {
  const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4";
  const sizes = {
    1: "text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight",
    2: "text-3xl sm:text-4xl font-bold tracking-tight",
    3: "text-2xl sm:text-3xl font-semibold",
    4: "text-xl font-semibold",
  }[level];
  return <Tag className={cn(sizes, className)}>{children}</Tag>;
}

export function Prose({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("prose prose-neutral max-w-none text-[hsl(var(--text))] prose-headings:text-[hsl(var(--text))] prose-a:text-[hsl(var(--primary))]", className)}>
      {children}
    </div>
  );
}

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-[hsl(var(--surface))] p-6 shadow-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}
