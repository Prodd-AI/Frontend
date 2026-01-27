function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative size-[26px] sm:size-[32px] ">
        <img
          src="/assets/icons/logo.svg"
          alt="Prod AI logo"
          className=" w-full h-full absolute"
        />
      </div>

      <h2 className=" font-semibold text-[#251F2D] text-[18px] sm:text-[22px]">
        Prodilly
      </h2>
    </div>
  );
}

export default Logo;
