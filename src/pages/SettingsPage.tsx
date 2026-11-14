import React, { useState } from 'react';
import {
  BookMarked,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  Languages,
  LogOut,
  Smartphone,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { LanguageToggle } from '../components/LanguageToggle';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../contexts/ToastContext';
import { useInstallPrompt } from '../hooks/useInstallPrompt';
import { useProfile } from '../hooks/useProfile';

export const SettingsPage: React.FC = () => {
  const { user, isPreviewMode, signOut } = useAuth();
  const { isRTL, t } = useLanguage();
  const profileQuery = useProfile();
  const { isInstallable, isInstalled, isIOS, install } = useInstallPrompt();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  const profile = profileQuery.data;
  const fullName =
    profile?.full_name ||
    (user?.user_metadata?.full_name as string | undefined) ||
    (user?.user_metadata?.name as string | undefined) ||
    t.settings.accountSection;
  const email = profile?.email || user?.email || '';
  const avatarUrl =
    profile?.avatar_url ||
    (user?.user_metadata?.avatar_url as string | undefined) ||
    (user?.user_metadata?.picture as string | undefined) ||
    null;

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await signOut();
      setLogoutConfirmOpen(false);
      navigate('/login', { replace: true });
    } catch {
      showToast(t.common.saveError, 'error');
      setLoggingOut(false);
    }
  };

  return (
    <AppShell title={t.settings.title}>
      <div className="space-y-4">
        {/* Profile Card */}
        <section
          aria-labelledby="account-heading"
          className="bg-white rounded-2xl border border-[#E2E8F0] p-4 md:p-5"
        >
          <h2
            id="account-heading"
            className="text-xs font-semibold text-[#64748B] mb-3"
          >
            {t.settings.accountSection}
          </h2>
          <div className="flex items-center gap-3.5">
            {avatarUrl && !avatarError ? (
              <img
                src={avatarUrl}
                alt={fullName}
                referrerPolicy="no-referrer"
                onError={() => setAvatarError(true)}
                className="w-14 h-14 rounded-full object-cover border border-[#E2E8F0] shrink-0"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-[#CCFBF1] text-[#0F766E] flex items-center justify-center text-xl font-bold shrink-0">
                {(fullName[0] ?? 'ا').toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-lg font-bold text-[#0F172A] truncate">
                {fullName}
              </p>
              {email && (
                <p className="text-sm text-[#64748B] truncate" dir="ltr">
                  {email}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Language / Zaban Switch Card */}
        <section
          aria-labelledby="language-heading"
          className="bg-white rounded-2xl border border-[#E2E8F0] p-4 md:p-5 flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-[#CCFBF1] text-[#0F766E] flex items-center justify-center shrink-0">
              <Languages className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h2
                id="language-heading"
                className="text-base font-bold text-[#0F172A]"
              >
                {t.settings.languageSection}
              </h2>
              <p className="text-xs text-[#64748B]">{t.settings.languageHint}</p>
            </div>
          </div>

          <div className="shrink-0">
            <LanguageToggle />
          </div>
        </section>

        {/* Classes Management Link */}
        <Link
          to="/classes"
          className="bg-white rounded-2xl border border-[#E2E8F0] p-4 flex items-center justify-between gap-3 hover:border-[#0F766E]/45 transition-colors"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-[#CCFBF1] text-[#0F766E] flex items-center justify-center shrink-0">
              <BookMarked className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-base font-bold text-[#0F172A]">
                {t.settings.classesLinkTitle}
              </p>
              <p className="text-xs text-[#64748B]">
                {t.settings.classesLinkSubtitle}
              </p>
            </div>
          </div>
          {isRTL ? (
            <ChevronLeft className="w-5 h-5 text-[#64748B] shrink-0" aria-hidden="true" />
          ) : (
            <ChevronRight className="w-5 h-5 text-[#64748B] shrink-0" aria-hidden="true" />
          )}
        </Link>

        {/* PWA Install Section */}
        <section
          aria-labelledby="install-heading"
          className="bg-white rounded-2xl border border-[#E2E8F0] p-4 md:p-5 space-y-3"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#F6F8F7] border border-[#E2E8F0] text-[#0F766E] flex items-center justify-center shrink-0">
                <Smartphone className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <h2
                  id="install-heading"
                  className="text-base font-bold text-[#0F172A]"
                >
                  {t.settings.installSection}
                </h2>
                {isInstalled && (
                  <p className="text-xs font-semibold text-[#16A34A] inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{t.settings.installedBadge}</span>
                  </p>
                )}
              </div>
            </div>

            {!isInstalled && isInstallable && (
              <button
                type="button"
                onClick={install}
                className="min-h-[44px] px-4 py-2 rounded-xl bg-[#0F766E] text-white text-sm font-bold inline-flex items-center gap-2 hover:bg-[#115E59] transition-colors whitespace-nowrap shrink-0"
              >
                <Download className="w-4 h-4" aria-hidden="true" />
                <span>{t.settings.installButton}</span>
              </button>
            )}
          </div>

          {!isInstalled && (
            <div className="rounded-xl bg-[#F6F8F7] border border-[#E2E8F0] p-3.5 space-y-2 text-xs md:text-sm text-[#64748B]">
              <p className="font-bold text-[#0F172A]">
                {t.settings.manualInstallTitle}
              </p>
              {!isIOS && <p>{t.settings.manualInstallAndroid}</p>}
              <p>{t.settings.manualInstallIOS}</p>
            </div>
          )}
        </section>

        {/* Logout */}
        <button
          type="button"
          onClick={() => setLogoutConfirmOpen(true)}
          className="w-full min-h-[48px] rounded-2xl border border-[#DC2626]/30 bg-white text-[#DC2626] text-base font-bold inline-flex items-center justify-center gap-2 hover:bg-[#DC2626]/5 transition-colors"
        >
          <LogOut className="w-5 h-5" aria-hidden="true" />
          <span>{isPreviewMode ? t.auth.exitPreview : t.auth.logout}</span>
        </button>
      </div>

      <ConfirmDialog
        open={logoutConfirmOpen}
        title={t.auth.logoutConfirmTitle}
        description={t.auth.logoutConfirmBody}
        confirmLabel={t.auth.logout}
        destructive
        busy={loggingOut}
        onCancel={() => setLogoutConfirmOpen(false)}
        onConfirm={handleLogout}
      />
    </AppShell>
  );
};
