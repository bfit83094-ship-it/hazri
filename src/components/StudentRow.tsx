import React from 'react';
import { Link } from 'react-router-dom';

interface StudentRowProps {
  name: string;
  subtitle?: string;
  badgeText?: string;
  badgeClassName?: string;
  to?: string;
  trailing?: React.ReactNode;
  footer?: React.ReactNode;
  dimmed?: boolean;
}

export const StudentRow: React.FC<StudentRowProps> = ({
  name,
  subtitle,
  badgeText,
  badgeClassName = 'text-[#64748B]',
  to,
  trailing,
  footer,
  dimmed = false,
}) => {
  const identity = (
    <div className="min-w-0">
      <div className="flex items-center gap-2 min-w-0">
        <p className="text-base md:text-lg font-bold text-[#0F172A] group-hover:text-[#0F766E] transition-colors truncate">
          {name}
        </p>
        {badgeText && (
          <span className={`text-xs font-semibold shrink-0 ${badgeClassName}`}>
            · {badgeText}
          </span>
        )}
      </div>
      {subtitle && (
        <p className="text-xs text-[#64748B] truncate">{subtitle}</p>
      )}
    </div>
  );

  return (
    <div
      className={`bg-white rounded-2xl border border-[#E2E8F0] p-3.5 md:p-4 ${
        dimmed ? 'opacity-75' : ''
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {to ? (
          <Link to={to} className="min-w-0 flex-1 block group">
            {identity}
          </Link>
        ) : (
          <div className="min-w-0 flex-1">{identity}</div>
        )}
        {trailing && <div className="shrink-0">{trailing}</div>}
      </div>
      {footer}
    </div>
  );
};
