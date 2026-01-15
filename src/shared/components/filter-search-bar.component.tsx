import { Filter, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export function FilterBar() {
  return (
    <div className="flex flex-wrap items-center gap-4 mb-6">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Filter className="w-4 h-4" />
        <span className="text-sm font-medium">Filters:</span>
      </div>

      <Select defaultValue="member">
        <SelectTrigger className="w-[160px] border-transparent  bg-[#ECEEF3] shadow-card">
          <SelectValue placeholder="Member" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="member">Member</SelectItem>
          <SelectItem value="manager">Manager</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
        </SelectContent>
      </Select>

      <Select defaultValue="30days">
        <SelectTrigger className="w-[160px] border-transparent  bg-[#ECEEF3] shadow-card">
          <SelectValue placeholder="Select period" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="7days">Last 7 days</SelectItem>
          <SelectItem value="30days">Last 30 days</SelectItem>
          <SelectItem value="90days">Last 90 days</SelectItem>
          <SelectItem value="year">Last year</SelectItem>
        </SelectContent>
      </Select>

      <div className="relative rounded-md flex-1 min-w-[200px] max-w-[300px] bg-[#ECEEF3]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search team member..."
          className="pl-10 bg-[#ECEEF3] border-transparent placeholder:text-muted-foreground/60"
        />
      </div>
    </div>
  );
}
