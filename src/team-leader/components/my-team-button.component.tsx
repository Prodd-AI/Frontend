import { Button } from "@/components/ui/button";
import { RxPerson } from "react-icons/rx";
import { useNavigate } from "react-router-dom";

const MyTeamButton = () => {
  const navigate = useNavigate();
  const handleTeamView = () => {
    navigate("view-team");
  };
  return (
    <Button variant="outline" onClick={handleTeamView}>
      <RxPerson />
      My Team
    </Button>
  );
};

export default MyTeamButton;
