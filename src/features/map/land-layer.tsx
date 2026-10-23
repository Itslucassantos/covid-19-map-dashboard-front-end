import { GeoJSON } from 'react-leaflet';
import { feature } from 'topojson-client';
import type { Feature, FeatureCollection, MultiPolygon, Polygon, Position } from 'geojson';
import type { GeometryCollection, Topology } from 'topojson-specification';
import topology from 'world-atlas/countries-110m.json';

const ANTARCTICA_ID = '010';

type World = Topology<{ countries: GeometryCollection }>;
type Ring = Position[];

function unwrapRing(ring: Ring): Ring {
  let offset = 0;
  return ring.map(([lng, lat], index) => {
    if (index > 0) {
      const previous = ring[index - 1][0];
      if (lng - previous > 180) offset -= 360;
      else if (previous - lng > 180) offset += 360;
    }
    return [lng + offset, lat];
  });
}

function shiftRing(ring: Ring, delta: number): Ring {
  return ring.map(([lng, lat]) => [lng + delta, lat]);
}

function normalizePolygons(polygons: Ring[][]): Ring[][] {
  return polygons.flatMap((rings) => {
    const unwrapped = rings.map(unwrapRing);
    const lngs = unwrapped[0].map(([lng]) => lng);
    if (Math.max(...lngs) > 180) return [unwrapped, unwrapped.map((r) => shiftRing(r, -360))];
    if (Math.min(...lngs) < -180) return [unwrapped, unwrapped.map((r) => shiftRing(r, 360))];
    return [unwrapped];
  });
}

const world = topology as unknown as World;
const countries = feature(world, world.objects.countries) as FeatureCollection<
  Polygon | MultiPolygon
>;

const land: FeatureCollection<MultiPolygon> = {
  type: 'FeatureCollection',
  features: countries.features
    .filter((item) => item.id !== ANTARCTICA_ID)
    .map((item): Feature<MultiPolygon> => ({
      ...item,
      geometry: {
        type: 'MultiPolygon',
        coordinates: normalizePolygons(
          item.geometry.type === 'Polygon'
            ? [item.geometry.coordinates]
            : item.geometry.coordinates,
        ),
      },
    })),
};

export function LandLayer() {
  return <GeoJSON data={land} interactive={false} style={{ className: 'land' }} />;
}
