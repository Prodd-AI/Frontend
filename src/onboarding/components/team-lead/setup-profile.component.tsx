import { FaRegUser } from "react-icons/fa6";
import { MdOutlinePhotoCamera } from "react-icons/md";
function SetupProfile() {
    return (
        <div>
            <div className="flex justify-center items-center">
                <div className=" size-[64px]  flex justify-center items-center bg-[#F3F4F6] rounded-full relative">
                    <FaRegUser size={32} className=" text-[#6619DE]"
                    />
                    <div className=" absolute size-[18px] bg-linear-to-br from-[#6619DE] to-[#1186DA] bottom-0 rounded-full right-0 flex justify-center items-center">
                        <MdOutlinePhotoCamera className=" text-white" size={8} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SetupProfile