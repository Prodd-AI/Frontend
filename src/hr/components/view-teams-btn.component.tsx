import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

function ViewTeamsButton() {
  const navigate = useNavigate();
  return (
    <Button variant="outline" onClick={() => navigate("/dash/hr/teams")}>
      <Users /> Teams
    </Button>
  );
}

export default ViewTeamsButton;
