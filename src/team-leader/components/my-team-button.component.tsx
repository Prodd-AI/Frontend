import { Button } from "@/components/ui/button";
import { RxPerson } from "react-icons/rx";

const MyTeamButton = () => {
  return (
    <Button variant="outline">
      <RxPerson />
      My Team
    </Button>
  );
};

export default MyTeamButton;
