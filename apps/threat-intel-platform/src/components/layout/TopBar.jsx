import { Link, useLocation } from 'react-router-dom';
import { Bell, Command, PanelTop, Radar, Search, Shield, Sparkles } from 'lucide-react';

const routeAccent = {
  '/': { label: 'Overview', icon: PanelTop },
  '/investigate': { label: 'Investigate', icon: Search },
  '/campaigns': { label: 'Campaigns', icon: Radar },
  '/actors': { label: 'Actors', icon: Shield },
  '/workbench': { label: 'Workbench', icon: Command },
  '/compare': { label: 'Compare', icon: Sparkles },
  '/reports': { label: 'Reports', icon: Bell },
};

function resolveRoute(pathname) {
  if (pathname.startsWith('/investigate')) return routeAccent['/investigate'];
  if (pathname.startsWith('/campaigns')) return routeAccent['/campaigns'];
  if (pathname.startsWith('/actors')) return routeAccent['/actors'];
  if (pathname.startsWith('/workbench')) return routeAccent['/workbench'];
  if (pathname.startsWith('/compare')) return routeAccent['/compare'];
  if (pathname.startsWith('/reports')) return routeAccent['/reports'];
  return routeAccent['/'];
}

export default function TopBar({ currentQuery, onQuickInvestigate }) {
  const location = useLocation();
  const accent = resolveRoute(location.pathname);
  const AccentIcon = accent.icon;

  return (
    <header className="fixed left-0 right-0 top-0 z-50 xl:left-24">
      <div className="border-b border-gold/12 bg-[rgba(7,7,8,0.72)] px-4 py-3 backdrop-blur-2xl sm:px-6 xl:px-7">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-gold/18 bg-gold/10 text-gold-soft shadow-[0_0_24px_rgba(221,183,106,0.14)]">
              <AccentIcon size={18} />
            </div>
            <div className="min-w-0">
              <div className="label-caps text-gold">Threat Intelligence Platform · Phase 4</div>
              <div className="truncate text-sm font-semibold tracking-[0.01em] text-ivory sm:text-base">
                Fixed command bar · current context <span className="text-gold-soft">{accent.label}</span>
              </div>
            </div>
          </div>

          <div className="hidden min-w-0 flex-1 items-center justify-center px-4 lg:flex">
            <button
              type="button"
              onClick={() => onQuickInvestigate(currentQuery)}
              className="flex w-full max-w-2xl items-center gap-3 rounded-full border border-gold/16 bg-black/50 px-4 py-3 text-left text-sm text-muted transition hover:border-gold/26 hover:text-gold-soft"
            >
              <Search size={16} className="text-gold-soft" />
              <span className="truncate">Quick investigate: {currentQuery}</span>
            </button>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Link
              to="/compare"
              className="hidden rounded-full border border-white/8 bg-white/[0.03] px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-muted transition hover:border-gold/18 hover:text-gold-soft sm:inline-flex"
            >
              Compare
            </Link>
            <Link
              to="/workbench"
              className="rounded-full border border-gold/18 bg-gold/10 px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-gold-soft transition hover:bg-gold/14"
            >
              Analyst State
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
