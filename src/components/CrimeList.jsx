export default function CrimeList({ loading, crimes, error, onSelectCrime }) {
  return (
    <div className="card">
      <div className="cardTitle">
        <h2>Results</h2>
      </div>
      <div className="cardBody">
        {loading ? <div className="status">Loading crimes…</div> : null}
        {error ? <div className="status err">{error}</div> : null}

        {!loading && !error ? (
          <>
            <div className="kv">
              <div className="k">Crimes returned</div>
              <div className="v">{crimes?.length ?? 0}</div>
            </div>

            {crimes?.length ? (
              <div className="list">
                {crimes.slice(0, 250).map((c) => {
                  const street = c.location?.street?.name || "Unknown street";
                  const when = c.month || "—";
                  return (
                    <div key={c.id} className="item">
                      <div className="itemTop">
                        <div className="title">{c.category?.replaceAll("-", " ")}</div>
                        <div className="small">{when}</div>
                      </div>
                      <div className="meta">
                        <div><span className="muted">Location:</span> {street}</div>
                        <div><span className="muted">Persistent ID:</span> {c.persistent_id ? c.persistent_id.slice(0, 14) + "…" : "—"}</div>
                      </div>
                      {c.persistent_id ? (
                        <button className="primary" onClick={() => onSelectCrime(c)}>View outcomes</button>
                      ) : (
                        <div className="muted" style={{ fontSize: 12 }}>
                          Outcomes not available (no persistent_id for this record).
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="status">No crimes returned for the selected filters.</div>
            )}

            {crimes?.length > 250 ? (
              <div className="status">
                Showing first 250 records for performance. Try narrowing the category/date.
              </div>
            ) : null}
          </>
        ) : null}
      </div>
    </div>
  );
}
