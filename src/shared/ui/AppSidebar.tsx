import { NavLink } from "react-router-dom";

const navigation = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/orders", label: "Orders" },
  { to: "/customers", label: "Customers" },
  { to: "/vehicles", label: "Vehicles" },
  { to: "/mechanics", label: "Mechanics" },
  { to: "/analytics", label: "Analytics" },
  { to: "/work-board", label: "Work Board" },
];

export function AppSidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <span className="sidebar__eyebrow">Operations</span>
        <span className="sidebar__title">Autoservice Dashboard</span>
      </div>

      <nav className="sidebar__nav" aria-label="Primary navigation">
        {navigation.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              isActive ? "sidebar__link sidebar__link--active" : "sidebar__link"
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
