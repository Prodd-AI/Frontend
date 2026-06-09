import { Mail } from "lucide-react";

function SupportContactCard() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="size-9 rounded-full bg-[#F3EBFF] flex items-center justify-center text-[#6619DE] shrink-0">
          <Mail size={16} aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#251F2D]">
            Contact Support
          </p>
          <a
            href="mailto:contact@prodly.tech"
            className="mt-1 block text-sm text-[#6B7280] hover:text-[#6619DE] hover:underline break-all"
          >
            contact@prodly.tech
          </a>
        </div>
      </div>
    </div>
  );
}

export default SupportContactCard;
