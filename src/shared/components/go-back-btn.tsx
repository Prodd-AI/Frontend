import { Button } from "@/components/ui/button";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

function GoBackBtn({ title, path }: { title: string; path?: string }) {
  const navigate = useNavigate();
  const goBack = () => (path ? navigate(path) : navigate(-1));
  return (
    <Button className="mt-[30px]" variant="link" onClick={goBack}>
      <IoIosArrowRoundBack size={24} />
      {title}
    </Button>
  );
}

export default GoBackBtn;
