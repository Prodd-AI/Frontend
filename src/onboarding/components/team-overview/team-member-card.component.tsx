import { FiTrash2 } from "react-icons/fi";

interface TeamMemberCardProps extends TeamMemberDetails {
  onRemove?: () => void;
}

const TeamMemberCard = ({
  first_name,
  last_name,
  email,
  onRemove,
}: TeamMemberCardProps) => {
  const initials = `${first_name.charAt(0)}${last_name.charAt(
    0
  )}`.toUpperCase();

  return (
    <div className="relative w-[140px] rounded-xl p-3 bg-[#F9FAFB] flex flex-col gap-2.5 cursor-pointer transition-all duration-200 hover:bg-[#F3F4F6] hover:shadow-md hover:-translate-y-0.5 group">
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-md hover:scale-110 z-10"
          title="Remove member"
        >
          <FiTrash2 size={12} />
        </button>
      )}
      <div className="relative w-full h-[65px] rounded-lg overflow-hidden bg-gradient-to-br from-[#6619DE] to-[#9B59B6]">
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-white font-bold text-lg">{initials}</span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <h5 className="text-sm font-semibold text-[#1F2937] truncate leading-tight">
          {first_name} {last_name}
        </h5>
        <p className="text-[#6B7280] text-xs truncate" title={email}>
          {email}
        </p>
      </div>
    </div>
  );
};

export default TeamMemberCard;
