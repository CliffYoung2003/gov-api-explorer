export default function NeighbourhoodCard({ loading, data, error }) {
  return (
    <div className="card">
      <div className="cardTitle">
        <h2>Neighbourhood (by location)</h2>
      </div>
      <div className="cardBody">
        {loading ? <div className="status">Loading neighbourhood…</div> : null}
        {error ? <div className="status err">{error}</div> : null}
        {!loading && !error && data ? (
          <>
            <div className="kv">
              <div className="k">Force</div>
              <div className="v">{data.forceId}</div>
            </div>
            <div className="kv">
              <div className="k">Neighbourhood</div>
              <div className="v">{data.neighbourhoodId}</div>
            </div>
            <div className="kv">
              <div className="k">Name</div>
              <div className="v">{data.name || "—"}</div>
            </div>
            <div className="kv">
              <div className="k">Links</div>
              <div className="v">
                {data.links?.length ? (
                  <ul style={{ margin: 0, paddingLeft: 18 }}>
                    {data.links.slice(0, 5).map((l, i) => (
                      <li key={i}>
                        <a href={l.url} target="_blank" rel="noreferrer">{l.title || l.url}</a>
                        {l.description ? <span className="muted"> — {l.description}</span> : null}
                      </li>
                    ))}
                  </ul>
                ) : (
                  "—"
                )}
              </div>
            </div>
            <div className="kv">
              <div className="k">Centre</div>
              <div className="v">
                {data.centre ? `${data.centre.latitude}, ${data.centre.longitude}` : "—"}
              </div>
            </div>
          </>
        ) : (
          !loading && !error ? <div className="status">Set a location to load neighbourhood info.</div> : null
        )}
      </div>
    </div>
  );
}
