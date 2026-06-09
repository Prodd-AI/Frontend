import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
import { Clock, DollarSign, Wallet, Loader2 } from "lucide-react";
import { useState, useMemo } from "react";
import { useHrPayroll } from "../hooks/use-hr-payroll";
import { useTeamsWithMembers } from "../hooks/use-teams-with-members";
import { TeamEntryCard } from "@/shared/components/team-entry-card.component";
import type { TeamEntry } from "@/shared/components/team-entry-card.component";

export default function HrPayroll() {
  const [hourlyRateInput, setHourlyRateInput] = useState<number>(50);
  const {
    payroll_data,
    periodLabel,
    isWeek,
    is_loading,
  } = useHrPayroll(); // GET /api/v1/hr-analytics/payroll/team-summary
  const { teamsWithMembers, is_loading: teamsLoading } = useTeamsWithMembers();

  const avgRate = payroll_data?.avg_hourly_rate ?? 0;
  const hourlyRate = avgRate > 0 ? avgRate : hourlyRateInput;

  const totalHours = payroll_data?.total_hours ?? 0;
  const totalPayout = payroll_data?.total_payout ?? 0;
  const regularHours = payroll_data?.regular?.hours ?? 0;
  const regularCost = payroll_data?.regular?.cost ?? 0;
  const overtimeHours = payroll_data?.overtime?.hours ?? 0;
  const overtimeCost = payroll_data?.overtime?.cost ?? 0;

  const teamsWithPayout: TeamEntry[] = useMemo(
    () =>
      teamsWithMembers.map((team) => ({
        ...team,
        total_payout: (team.total_hours ?? 0) * hourlyRate,
        people: team.people.map((p) => ({
          ...p,
          payout: (p.hours ?? 0) * hourlyRate,
        })),
      })),
    [teamsWithMembers, hourlyRate],
  );

  if (is_loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Loader2 className="animate-spin text-primary-color" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Configuration Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div className="flex items-center gap-3 mb-2">
          <DollarSign className="text-[#6619DE]" size={24} />
          <h2 className="text-xl font-bold text-[#251F2D]">
            Admin Rate Configuration
          </h2>
        </div>
        <p className="text-gray-500 text-sm mb-6">
          Set the hourly rate for payment calculations
        </p>

        <div className="flex items-center gap-4">
          <span className="text-xl font-bold text-[#251F2D]">$</span>
          <Input
            type="number"
            value={hourlyRateInput}
            onChange={(e) => setHourlyRateInput(Number(e.target.value))}
            className="max-w-[120px] h-[48px] text-lg"
          />
          <span className="text-gray-500">/ hour</span>
        </div>
        {(payroll_data?.avg_hourly_rate ?? 0) > 0 && (
          <p className="text-xs text-gray-500 mt-2">
            API avg rate used when available; override above to recalculate.
          </p>
        )}
      </div>

      {/* Payment Summary Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-8">
        <div className="flex items-center gap-3 mb-6">
          <Wallet className="text-[#251F2D]" size={20} />
          <div>
            <h2 className="text-lg font-bold text-[#251F2D]">
              Payment Summary
            </h2>
            <p className="text-gray-500 text-xs">
              {periodLabel} · Calculated from payroll/team-summary
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col items-center justify-center p-4">
          <span className="text-xs text-gray-400 mb-1">Total Employees</span>
            <span className="text-xl font-bold text-[#251F2D]">
              {payroll_data?.total_employees ?? 0}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center p-4">
            <span className="text-xs text-gray-400 mb-1">
              Total Hours ({isWeek ? "Week" : "Month"})
            </span>
            <span className="text-xl font-bold text-[#251F2D]">
              {totalHours}h
            </span>
            <span className="text-sm text-gray-500 font-semibold">
              {formatCurrency(totalPayout)}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center p-4">
            <span className="text-xs text-gray-400 mb-1">Period</span>
            <span className="text-xl font-bold text-[#251F2D]">
              {periodLabel}
            </span>
            <span className="text-sm text-gray-500 font-semibold">
              {payroll_data?.currency ?? "USD"}
            </span>
          </div>
          <div className="bg-[#F9FAFB] border border-[#F3F4F6] rounded-xl flex flex-col items-center justify-center p-4">
            <span className="text-xs text-gray-400 mb-1">Hourly Rate</span>
            <span className="text-xl font-bold text-[#251F2D]">
              ${hourlyRate.toFixed(2)}
            </span>
            <span className="text-sm text-gray-500 font-semibold">
              per hour
            </span>
          </div>
        </div>

        {/* Overtime Analysis */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Clock size={16} className="text-gray-500" />
            <h3 className="text-sm font-bold text-[#251F2D]">
              Overtime Analysis (40h/week standard)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-xs text-gray-400 mb-1">Regular Hours</p>
              <p className="text-xl font-bold text-[#251F2D]">
                {regularHours}h
              </p>
              <p className="text-sm text-gray-500 font-semibold">
                {formatCurrency(regularCost)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">
                Overtime Hours (1.5x)
              </p>
              <p className="text-xl font-bold text-[#251F2D]">
                {overtimeHours}h
              </p>
              <p className="text-sm text-gray-500 font-semibold">
                {formatCurrency(overtimeCost)}
              </p>
            </div>
          </div>
        </div>

        <div className="h-px bg-gray-100 w-full" />

        <div className="flex items-center justify-between">
          <span className="text-base font-bold text-[#251F2D]">
            Total {isWeek ? "Weekly" : "Monthly"} Pay
          </span>
          <span className="text-xl font-bold text-[#251F2D]">
            {formatCurrency(totalPayout)}
          </span>
        </div>
      </div>

      {/* Team Payout */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-[#251F2D]">Team Payout</h2>
          <p className="text-gray-500 text-xs">
            {periodLabel} · Payout by team and member (hours × hourly rate from
            team entries)
          </p>
        </div>
        {teamsLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-primary-color" size={32} />
          </div>
        ) : teamsWithPayout.length === 0 ? (
          <p className="text-sm text-gray-500 py-4">No teams found.</p>
        ) : (
          <div className="space-y-3">
            {teamsWithPayout.map((team) => (
              <TeamEntryCard key={team.id} team={team} showPayout />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
