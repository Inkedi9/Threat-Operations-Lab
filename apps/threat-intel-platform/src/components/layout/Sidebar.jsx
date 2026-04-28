import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Search,
  Radar,
  Crosshair,
  BriefcaseBusiness,
  Target,
  GitCompare,
  FileText,
} from 'lucide-react';

const navItems = [
  { id: 'overview', label: 'Overview', href: '/', icon: LayoutDashboard },
  { id: 'investigate', label: 'Investigate', href: '/investigate', icon: Search },
  { id: 'campaigns', label: 'Campaigns', href: '/campaigns', icon: Radar },
  { id: 'actors', label: 'Actors', href: '/actors', icon: Crosshair },
  { id: 'compare', label: 'Compare', href: '/compare', icon: GitCompare },
  { id: 'hunting', label: 'Hunting', href: '/hunting', icon: Target },
  { id: 'reports', label: 'Reports', href: '/reports', icon: FileText },
  { id: 'workbench', label: 'Workbench', href: '/workbench', icon: BriefcaseBusiness },
];

function isActiveRoute(pathname, href) {
  if (href === '/') return pathname === '/';
  return pathname.startsWith(href);
}

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="hidden border-r border-gold/10 bg-black/70 xl:sticky xl:top-0 xl:flex xl:h-screen xl:flex-col xl:items-center xl:px-4 xl:py-5">
      <Link
        to="/"
        className="grid h-14 w-14 place-items-center rounded-[1.4rem] border border-gold/18 bg-gold/10 text-sm font-black tracking-[0.18em] text-gold-soft shadow-[0_0_24px_rgba(221,183,106,0.18)]"
        title="Threat Intelligence Platform"
      >
        TI
      </Link>

      <nav className="mt-6 flex flex-1 flex-col gap-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActiveRoute(location.pathname, item.href);

          return (
            <Link
              key={item.id}
              to={item.href}
              title={item.label}
              aria-label={item.label}
              className={`group relative grid h-13 w-13 place-items-center rounded-[1.15rem] border transition ${active
                ? 'border-gold/28 bg-gold/10 text-gold-soft shadow-[0_0_24px_rgba(221,183,106,0.16)]'
                : 'border-white/8 bg-white/[0.03] text-muted hover:border-gold/18 hover:text-gold-soft'
                }`}
            >
              <Icon size={18} strokeWidth={1.8} />

              <span className="pointer-events-none absolute left-[4.2rem] top-1/2 z-50 hidden -translate-y-1/2 whitespace-nowrap rounded-xl border border-gold/14 bg-black/90 px-3 py-2 text-xs text-gold-soft opacity-0 shadow-xl backdrop-blur transition group-hover:block group-hover:opacity-100">
                {item.label}
              </span>

              {active && (
                <span className="absolute -right-[1.05rem] h-8 w-1 rounded-full bg-gold shadow-[0_0_18px_rgba(221,183,106,0.8)]" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="rounded-full border border-white/8 bg-white/[0.03] px-2 py-3 text-[10px] uppercase tracking-[0.2em] text-muted [writing-mode:vertical-rl]">
        CTI
      </div>
    </aside>
  );
}