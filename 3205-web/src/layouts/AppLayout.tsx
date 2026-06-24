import { memo } from 'react'
import { NavLink, Outlet } from 'react-router-dom'

const navigationItems = [
  { to: '/', label: 'Задания', end: true },
]

export const AppLayout = memo(() => {
  return (
    <div className="app-layout">
      <aside className="app-sidebar" aria-label="Основная навигация">
        <div className="app-sidebar__brand">3205.test</div>

        <nav className="app-sidebar__nav">
          {navigationItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                isActive ? 'app-sidebar__link app-sidebar__link--active' : 'app-sidebar__link'
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="app-content">
        <Outlet />
      </main>
    </div>
  )
})

AppLayout.displayName = 'AppLayout'
