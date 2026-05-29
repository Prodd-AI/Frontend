import { HiOutlineSparkles } from "react-icons/hi2";
import { Button } from "@/components/ui/button";

interface TakeTourButtonProps {
  onStart: () => void;
  label?: string;
}

export default function TakeTourButton({
  onStart,
  label = "Take a tour",
}: TakeTourButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onStart}
      className="h-11 px-4 rounded-xl gap-2 text-[#6619DE] hover:text-[#5710c4] bg-[#F3EBFF] hover:bg-[#E8DBFF] font-semibold"
    >
      <HiOutlineSparkles className="h-4 w-4" />
      {label}
    </Button>
  );
}
