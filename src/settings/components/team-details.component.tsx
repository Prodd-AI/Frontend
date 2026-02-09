// import { useQuery } from "@tanstack/react-query";
// import {
//   QUERY_KEY_TEAM_DETAILS,
//   simulate_fetch_team_details,
// } from "@/settings/utils/team-details.functions";
// import { Button } from "@/components/ui/button";
// import { PiUsers } from "react-icons/pi";
// import { TeamMember } from "@/shared/typings/team-member";

// interface TeamDetailsProps {
//   user: TeamMember | null;
// }

// const Stat = ({ value, label }: { value: number; label: string }) => (
//   <div className="bg-white rounded-lg border border-[#E5E7EB] px-6 py-3 text-center">
//     <p className="text-xl font-bold text-[var(--primary-color)]">{value}</p>
//     <p className="text-xs text-gray-600">{label}</p>
//   </div>
// );

// const MemberRow = ({
//   name,
//   role,
//   highlight,
// }: {
//   name: string;
//   role: string;
//   highlight?: boolean;
// }) => (
//   <div
//     className={`flex items-center gap-3 rounded-xl border ${
//       highlight
//         ? "border-[var(--primary-color)] bg-[var(--primary-color)]/5"
//         : "border-[#E5E7EB]"
//     } p-4`}
//   >
//     <div className="size-9 rounded-full bg-[#F3F4F6] flex items-center justify-center">
//       <PiUsers className="text-[var(--primary-color)]" />
//     </div>
//     <div>
//       <p className="text-sm font-semibold">{name}</p>
//       <p className="text-xs text-gray-500">{role}</p>
//     </div>
//   </div>
// );

// const TeamDetailsComponent = ({ user }: TeamDetailsProps) => {
//   const { data } = useQuery({
//     queryKey: QUERY_KEY_TEAM_DETAILS,
//     queryFn: simulate_fetch_team_details,
//     staleTime: 60_000,
//   });

//   const team = data?.team;
//   const members = data?.members ?? [];

//   return (
//     <div className="flex flex-col gap-6">
//       <div className="rounded-xl border border-[#E5E7EB] p-6">
//         <p className="text-sm font-semibold mb-6">Team Information</p>
//         <div className="flex flex-col items-center gap-3">
//           <div className="size-16 rounded-full bg-[#F3F4F6] flex items-center justify-center">
//             <PiUsers className="text-[var(--primary-color)]" size={28} />
//           </div>
//           <p className="text-base font-semibold">{team?.name}</p>
//           <p className="text-xs text-gray-500">
//             Led by {team?.lead_name} • {team?.department}
//           </p>
//           <div className="grid grid-cols-2 gap-4 mt-2">
//             <Stat value={team?.members_count ?? 0} label="Team Members" />
//             <Stat value={team?.active_projects ?? 0} label="Active Projects" />
//           </div>
//         </div>
//       </div>

//       <div className="rounded-xl border border-[#E5E7EB] p-6">
//         <p className="text-sm font-semibold">Team Members</p>
//         <p className="text-xs text-gray-500 mb-4">
//           Your teammates and their roles
//         </p>
//         <div className="flex flex-col gap-3">
//           {members.map((m) => (
//             <MemberRow
//               key={m.id}
//               name={m.name}
//               role={m.role}
//               highlight={m.is_lead}
//             />
//           ))}
//         </div>

//         <Button className="w-full mt-6 h-11 bg-gradient-to-r from-[#6D28D9] to-[#2563EB]">
//           Request Role Change
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default TeamDetailsComponent;
