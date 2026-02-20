import { useEffect, useMemo, useState } from "react";

function round6(n) {
  const x = Number(n);
  if (!Number.isFinite(x)) return "";
  return Math.round(x * 1e6) / 1e6;
}

export default function LocationCard({ lat, lng, setLatLng, status }) {
  const cities = useMemo(
    () => [
      { label: "Select a city…", lat: null, lng: null },
      { label: "London", lat: 51.5074, lng: -0.1278 },
      { label: "Manchester", lat: 53.4808, lng: -2.2426 },
      { label: "Birmingham", lat: 52.4862, lng: -1.8904 },
      { label: "Leeds", lat: 53.8008, lng: -1.5491 },
      { label: "Liverpool", lat: 53.4084, lng: -2.9916 },
      { label: "Bristol", lat: 51.4545, lng: -2.5879 },
      { label: "Newcastle upon Tyne", lat: 54.9783, lng: -1.6178 },
      { label: "Sheffield", lat: 53.3811, lng: -1.4701 },
      { label: "Nottingham", lat: 52.9548, lng: -1.1581 },
      { label: "Edinburgh", lat: 55.9533, lng: -3.1883 },
      { label: "Glasgow", lat: 55.8642, lng: -4.2518 },
      { label: "Cardiff", lat: 51.4816, lng: -3.1791 },
      { label: "Belfast", lat: 54.5973, lng: -5.9301 }
    ],
    []
  );

  const initialCityIndex = useMemo(() => {
    if (lat == null || lng == null) return 0;
    const idx = cities.findIndex(
      (c) =>
        c.lat != null &&
        c.lng != null &&
        Math.abs(c.lat - lat) < 0.0001 &&
        Math.abs(c.lng - lng) < 0.0001
    );
    return idx > 0 ? idx : 0;
  }, [cities, lat, lng]);

  const [cityIndex, setCityIndex] = useState(initialCityIndex);
  const [latInput, setLatInput] = useState(lat ?? "");
  const [lngInput, setLngInput] = useState(lng ?? "");

  useEffect(() => {
    if (lat != null) setLatInput(lat);
    if (lng != null) setLngInput(lng);
  }, [lat, lng]);

  const applyLatLng = (la, lo, message = "Location updated.") => {
    setLatInput(la);
    setLngInput(lo);
    setLatLng({ lat: la, lng: lo });
    status.set({ type: "ok", text: message });
  };

  const onPickCity = (idxStr) => {
    const idx = Number(idxStr);
    setCityIndex(idx);

    const chosen = cities[idx];
    if (!chosen || chosen.lat == null || chosen.lng == null) return;

    const la = round6(chosen.lat);
    const lo = round6(chosen.lng);
    applyLatLng(la, lo, `Set location to ${chosen.label}.`);
  };

  const applyManual = () => {
    const la = Number(latInput);
    const lo = Number(lngInput);
    if (!Number.isFinite(la) || !Number.isFinite(lo)) {
      status.set({ type: "err", text: "Please enter valid numeric latitude and longitude." });
      return;
    }
    applyLatLng(round6(la), round6(lo));
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      status.set({ type: "err", text: "Geolocation is not supported in this browser." });
      return;
    }
    status.set({ type: "info", text: "Requesting location permission…" });
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const la = round6(pos.coords.latitude);
        const lo = round6(pos.coords.longitude);
        setCityIndex(0);
        applyLatLng(la, lo, "Using your current location.");
      },
      (err) => {
        status.set({ type: "err", text: `Could not get location: ${err.message}` });
      },
      { enableHighAccuracy: false, timeout: 10000 }
    );
  };

  return (
    <div className="card">
      <div className="cardTitle">
        <h2>Location</h2>
      </div>

      <div className="cardBody">
        <div className="row">
          <div className="label">Pick a city</div>
          <select value={cityIndex} onChange={(e) => onPickCity(e.target.value)}>
            {cities.map((c, i) => (
              <option key={c.label} value={i}>
                {c.label}
              </option>
            ))}
          </select>
          <div className="muted" style={{ fontSize: 12 }}>
            Choose a city to auto-fill latitude/longitude.
          </div>
        </div>

        <div className="row">
          <div className="label">Latitude (optional)</div>
          <input
            className="input"
            value={latInput}
            onChange={(e) => {
              setCityIndex(0);
              setLatInput(e.target.value);
            }}
            placeholder="e.g. 51.5074"
          />
        </div>

        <div className="row">
          <div className="label">Longitude (optional)</div>
          <input
            className="input"
            value={lngInput}
            onChange={(e) => {
              setCityIndex(0);
              setLngInput(e.target.value);
            }}
            placeholder="e.g. -0.1278"
          />
        </div>

        <div className="btnRow">
          <button className="primary" onClick={applyManual}>Apply</button>
          <button onClick={useMyLocation}>Use my location</button>
        </div>

        <div className="kv" style={{ marginTop: 10 }}>
          <div className="k">Current lat/lng</div>
          <div className="v">{lat != null && lng != null ? `${lat}, ${lng}` : "Not set"}</div>
        </div>

        {status.value ? (
          <div className={`status ${status.value.type === "err" ? "err" : status.value.type === "ok" ? "ok" : ""}`}>
            {status.value.text}
          </div>
        ) : null}
      </div>
    </div>
  );
}
