import { useEffect, useMemo } from 'react';
import { CircleMarker, MapContainer, Popup, useMap } from 'react-leaflet';
import type { LatLngBoundsLiteral } from 'leaflet';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { covidQueries } from '@/shared/api/queries';
import { useApiErrorMessage } from '@/shared/api/use-api-error-message';
import { countryDisplayName } from '@/shared/lib/country-name';
import { formatNumber } from '@/shared/lib/format';
import { markerRadius } from '@/shared/lib/marker-radius';
import { ErrorState } from '@/shared/ui/error-state';
import { LandLayer } from './land-layer';
import { MapLegend } from './map-legend';
import { metricColors, metricValue, type MapMetric } from './map-metric';

const WORLD_BOUNDS: LatLngBoundsLiteral = [
  [-56, -170],
  [82, 180],
];

function FitWorld() {
  const map = useMap();

  useEffect(() => {
    const fit = () => {
      const zoom = map.getBoundsZoom(WORLD_BOUNDS, true);
      map.setMinZoom(zoom);
      if (map.getZoom() < zoom) map.setView([20, 10], zoom, { animate: false });
    };
    fit();
    map.on('resize', fit);
    return () => void map.off('resize', fit);
  }, [map]);

  return null;
}

function SyncSize() {
  const map = useMap();

  useEffect(() => {
    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(map.getContainer());
    return () => observer.disconnect();
  }, [map]);

  return null;
}

function FlyToSelected({ position }: { position?: [number, number] }) {
  const map = useMap();
  const [lat, lng] = position ?? [];

  useEffect(() => {
    if (lat === undefined || lng === undefined) return;
    map.flyTo([lat, lng], Math.max(map.getZoom(), 4), { duration: 0.8 });
  }, [map, lat, lng]);

  return null;
}

interface CovidMapProps {
  metric: MapMetric;
  selectedIso2?: string;
}

export function CovidMap({ metric, selectedIso2 }: CovidMapProps) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const errorMessage = useApiErrorMessage();
  const { data: countries, error, refetch } = useQuery(covidQueries.countries());

  const max = useMemo(
    () => Math.max(0, ...(countries ?? []).map((country) => metricValue(country, metric))),
    [countries, metric],
  );
  const selected = countries?.find((country) => country.iso2 === selectedIso2?.toUpperCase());
  const colors = metricColors[metric];

  return (
    <div
      className="relative h-full w-full"
      style={{ '--m': colors.fill, '--mt': colors.stroke } as React.CSSProperties}
    >
      <MapContainer
        center={[20, 10]}
        zoom={2}
        zoomSnap={0.25}
        maxBounds={[
          [-70, -200],
          [90, 200],
        ]}
        maxBoundsViscosity={1}
        zoomControl={false}
        attributionControl={false}
        className="h-full w-full"
      >
        <SyncSize />
        <FitWorld />
        <FlyToSelected position={selected ? [selected.lat, selected.lng] : undefined} />
        <LandLayer />
        {countries?.map((country) => {
          const isSelected = country.iso2 === selected?.iso2;
          const value = country[metric];
          return (
            <CircleMarker
              key={country.iso2}
              center={[country.lat, country.lng]}
              radius={markerRadius(metricValue(country, metric), max)}
              pathOptions={{
                className: `covid-marker${isSelected ? ' covid-marker--selected' : ''}`,
              }}
              eventHandlers={{ click: () => navigate(`/country/${country.iso2}`) }}
            >
              <Popup closeButton={false}>
                <div className="flex items-center gap-2 text-[15px] font-extrabold">
                  {countryDisplayName(country.iso2, country.name, i18n.language)}
                  <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-bold text-accent-text">
                    {country.iso2}
                  </span>
                </div>
                <div className="tabular mt-2 text-2xl font-extrabold">
                  {value === null ? '—' : formatNumber(value, i18n.language)}
                </div>
                <div className="text-xs text-muted">
                  {t(`stats.${metric}`)}
                  {metric === 'cases' && (
                    <>
                      {' · '}
                      <span className="font-bold text-accent-text">
                        +{formatNumber(country.todayCases, i18n.language)} {t('map.today')}
                      </span>
                    </>
                  )}
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
      <MapLegend metric={metric} max={max} />
      {error && (
        <div className="absolute left-4 top-20 z-[1000] rounded-xl border border-border bg-surface p-3">
          <ErrorState message={errorMessage(error)} onRetry={() => void refetch()} />
        </div>
      )}
    </div>
  );
}
