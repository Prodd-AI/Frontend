import logo from "../../../public/assets/icons/logo.svg";
function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className=" relative lg:size-[51.20000076293945px] size-[1.601rem]">
        <img
          src={logo}
          alt="Prod AI logo"
          className=" w-full h-full absolute"
        />
      </div>

      <h2 className=" font-semibold text-[#251F2D] lg:text-[2.2rem] text-[1.136rem]">Prod AI</h2>
    </div>
  );
}

export default Logo;
