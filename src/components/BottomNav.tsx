import React from 'react';
import { BookOpen, ClipboardCheck, Settings, Users } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useT } from '../contexts/LanguageContext';

export const BottomNav: React.FC = () => {
  const t = useT();
  const navItems = [
    { to: '/attendance', label: t.nav.attendance, icon: ClipboardCheck },
    { to: '/lessons', label: t.nav.lessons, icon: BookOpen },
    { to: '/students', label: t.nav.students, icon: Users },
    { to: '/settings', label: t.nav.settings, icon: Settings },
  ] as const;

  return (
    <nav
      aria-label={t.nav.primaryAria}
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E2E8F0] pb-safe"
    >
      <div className="grid grid-cols-4 h-16 items-center">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `min-h-[48px] flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors whitespace-nowrap ${
                isActive
                  ? 'text-[#0F766E] font-bold'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`px-3 py-1 rounded-full transition-colors ${
                    isActive ? 'bg-[#CCFBF1]' : ''
                  }`}
                >
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </span>
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export const SideRailNav: React.FC = () => {
  const t = useT();
  const navItems = [
    { to: '/attendance', label: t.nav.attendance, icon: ClipboardCheck },
    { to: '/lessons', label: t.nav.lessons, icon: BookOpen },
    { to: '/students', label: t.nav.students, icon: Users },
    { to: '/settings', label: t.nav.settings, icon: Settings },
  ] as const;

  return (
    <nav aria-label={t.nav.sideAria} className="flex flex-col gap-1.5">
      {navItems.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `min-h-[48px] flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
              isActive
                ? 'bg-[#CCFBF1] text-[#0F766E] font-bold'
                : 'text-[#0F172A] hover:bg-slate-100'
            }`
          }
        >
          <Icon className="w-5 h-5 shrink-0" aria-hidden="true" />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
};
