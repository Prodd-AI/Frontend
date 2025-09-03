import { MdPeopleAlt } from "react-icons/md";

interface SelectRoleCardProps {
	icon: React.ReactNode;
	title: string;
	description: string;
	active?: boolean;
}


const SelectRoleCard = ({
	icon = <MdPeopleAlt />,
	title = 'Role Title',
	description = 'this is descrip[tion of hte specified role, either HR, Team Lead or Team Member',
	active,
}: SelectRoleCardProps) => {
	return (
		<section
			className={`max-w-52 w-full px-5 py-9 rounded-2xl ${
				active ? 'bg-card-bg-active text-white' : 'bg-grey-lighter text-text-grey-600'
			} flex flex-col items-center gap-2.5 cursor-pointer hover:scale-[1.02] transition-transform duration-200`}>
			<div className={`rounded-full size-11  bg-grey-light text-primary flex justify-center items-center text-2xl`}>{icon}</div>
			<div className='flex flex-col gap-0.5'>
				<h2 className={`${active ? 'text-white' : 'text-primary'} font-bold text-lg text-center`}>{title}</h2>
				<p className='text-xs text-center'>{description}</p>
			</div>
			<input type="radio" name="role" className="accent-purple-600 checked:accent-white size-4.5" checked={active} readOnly />
		</section>
	);
};

export default SelectRoleCard;
