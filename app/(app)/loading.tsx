// Shown instantly while a page's data loads, so sidebar clicks respond right away.
export default function Loading() {
  return (
    <div className="stack" aria-busy="true" aria-label="Loading">
      <div>
        <div className="sk" style={{ width: 140, height: 14 }} />
        <div className="sk" style={{ width: 280, height: 30, marginTop: 10 }} />
      </div>
      <div className="sk" style={{ height: 120 }} />
      <div className="sk" style={{ height: 64 }} />
      <div className="sk" style={{ height: 64 }} />
      <div className="sk" style={{ height: 64 }} />
    </div>
  );
}
