import React from 'react';
import { Link } from 'react-router-dom';
import { useT } from '../contexts/LanguageContext';

export const NotFoundPage: React.FC = () => {
  const t = useT();

  return (
    <div className="min-h-dvh bg-[#F6F8F7] flex items-center justify-center p-4">
      <div className="max-w-sm w-full bg-white rounded-3xl border border-[#E2E8F0] p-8 text-center space-y-4">
        <p className="text-4xl font-bold text-[#0F766E] tabular-nums">404</p>
        <h1 className="text-xl font-bold text-[#0F172A]">
          {t.common.notFoundTitle}
        </h1>
        <p className="text-sm text-[#64748B]">{t.common.notFoundBody}</p>
        <Link
          to="/attendance"
          className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 rounded-xl bg-[#0F766E] text-white text-sm font-bold hover:bg-[#115E59] transition-colors"
        >
          {t.common.goHome}
        </Link>
      </div>
    </div>
  );
};
