import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
import { Clock, DollarSign, Wallet, Loader2 } from "lucide-react";
import { useState, useMemo } from "react";
import { useHrPayroll } from "../hooks/use-hr-payroll";
import {
  TeamEntryCard,
  type TeamEntry,
} from "@/shared/components/team-entry-card.component";

export default function HrPayroll() {
  const [hourlyRate, setHourlyRate] = useState<number>(50);
  const { payroll_data, is_loading } = useHrPayroll();

  if (is_loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Loader2 className="animate-spin text-primary-color" />
      </div>
    );
  }

  // Use live data if available, otherwise fallback to calculated mocks OR zeros
  const weeklyHours = payroll_data?.weekly_hours ?? 0;
  const regularHours = payroll_data?.regular_hours ?? 0;
  const overtimeHours = payroll_data?.overtime_hours ?? 0;
  const monthlyEstHours = weeklyHours * 4; // Estimation

  const weeklyPay = payroll_data?.weekly_pay ?? weeklyHours * hourlyRate;
  const monthlyPay = payroll_data?.monthly_pay ?? monthlyEstHours * hourlyRate;
  const overtimePay =
    payroll_data?.overtime_pay ?? overtimeHours * (hourlyRate * 1.5);
  const regularPay = payroll_data?.regular_pay ?? regularHours * hourlyRate;
  const totalWeeklyPay = regularPay + overtimePay;

  // Team payout data: same accordion structure as timesheet, with payout derived from hours × rate
  const teamsPayoutData: TeamEntry[] = useMemo(
    () =>
      [
        {
          id: "marketing",
          team: "Marketing",
          icon_color: "bg-[#934DFF]",
          members_count: 2,
          total_hours: 60.5,
          people: [
            {
              id: "sarah",
              name: "Sarah Chen",
              role: "Marketing Lead",
              hours: 32.5,
              payout: 32.5 * hourlyRate,
            },
            {
              id: "james",
              name: "James Wilson",
              role: "Content Writer",
              hours: 28.5,
              payout: 28.5 * hourlyRate,
            },
          ],
        },
        {
          id: "engineering",
          team: "Engineering",
          icon_color: "bg-[#0EB5C9]",
          members_count: 3,
          total_hours: 60.5,
          people: [
            {
              id: "alex",
              name: "Alex Rivera",
              role: "Senior Dev",
              hours: 22,
              payout: 22 * hourlyRate,
            },
            {
              id: "sam",
              name: "Sam Kim",
              role: "Developer",
              hours: 20.5,
              payout: 20.5 * hourlyRate,
            },
            {
              id: "jordan",
              name: "Jordan Lee",
              role: "Developer",
              hours: 18,
              payout: 18 * hourlyRate,
            },
          ],
        },
        {
          id: "design",
          team: "Design",
          icon_color: "bg-[#DF38D3]",
          members_count: 2,
          total_hours: 60.5,
          people: [
            {
              id: "morgan",
              name: "Morgan Taylor",
              role: "Design Lead",
              hours: 32,
              payout: 32 * hourlyRate,
            },
            {
              id: "casey",
              name: "Casey Brown",
              role: "UI Designer",
              hours: 28.5,
              payout: 28.5 * hourlyRate,
            },
          ],
        },
      ].map((t) => ({
        ...t,
        total_payout: t.people.reduce((sum, p) => sum + (p.payout ?? 0), 0),
      })),
    [hourlyRate],
  );

  return (
    <div className="space-y-8">
      {/* Configuration Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <DollarSign className="text-[#6619DE]" size={24} />
          <h2 className="text-xl font-bold text-[#251F2D]">
            Hourly Rate Configuration
          </h2>
        </div>
        <p className="text-gray-500 text-sm mb-6">
          Set the hourly rate for payment calculations
        </p>

        <div className="flex items-center gap-4">
          <span className="text-xl font-bold text-[#251F2D]">$</span>
          <Input
            type="number"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(Number(e.target.value))}
            className="max-w-[120px] h-[48px] text-lg"
          />
          <span className="text-gray-500">/ hour</span>
        </div>
      </div>

      {/* Payment Summary Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm space-y-8">
        <div className="flex items-center gap-3 mb-6">
          <Wallet className="text-[#251F2D]" size={20} />
          <div>
            <h2 className="text-lg font-bold text-[#251F2D]">
              Payment Summary
            </h2>
            <p className="text-gray-500 text-xs">
              Calculated earnings based on logged hours
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col items-center justify-center p-4">
            <span className="text-xs text-gray-400 mb-1">Daily Hours</span>
            <span className="text-xl font-bold text-[#251F2D]">0h</span>
            <span className="text-sm text-gray-500 font-semibold">$0.00</span>
          </div>
          <div className="flex flex-col items-center justify-center p-4">
            <span className="text-xs text-gray-400 mb-1">Weekly Hours</span>
            <span className="text-xl font-bold text-[#251F2D]">
              {weeklyHours}h
            </span>
            <span className="text-sm text-gray-500 font-semibold">
              {formatCurrency(weeklyPay)}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center p-4">
            <span className="text-xs text-gray-400 mb-1">Monthly Est.</span>
            <span className="text-xl font-bold text-[#251F2D]">
              {monthlyEstHours}h
            </span>
            <span className="text-sm text-gray-500 font-semibold">
              {formatCurrency(monthlyPay)}
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
                {formatCurrency(regularPay)}
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
                {formatCurrency(overtimePay)}
              </p>
            </div>
          </div>
        </div>

        <div className="h-px bg-gray-100 w-full" />

        <div className="flex items-center justify-between">
          <span className="text-base font-bold text-[#251F2D]">
            Total Weekly Pay
          </span>
          <span className="text-xl font-bold text-[#251F2D]">
            {formatCurrency(totalWeeklyPay)}
          </span>
        </div>
      </div>

      {/* Team Payout */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-[#251F2D]">Team Payout</h2>
          <p className="text-gray-500 text-xs">
            Payout by team and member (based on hourly rate and logged hours)
          </p>
        </div>
        <div className="space-y-3">
          {teamsPayoutData.map((team) => (
            <TeamEntryCard key={team.id} team={team} showPayout />
          ))}
        </div>
      </div>
    </div>
  );
}
