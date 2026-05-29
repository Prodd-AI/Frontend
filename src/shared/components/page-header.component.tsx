import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  dataTour?: string;
}

export default function PageHeader({
  title,
  subtitle,
  actions,
  dataTour,
}: PageHeaderProps) {
  return (
    <div
      data-tour={dataTour}
      className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
    >
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#251F2D] leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
        )}
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-3">{actions}</div>
      )}
    </div>
  );
}
