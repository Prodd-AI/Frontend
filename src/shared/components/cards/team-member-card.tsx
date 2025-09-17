import React from "react";

interface TeamMemberCardProps {
	image: string;
	name: string;
	email: string;
}
const TeamMemberCard = ({
	image = "/assets/placeholders/profile-picture.svg",
	name = "Name",
	email = "user@email.com",
}: TeamMemberCardProps) => {
	return (
		<div className="flex flex-col gap-1.5 px-1.5 py-2 pb-2.5 bg-grey-primary rounded-sm w-full md:max-w-28 ">
			<img
				src={image}
				alt="member picture"
				className="w-full h-14 object-cover object-center rounded-xss"
			/>
			<section>
				<p className="text-xs font-bold text-grey-800">{name}</p>
				<p className="text-xxxs text-grey-600">{email}</p>
			</section>
		</div>
	);
};

export default TeamMemberCard;
