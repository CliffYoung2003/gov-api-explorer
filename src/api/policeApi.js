const BASE = "https://data.police.uk/api";

const cache = new Map();

export async function fetchJson(path, { signal } = {}) {
  const url = `${BASE}${path}`;
  if (cache.has(url)) return cache.get(url);

  const res = await fetch(url, { signal });
  if (!res.ok) {
    throw new Error(`Request failed (${res.status}) for ${path}`);
  }
  const data = await res.json();
  cache.set(url, data);
  return data;
}

export function clearCache() {
  cache.clear();
}

export const policeApi = {
  lastUpdated: (signal) => fetchJson("/crime-last-updated", { signal }),
  streetDates: (signal) => fetchJson("/crimes-street-dates", { signal }),
  categories: (date, signal) =>
    fetchJson(`/crime-categories?date=${encodeURIComponent(date)}`, { signal }),
  crimesStreet: (category, { date, lat, lng }, signal) =>
    fetchJson(
      `/crimes-street/${encodeURIComponent(category)}?date=${encodeURIComponent(
        date
      )}&lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}`,
      { signal }
    ),
  outcomesForCrime: (crimeId, signal) =>
    fetchJson(`/outcomes-for-crime/${encodeURIComponent(crimeId)}`, { signal }),
  locateNeighbourhood: (lat, lng, signal) =>
    fetchJson(`/locate-neighbourhood?q=${encodeURIComponent(`${lat},${lng}`)}`, { signal }),
  neighbourhood: (forceId, neighbourhoodId, signal) =>
    fetchJson(`/${encodeURIComponent(forceId)}/${encodeURIComponent(neighbourhoodId)}`, { signal })
};
