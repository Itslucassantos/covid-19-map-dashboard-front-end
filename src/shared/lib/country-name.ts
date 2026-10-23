export function countryDisplayName(iso2: string, fallback: string, language: string): string {
  try {
    return new Intl.DisplayNames(language, { type: 'region' }).of(iso2.toUpperCase()) ?? fallback;
  } catch {
    return fallback;
  }
}
