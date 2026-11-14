import React, { useEffect, useState } from 'react';
import { AlertCircle, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LanguageToggle } from '../components/LanguageToggle';
import { Toast } from '../components/Toast';
import { useAuth } from '../contexts/AuthContext';
import { useT } from '../contexts/LanguageContext';
import { useToast } from '../contexts/ToastContext';

const GoogleGIcon: React.FC = () => (
  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
    />
  </svg>
);

export const LoginPage: React.FC = () => {
  const { userId, isSupabaseReady, signInWithGoogle, enterPreviewMode } = useAuth();
  const t = useT();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (userId) {
      navigate('/attendance', { replace: true });
    }
  }, [userId, navigate]);

  const handleGoogleSignIn = async () => {
    setSubmitting(true);
    try {
      await signInWithGoogle();
    } catch {
      showToast(t.auth.loginError, 'error');
      setSubmitting(false);
    }
  };

  const handlePreview = () => {
    enterPreviewMode();
    navigate('/attendance', { replace: true });
  };

  return (
    <div className="min-h-dvh bg-[#F6F8F7] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <Toast />

      {/* Top corner language toggle (Urdu | Roman) */}
      <div className="absolute top-4 end-4 z-20 pt-safe">
        <LanguageToggle compact />
      </div>

      {/* Subtle Islamic geometric pattern header band */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-56 bg-[#0F766E] opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 25px 25px, #0F766E 2px, transparent 0), radial-gradient(circle at 75px 75px, #0F766E 2px, transparent 0)',
          backgroundSize: '100px 100px',
        }}
      />

      <main className="relative z-10 w-full max-w-md bg-white rounded-3xl border border-[#E2E8F0] p-7 md:p-9 shadow-sm text-center">
        <div className="mx-auto w-20 h-20 rounded-2xl overflow-hidden shadow-sm mb-5 border border-[#E2E8F0]">
          <img
            src="/icons/icon-192.png"
            alt={t.appName}
            className="w-full h-full object-cover"
          />
        </div>

        <h1 className="font-nastaliq text-3xl font-bold text-[#0F766E] mb-2">
          {t.appName}
        </h1>
        <p className="text-base text-[#64748B] mb-8">{t.tagline}</p>

        {isSupabaseReady ? (
          <button
            type="button"
            disabled={submitting}
            onClick={handleGoogleSignIn}
            className="w-full min-h-[52px] px-5 py-3 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm hover:bg-slate-50 active:scale-[0.99] transition-all flex items-center justify-center gap-3 text-base font-bold text-[#0F172A] disabled:opacity-60"
          >
            <GoogleGIcon />
            <span>{submitting ? t.auth.signingIn : t.auth.googleButton}</span>
          </button>
        ) : (
          <div className="space-y-4 text-start">
            <div className="rounded-2xl bg-[#F6F8F7] border border-[#E2E8F0] p-4 flex items-start gap-3">
              <AlertCircle
                className="w-5 h-5 text-[#B45309] shrink-0 mt-1"
                aria-hidden="true"
              />
              <div className="space-y-1.5 text-sm">
                <p className="font-bold text-[#0F172A]">{t.auth.setupTitle}</p>
                <p className="text-[#64748B] leading-relaxed">
                  {t.auth.setupPrefix}{' '}
                  <code
                    dir="ltr"
                    className="inline-block px-1.5 py-0.5 rounded bg-white border border-[#E2E8F0] text-xs font-mono text-[#0F172A]"
                  >
                    VITE_SUPABASE_URL
                  </code>{' '}
                  {t.auth.setupAnd}{' '}
                  <code
                    dir="ltr"
                    className="inline-block px-1.5 py-0.5 rounded bg-white border border-[#E2E8F0] text-xs font-mono text-[#0F172A]"
                  >
                    VITE_SUPABASE_ANON_KEY
                  </code>{' '}
                  {t.auth.setupSuffix}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handlePreview}
              className="w-full min-h-[50px] px-5 py-3 rounded-2xl bg-[#0F766E] text-white text-base font-bold hover:bg-[#115E59] transition-colors flex items-center justify-center gap-2"
            >
              <Eye className="w-5 h-5" aria-hidden="true" />
              <span>{t.auth.previewButton}</span>
            </button>
            <p className="text-xs text-center text-[#64748B]">
              {t.auth.previewHint}
            </p>
          </div>
        )}
      </main>
    </div>
  );
};
