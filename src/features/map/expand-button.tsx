import { useTranslation } from 'react-i18next';

interface ExpandButtonProps {
  expanded: boolean;
  onToggle: () => void;
}

export function ExpandButton({ expanded, onToggle }: ExpandButtonProps) {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      aria-pressed={expanded}
      aria-label={t(expanded ? 'map.collapse' : 'map.expand')}
      title={t(expanded ? 'map.collapse' : 'map.expand')}
      onClick={onToggle}
      className="absolute right-4 top-4 z-[1000] grid size-11 cursor-pointer place-items-center rounded-xl border border-border bg-surface text-fg"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {expanded ? (
          <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" />
        ) : (
          <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
        )}
      </svg>
    </button>
  );
}
