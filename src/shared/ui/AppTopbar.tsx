type AppTopbarProps = {
  title: string;
};

export function AppTopbar({ title }: AppTopbarProps) {
  return (
    <header className="topbar">
      <div className="topbar__meta">
        <span className="topbar__kicker">Autoservice Operations</span>
        <strong className="topbar__title">{title}</strong>
      </div>

      <div className="topbar__controls">
        <input
          className="topbar__search"
          type="search"
          placeholder="Search orders, customers, vehicles"
          aria-label="Global search"
        />
        <span className="topbar__pill">Mock data offline-ready</span>
      </div>
    </header>
  );
}
