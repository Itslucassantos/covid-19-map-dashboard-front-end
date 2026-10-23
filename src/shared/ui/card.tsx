import type { ReactNode } from 'react';

interface CardProps {
  title: ReactNode;
  highlighted?: boolean;
  children: ReactNode;
}

export function Card({ title, highlighted = false, children }: CardProps) {
  return (
    <section
      className={`rounded-[20px] bg-surface px-[22px] py-5 ${
        highlighted ? 'border-2 border-accent' : 'border border-border'
      }`}
    >
      <h2 className="mb-1.5 text-[13px] font-semibold text-muted">{title}</h2>
      {children}
    </section>
  );
}
