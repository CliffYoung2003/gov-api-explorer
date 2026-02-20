export default function CrimeModal({ open, onClose, crime, loading, outcome, error }) {
  if (!open) return null;

  const street = crime?.location?.street?.name || "Unknown street";
  const hasPersistentId = Boolean(crime?.persistent_id);

  const outcomes = outcome?.outcomes || [];
  const count = Array.isArray(outcomes) ? outcomes.length : 0;

  return (
    <div className="modalOverlay" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modalHeader">
          <strong>Crime outcomes</strong>
          <button onClick={onClose}>Close</button>
        </div>

        <div className="modalBody">
          {crime ? (
            <>
              <div className="kv">
                <div className="k">Category</div>
                <div className="v">{crime.category || "—"}</div>
              </div>
              <div className="kv">
                <div className="k">Month</div>
                <div className="v">{crime.month || "—"}</div>
              </div>
              <div className="kv">
                <div className="k">Street</div>
                <div className="v">{street}</div>
              </div>
              <div className="kv">
                <div className="k">Persistent ID</div>
                <div className="v">{crime.persistent_id || "Not available for this record"}</div>
              </div>
            </>
          ) : null}

          {!hasPersistentId ? (
            <div className="status">
              Outcomes can’t be fetched for this record because the API did not provide a persistent ID.
              Try another result.
            </div>
          ) : null}

          {loading ? <div className="status">Loading outcomes…</div> : null}
          {error ? <div className="status err">{error}</div> : null}

          {!loading && !error && hasPersistentId ? (
            <>
              <div className="kv">
                <div className="k">Outcomes returned</div>
                <div className="v">{count}</div>
              </div>

              {count > 0 ? (
                <div className="list">
                  {outcomes.map((o, i) => {
                    const outcomeName = o?.category?.name || "Outcome";
                    const outcomeDate = o?.date || "—";

                    const personId = o?.person_id || null;
                    const crimeCategory = o?.crime?.category || null;
                    const hasExtra = Boolean(personId || crimeCategory);

                    return (
                      <div className="item" key={i}>
                        <div className="itemTop">
                          <div className="title">{outcomeName}</div>
                          <div className="small">{outcomeDate}</div>
                        </div>

                        {hasExtra ? (
                          <div className="meta">
                            {personId ? (
                              <div>
                                <span className="muted">Person ID:</span> {personId}
                              </div>
                            ) : null}
                            {crimeCategory ? (
                              <div>
                                <span className="muted">Crime category:</span> {crimeCategory}
                              </div>
                            ) : null}
                          </div>
                        ) : (
                          <div className="muted" style={{ fontSize: 12, lineHeight: 1.45 }}>
                            No additional outcome metadata provided for this record.
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="status">No outcome records returned for this crime.</div>
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
