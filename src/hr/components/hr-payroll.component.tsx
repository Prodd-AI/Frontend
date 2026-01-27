import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
import { Clock, DollarSign, Wallet } from "lucide-react";
import { useState } from "react";

export default function HrPayroll() {
  const [hourlyRate, setHourlyRate] = useState<number>(50);

  // Mock Data dependent on hourly rate
  const weeklyHours = 14;
  const regularHours = 14;
  const overtimeHours = 0;
  const monthlyEstHours = 56;

  // 0h for "Daily Hours" in design image shows $0.00. Using 0 inline.
  const weeklyPay = weeklyHours * hourlyRate;
  const monthlyPay = monthlyEstHours * hourlyRate;
  const overtimePay = overtimeHours * (hourlyRate * 1.5);
  const regularPay = regularHours * hourlyRate;
  const totalWeeklyPay = regularPay + overtimePay;

  const projectCosts = [
    { name: "Product Development", hours: 9, cost: 9 * hourlyRate },
    { name: "Team Meetings", hours: 2, cost: 2 * hourlyRate },
    { name: "Code Review", hours: 3, cost: 3 * hourlyRate },
  ];

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

      {/* Project Cost Breakdown */}
      <div className="bg-white p-6 rounded-2xl shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-bold text-[#251F2D]">
            Project Cost Breakdown
          </h2>
          <p className="text-gray-500 text-xs">Hours and costs per project</p>
        </div>

        <div className="space-y-4">
          {projectCosts.map((project, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between group hover:bg-gray-50 p-2 rounded-lg transition-colors"
            >
              <span className="font-bold text-[#251F2D] text-sm">
                {project.name}
              </span>
              <div className="flex items-center gap-8">
                <span className="text-xs font-medium text-gray-500 border border-gray-200 rounded-full px-2 py-0.5 min-w-[32px] text-center">
                  {project.hours}h
                </span>
                <span className="font-bold text-gray-600 text-sm w-[70px] text-right">
                  {formatCurrency(project.cost)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
