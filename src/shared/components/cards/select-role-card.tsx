import { MdPeopleAlt } from "react-icons/md";
import { SelectRoleCardProps } from "../../typings/select-role-card";

const SelectRoleCard = ({
  Icon = MdPeopleAlt,
  title = "Role Title",
  description = "this is description of the specified role, either HR, Team Lead or Team Member",
  active,
  onChangeFn,
  value,
  index,
}: SelectRoleCardProps) => {
  return (
    <div
      key={index}
      onClick={onChangeFn}
      className={`md:min-w-[12.188rem] min-w-full px-5 py-9 rounded-2xl ${
        active
          ? "bg-card-bg-active text-white"
          : "bg-grey-lighter text-grey-600"
      } flex sm:flex-col lg:flex-col md:flex-col items-center gap-2.5 cursor-pointer hover:scale-[1.02] transition-transform duration-200`}
    >
      <div>
        {" "}
        <div
          className={`rounded-full size-11 bg-grey-light text-primary flex justify-center items-center text-2xl border bg-b`}
        >
          <Icon />
        </div>
      </div>

      <div className="flex flex-col gap-0.5">
        <h2
          className={`${
            active ? "text-white" : "text-primary"
          } font-bold text-lg  sm:text-center lg:text-center md:text-center`}
        >
          {title}
        </h2>
        <p className="text-[0.597rem] sm:text-xs lg:text-xs md:text-xs font-semibold sm:text-center lg:text-center md:text-center">
          {description}
        </p>
      </div>
      <input
        type="radio"
        name="role"
        className="accent-purple-600 checked:accent-white size-4.5 pointer-events-none"
        checked={active}
        value={value}
        readOnly
      />
    </div>
  );
};

export default SelectRoleCard;
