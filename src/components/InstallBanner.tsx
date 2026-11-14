import React, { useState } from 'react';
import { Download, X } from 'lucide-react';
import { useT } from '../contexts/LanguageContext';
import { useInstallPrompt } from '../hooks/useInstallPrompt';

export const InstallBanner: React.FC = () => {
  const t = useT();
  const { isInstallable, isInstalled, install } = useInstallPrompt();
  const [dismissed, setDismissed] = useState(false);

  if (isInstalled || !isInstallable || dismissed) {
    return null;
  }

  return (
    <div className="bg-[#CCFBF1] border border-[#0F766E]/25 rounded-2xl p-3.5 flex items-center justify-between gap-3 mb-4">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-[#0F766E] text-white flex items-center justify-center shrink-0">
          <Download className="w-5 h-5" aria-hidden="true" />
        </div>
        <p className="text-sm font-medium text-[#0F172A]">
          {t.settings.installBannerText}
        </p>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={install}
          className="min-h-[40px] px-3.5 rounded-xl bg-[#0F766E] text-white text-xs font-bold hover:bg-[#115E59] transition-colors whitespace-nowrap"
        >
          {t.settings.installButton}
        </button>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label={t.settings.dismiss}
          className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl text-[#115E59] hover:bg-[#0F766E]/10"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};
