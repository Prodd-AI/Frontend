import { IconType } from "react-icons/lib";

interface SelectRoleCardProps {
  onChangeFn: () => void;
  index: string | number;
  value?: string;
  title?: string; 
  description?: string;
  active?: boolean;
  Icon?: IconType;
}
