import { ChevronDown, ChevronRight, User } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";

export interface TeamEntryPerson {
  id: string;
  name: string;
  role: string;
  entries?: number;
  hours?: number;
  payout?: number;
}

export interface TeamEntry {
  id: string;
  team: string;
  icon_color: string;
  members_count: number;
  total_entries?: number;
  total_hours?: number;
  total_payout?: number;
  people: TeamEntryPerson[];
}

interface TeamEntryCardProps {
  team: TeamEntry;
  /** When true, shows payout for team and members; otherwise shows hours/entries */
  showPayout?: boolean;
}

export function TeamEntryCard({ team, showPayout = false }: TeamEntryCardProps) {
  const [expanded, setExpanded] = useState(false);

  const teamAmount = showPayout ? team.total_payout : team.total_hours;
  const teamLabel = showPayout
    ? (team.total_payout != null ? formatCurrency(team.total_payout) : "$0.00")
    : `${team.total_hours ?? 0}h`;

  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden transition-all duration-300">
      <div
        className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-gray-50"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-4">
          <ChevronDown
            className={cn(
              "text-gray-400 transition-transform duration-300",
              expanded ? "rotate-180" : "",
            )}
            size={20}
          />
          <div className="flex items-center gap-3">
            <div className={cn("w-3 h-3 rounded-full", team.icon_color)}></div>
            <div className="p-1.5 bg-[#F3F4F6] rounded-lg">
              <div className="size-5 flex items-center justify-center">
                <User size={16} className="text-gray-600" />
                <User size={16} className="text-gray-600 -ml-2" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-[#251F2D]">{team.team}</span>
              <span className="text-xs text-gray-400 font-normal">
                ({team.members_count} Members)
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between md:justify-end gap-8 ml-10 md:ml-0">
          {!showPayout && team.total_entries != null && (
            <div className="text-xs font-medium text-gray-500">
              {team.total_entries} entries
            </div>
          )}
          <div className="bg-[#EAEBEB] px-3 py-1 rounded-full text-xs font-bold text-[#6B7280]">
            {showPayout && teamAmount != null
              ? formatCurrency(teamAmount)
              : teamLabel}
          </div>
        </div>
      </div>

      {/* Expanded People List */}
      <div
        className={cn(
          "bg-[#FBFBFC] transition-all duration-300 ease-in-out overflow-hidden border-t border-gray-100",
          expanded ? "max-h-[500px] py-2" : "max-h-0",
        )}
      >
        {team.people.map((person) => {
          const personAmount = showPayout ? person.payout : person.hours;
          const personLabel = showPayout
            ? (person.payout != null ? formatCurrency(person.payout) : "$0.00")
            : `${person.hours ?? 0}h`;
          return (
            <div
              key={person.id}
              className="flex flex-col md:flex-row md:items-center justify-between px-4 py-3 pl-[3.5rem] hover:bg-white transition-colors gap-2"
            >
              <div className="flex items-center gap-3">
                <ChevronRight size={16} className="text-gray-300" />
                <div className="size-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <User size={14} className="text-gray-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#251F2D]">
                    {person.name}
                  </p>
                  <p className="text-[10px] text-gray-500">{person.role}</p>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-8 ml-8 md:ml-0">
                {!showPayout && person.entries != null && (
                  <div className="text-xs text-gray-500">
                    {person.entries} entries
                  </div>
                )}
                <div className="bg-[#EAEBEB] px-3 py-1 rounded-full text-xs font-bold text-[#6B7280]">
                  {showPayout && personAmount != null
                    ? formatCurrency(personAmount)
                    : personLabel}
                </div>
              </div>
            </div>
          );
        })}
        {team.people.length === 0 && (
          <div className="px-14 py-4 text-xs text-gray-400 italic">
            No detailed entries available.
          </div>
        )}
      </div>
    </div>
  );
}
