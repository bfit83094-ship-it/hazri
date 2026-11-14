import React from 'react';
import { ArrowLeft, ArrowRight, BookMarked, WifiOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { useProfile } from '../hooks/useProfile';
import { BottomNav, SideRailNav } from './BottomNav';
import { InstallBanner } from './InstallBanner';
import { Toast } from './Toast';

interface AppShellProps {
  title: string;
  backTo?: string;
  headerAction?: React.ReactNode;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  title,
  backTo,
  headerAction,
  children,
}) => {
  const navigate = useNavigate();
  const isOnline = useOnlineStatus();
  const { isPreviewMode, user } = useAuth();
  const { t, isRTL } = useLanguage();
  const profileQuery = useProfile();

  const profileName =
    profileQuery.data?.full_name ||
    (user?.user_metadata?.full_name as string | undefined) ||
    t.settings.accountSection;
  const profileEmail = profileQuery.data?.email || user?.email || '';
  const profileAvatar =
    profileQuery.data?.avatar_url ||
    (user?.user_metadata?.avatar_url as string | undefined) ||
    null;

  return (
    <div className="min-h-dvh bg-[#F6F8F7] text-[#0F172A] flex">
      <Toast />

      {/* Desktop / Tablet Right-side Rail (RTL start side) */}
      <aside className="hidden md:flex md:flex-col md:w-64 lg:w-72 shrink-0 bg-white border-e border-[#E2E8F0] sticky top-0 h-dvh p-5 justify-between">
        <div>
          <div className="flex items-center gap-3 pb-6 mb-5 border-b border-[#E2E8F0]">
            <img
              src="/icons/icon-192.png"
              alt={t.appName}
              className="w-10 h-10 rounded-xl shrink-0"
            />
            <div className="min-w-0">
              <p className="font-nastaliq text-xl font-bold text-[#0F766E] truncate">
                {t.appName}
              </p>
            </div>
          </div>

          <SideRailNav />

          <div className="mt-5 pt-5 border-t border-[#E2E8F0]">
            <Link
              to="/classes"
              className="min-h-[44px] flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-[#64748B] hover:bg-slate-100 hover:text-[#0F172A] transition-colors whitespace-nowrap"
            >
              <BookMarked className="w-5 h-5 shrink-0" aria-hidden="true" />
              <span>{t.nav.classes}</span>
            </Link>
          </div>
        </div>

        <div className="pt-4 border-t border-[#E2E8F0]">
          {isPreviewMode && (
            <p className="text-xs text-[#B45309] mb-2 font-medium">
              {t.auth.previewBanner}
            </p>
          )}
          <div className="flex items-center gap-3">
            {profileAvatar ? (
              <img
                src={profileAvatar}
                alt={profileName}
                referrerPolicy="no-referrer"
                className="w-9 h-9 rounded-full object-cover border border-[#E2E8F0] shrink-0"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-[#CCFBF1] text-[#0F766E] flex items-center justify-center font-bold text-sm shrink-0">
                {(profileName[0] ?? 'ا').toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#0F172A] truncate">
                {profileName}
              </p>
              {profileEmail && (
                <p className="text-xs text-[#64748B] truncate" dir="ltr">
                  {profileEmail}
                </p>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Column */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Compact Sticky Top App Bar (52px high for <= 15% mobile sticky cap) */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] pt-safe">
          <div className="max-w-5xl mx-auto h-[52px] px-4 md:px-6 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              {backTo && (
                <button
                  type="button"
                  onClick={() => navigate(backTo)}
                  aria-label={t.common.back}
                  className="min-h-[44px] min-w-[44px] -ms-2 flex items-center justify-center rounded-xl text-[#0F172A] hover:bg-slate-100 transition-colors shrink-0"
                >
                  {isRTL ? (
                    <ArrowRight className="w-5 h-5" aria-hidden="true" />
                  ) : (
                    <ArrowLeft className="w-5 h-5" aria-hidden="true" />
                  )}
                </button>
              )}
              <h1 className="text-lg md:text-xl font-bold text-[#0F172A] truncate">
                {title}
              </h1>
            </div>

            {headerAction ? (
              <div className="shrink-0">{headerAction}</div>
            ) : (
              <div className="md:hidden shrink-0">
                <span className="text-xs font-medium text-[#0F766E]">
                  {t.appShortName}
                </span>
              </div>
            )}
          </div>
        </header>

        {/* Offline Banner */}
        {!isOnline && (
          <div
            role="alert"
            className="bg-[#D97706] text-white px-4 py-2 text-xs md:text-sm font-medium flex items-center justify-center gap-2"
          >
            <WifiOff className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{t.common.offlineBanner}</span>
          </div>
        )}

        {/* Preview Notice on Mobile */}
        {isPreviewMode && (
          <div className="md:hidden bg-[#CCFBF1]/70 text-[#115E59] px-4 py-1.5 text-xs font-medium text-center border-b border-[#0F766E]/15">
            {t.auth.previewBanner}
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 max-w-5xl w-full mx-auto px-4 md:px-6 py-4 pb-24 md:pb-8">
          <InstallBanner />
          {children}
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <BottomNav />
    </div>
  );
};
