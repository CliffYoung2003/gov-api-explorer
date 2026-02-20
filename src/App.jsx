import { useEffect, useMemo, useRef, useState } from "react";
import { policeApi, clearCache } from "./api/policeApi.js";
import LocationCard from "./components/LocationCard.jsx";
import SelectRow from "./components/SelectRow.jsx";
import CrimeList from "./components/CrimeList.jsx";
import CrimeModal from "./components/CrimeModal.jsx";
import NeighbourhoodCard from "./components/NeighbourhoodCard.jsx";

function defaultLatLng() {
  return { lat: 51.5074, lng: -0.1278 };
}

export default function App() {
  const [latLng, setLatLng] = useState(() => defaultLatLng());
  const [status, setStatus] = useState(null);

  const statusApi = useMemo(() => ({ value: status, set: setStatus }), [status]);

  const [lastUpdated, setLastUpdated] = useState(null);
  const [dates, setDates] = useState([]);
  const [date, setDate] = useState("");
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("all-crime");

  const [crimes, setCrimes] = useState([]);
  const [loadingCrimes, setLoadingCrimes] = useState(false);
  const [crimeError, setCrimeError] = useState("");

  const [nbLoading, setNbLoading] = useState(false);
  const [nbError, setNbError] = useState("");
  const [neighbourhood, setNeighbourhood] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCrime, setSelectedCrime] = useState(null);
  const [outcomeLoading, setOutcomeLoading] = useState(false);
  const [outcomeError, setOutcomeError] = useState("");
  const [outcomeData, setOutcomeData] = useState(null);

  const abortRef = useRef({ crimes: null, outcomes: null, meta: null, nb: null });

  useEffect(() => {
    const ac = new AbortController();
    abortRef.current.meta = ac;

    (async () => {
      try {
        const [lu, d] = await Promise.all([
          policeApi.lastUpdated(ac.signal),
          policeApi.streetDates(ac.signal)
        ]);
        setLastUpdated(lu?.date || null);

        const months = (d || [])
          .map((x) => x.date)
          .filter(Boolean);

        setDates(months);

        if (months.length && !date) setDate(months[0]);
      } catch (e) {
        setStatus({ type: "err", text: `Metadata load failed: ${e.message}` });
      }
    })();

    return () => ac.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!date) return;

    const ac = new AbortController();
    (async () => {
      try {
        const cats = await policeApi.categories(date, ac.signal);
        const opts = (cats || []).map((c) => ({ value: c.url, label: c.name }));
        setCategories(opts);

        const valid = new Set(opts.map((o) => o.value));
        if (category !== "all-crime" && !valid.has(category)) {
          setCategory("all-crime");
        }
      } catch (e) {
        setStatus({ type: "err", text: `Category load failed: ${e.message}` });
        setCategories([]);
      }
    })();

    return () => ac.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  useEffect(() => {
    if (latLng?.lat == null || latLng?.lng == null) return;

    const ac = new AbortController();
    abortRef.current.nb?.abort?.();
    abortRef.current.nb = ac;

    setNbLoading(true);
    setNbError("");
    setNeighbourhood(null);

    (async () => {
      try {
        const loc = await policeApi.locateNeighbourhood(latLng.lat, latLng.lng, ac.signal);
        if (!loc?.force || !loc?.neighbourhood) {
          setNeighbourhood(null);
          setNbLoading(false);
          return;
        }
        const details = await policeApi.neighbourhood(loc.force, loc.neighbourhood, ac.signal);

        setNeighbourhood({
          forceId: loc.force,
          neighbourhoodId: loc.neighbourhood,
          name: details?.name || "",
          links: details?.links || [],
          centre: details?.centre || null
        });
      } catch (e) {
        setNbError(e.message);
      } finally {
        setNbLoading(false);
      }
    })();

    return () => ac.abort();
  }, [latLng]);

  const dateOptions = useMemo(() => {
    if (!dates.length) return [{ value: "", label: "Loading…" }];
    return dates.map((d) => ({ value: d, label: d }));
  }, [dates]);

  const categoryOptions = useMemo(() => {
    const base = [{ value: "all-crime", label: "All crime (broadest)" }];
    return base.concat(categories);
  }, [categories]);

  const canSearch = Boolean(date && latLng?.lat != null && latLng?.lng != null && category);

  const runSearch = async () => {
    if (!canSearch) return;

    abortRef.current.crimes?.abort?.();
    const ac = new AbortController();
    abortRef.current.crimes = ac;

    setLoadingCrimes(true);
    setCrimeError("");
    setCrimes([]);

    try {
      const data = await policeApi.crimesStreet(
        category,
        { date, lat: latLng.lat, lng: latLng.lng },
        ac.signal
      );
      setCrimes(Array.isArray(data) ? data : []);
      setStatus({ type: "ok", text: `Loaded ${Array.isArray(data) ? data.length : 0} crimes.` });
    } catch (e) {
      setCrimeError(e.message);
    } finally {
      setLoadingCrimes(false);
    }
  };

  const openCrime = async (crime) => {
    setSelectedCrime(crime);
    setModalOpen(true);

    if (!crime?.persistent_id) {
      setOutcomeData(null);
      setOutcomeError("Outcomes not available for this record.");
      setOutcomeLoading(false);
      return;
    }

    abortRef.current.outcomes?.abort?.();
    const ac = new AbortController();
    abortRef.current.outcomes = ac;

    setOutcomeLoading(true);
    setOutcomeError("");
    setOutcomeData(null);

    try {
      const data = await policeApi.outcomesForCrime(crime.persistent_id, ac.signal);
      setOutcomeData(data);
    } catch (e) {
      setOutcomeError(e.message);
    } finally {
      setOutcomeLoading(false);
    }
  };

  const reset = () => {
    clearCache();
    setCrimes([]);
    setCrimeError("");
    setStatus({ type: "ok", text: "Cleared cache and results." });
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Gov API Explorer — UK Police Data</h1>
        <p>
          A responsive, API-driven web app (no database) that queries the UK Police API:
          available months → categories → street crimes → outcomes → neighbourhood context.
        </p>
        <p className="muted">
          {lastUpdated ? `API last updated: ${lastUpdated}` : "API last updated: …"} •
          Data source: data.police.uk
        </p>
      </div>

      <div className="grid">
        <div style={{ display: "grid", gap: 14 }}>
          <LocationCard
            lat={latLng?.lat}
            lng={latLng?.lng}
            setLatLng={setLatLng}
            status={statusApi}
          />

          <div className="card">
            <div className="cardTitle">
              <h2>Filters</h2>
              <div className="btnRow">
                <button onClick={reset}>Clear cache</button>
              </div>
            </div>
            <div className="cardBody">
              <SelectRow
                label="Month"
                value={date}
                onChange={setDate}
                options={dateOptions}
                disabled={!dates.length}
                hint="Pick a month to load valid categories for that dataset."
              />

              <SelectRow
                label="Crime category"
                value={category}
                onChange={setCategory}
                options={categoryOptions}
                disabled={!date}
                hint="Categories are loaded from the API for the selected month."
              />

              <div className="btnRow" style={{ marginTop: 6 }}>
                <button className="primary" disabled={!canSearch || loadingCrimes} onClick={runSearch}>
                  {loadingCrimes ? "Searching…" : "Search crimes"}
                </button>
              </div>

              {!canSearch ? (
                <div className="status">
                  Select a city (or use your location) and choose a month to search.
                </div>
              ) : null}
            </div>
          </div>

          <NeighbourhoodCard loading={nbLoading} data={neighbourhood} error={nbError} />
        </div>

        <div style={{ display: "grid", gap: 14 }}>
          <CrimeList
            loading={loadingCrimes}
            crimes={crimes}
            error={crimeError}
            onSelectCrime={openCrime}
          />

          <div className="card">
            <div className="cardTitle">
              <h2>Project notes</h2>
            </div>
            <div className="cardBody">
              <div className="kv">
                <div className="k">Multiple API calls</div>
                <div className="v">Dates → Categories → Crimes → Outcomes → Neighbourhood</div>
              </div>
              <div className="kv">
                <div className="k">No database</div>
                <div className="v">In-memory cache only (cleared with “Clear cache”).</div>
              </div>
              <div className="kv">
                <div className="k">Responsive</div>
                <div className="v">Single-column on mobile, split layout on desktop.</div>
              </div>
              <div className="kv">
                <div className="k">Data</div>
                <div className="v">Public open data only.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CrimeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        crime={selectedCrime}
        loading={outcomeLoading}
        outcome={outcomeData}
        error={outcomeError}
      />
    </div>
  );
}
