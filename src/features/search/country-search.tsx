import { useId, useMemo, useState, type KeyboardEvent } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { covidQueries } from '@/shared/api/queries';
import { countryDisplayName } from '@/shared/lib/country-name';

const MAX_RESULTS = 8;

export function CountrySearch() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const listId = useId();
  const { data: countries } = useQuery(covidQueries.countries());
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return [];
    return (countries ?? [])
      .map((country) => ({
        iso2: country.iso2,
        label: countryDisplayName(country.iso2, country.name, i18n.language),
        name: country.name,
      }))
      .filter(
        (item) =>
          item.label.toLowerCase().includes(term) ||
          item.name.toLowerCase().includes(term) ||
          item.iso2.toLowerCase() === term,
      )
      .slice(0, MAX_RESULTS);
  }, [countries, query, i18n.language]);

  const select = (iso2: string) => {
    setQuery('');
    setOpen(false);
    navigate(`/country/${iso2}`);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive((index) => Math.min(index + 1, results.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((index) => Math.max(index - 1, 0));
    } else if (event.key === 'Enter' && results[active]) {
      select(results[active].iso2);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  };

  const expanded = open && results.length > 0;

  return (
    <div className="relative min-w-0 flex-1 basis-64 sm:max-w-sm">
      <svg
        className="pointer-events-none absolute left-3.5 top-3.5 text-muted"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <input
        type="search"
        role="combobox"
        aria-label={t('search.label')}
        aria-expanded={expanded}
        aria-controls={listId}
        aria-activedescendant={expanded ? `${listId}-${active}` : undefined}
        autoComplete="off"
        placeholder={t('search.placeholder')}
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setActive(0);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={onKeyDown}
        className="h-11 w-full rounded-xl border border-border bg-surface pl-[42px] pr-3.5 text-sm text-fg placeholder:text-muted"
      />
      {expanded && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-[2000] mt-1 w-full overflow-hidden rounded-xl border border-border bg-surface py-1 shadow-lg"
        >
          {results.map((item, index) => (
            <li
              key={item.iso2}
              id={`${listId}-${index}`}
              role="option"
              aria-selected={index === active}
              onMouseDown={(event) => {
                event.preventDefault();
                select(item.iso2);
              }}
              className={`flex cursor-pointer items-center justify-between px-3.5 py-2 text-sm ${
                index === active ? 'bg-accent-soft' : ''
              }`}
            >
              {item.label}
              <span className="text-xs text-muted">{item.iso2}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
