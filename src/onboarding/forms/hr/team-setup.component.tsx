import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useState } from "react";

interface Team {
  name: string;
  size: string;
}

function TeamSetup() {
  const [teams, setTeams] = useState<Team[]>([{ name: "", size: "" }]);

  const addTeam = () => {
    setTeams([...teams, { name: "", size: "" }]);
  };

  const updateTeam = (index: number, field: keyof Team, value: string) => {
    const newTeams = [...teams];
    newTeams[index][field] = value;
    setTeams(newTeams);
  };

  return (
    <div className="flex flex-col gap-6 mt-4">
      {teams.map((team, index) => (
        <div
          key={index}
          className="flex flex-col md:flex-row gap-4 md:items-end"
        >
          {/* Team Name */}
          <div className="flex-1 space-y-2">
            <Label className="font-semibold">Team Name</Label>
            <Input
              placeholder="e.g design, marketing, engineering"
              value={team.name}
              onChange={(e) => updateTeam(index, "name", e.target.value)}
            />
          </div>

          {/* Team Size */}
          <div className="w-full md:w-1/3 space-y-2">
            <Label className="font-semibold">Team Size</Label>
            <Input
              placeholder="5"
              value={team.size}
              onChange={(e) => updateTeam(index, "size", e.target.value)}
              type="number"
            />
          </div>
        </div>
      ))}

      {/* Add Button */}
      <button
        onClick={addTeam}
        className="w-full py-4 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center gap-2 text-gray-500 font-medium hover:border-gray-400 hover:text-gray-700 transition-colors"
      >
        <Plus size={20} />
        Add Another Team
      </button>
    </div>
  );
}

export default TeamSetup;
