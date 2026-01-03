import { WelcomeBackHeaderPropsInt } from "@/shared/typings/welcome-back-header";
import { clsx } from "clsx";

function WelcomeBackHeader({
  heading = "Glad to have you back! 🤗",
  subHeading = "Here’s your team’s pulse and tasks at a glance — lead with clarity, collaborate with ease",
  badge = false,
  child,
  className,
}: WelcomeBackHeaderPropsInt) {
  return (
    <div
      className={clsx(
        className,
        "min-h-[5rem] flex justify-between items-center"
      )}
    >
      <div className="flex flex-col gap-2 sm:gap-[11px]">
        {" "}
        <div className="flex flex-col-reverse sm:flex-row  items-start sm:items-center gap-2.5 sm:gap-16">
          {" "}
          <h2 className="text-[1.375rem] sm:text-[2.25rem] font-semibold text-[#393343]">
            {heading}
          </h2>
          <div className="flex justify-between items-center w-full sm:w-fit">
            {badge && (
              <span className="px-2 py-[13px] rounded-[5px] flex justify-center items-center text-white bg-linear-to-r from-[#18649A] to-[#1186DA] min-w-[7.25rem] h-[1.625rem]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="21"
                  height="21"
                  viewBox="0 0 21 21"
                  fill="none"
                >
                  <g clip-path="url(#clip0_661_5741)">
                    <path
                      d="M10.4336 14.8325L13.2446 20.861L15.5287 18.7682L18.6003 18.3637L15.8653 12.4984C13.6503 12.4795 11.8455 13.2005 10.5447 14.8325"
                      fill="url(#paint0_linear_661_5741)"
                    />
                    <path
                      d="M10.5436 14.8326L7.73257 20.8611L5.44847 18.7683L2.37695 18.3638L5.11193 12.4985C7.84183 12.2922 9.69028 13.0298 10.5436 14.8326Z"
                      fill="url(#paint1_linear_661_5741)"
                    />
                    <path
                      d="M10.489 14.8325C14.5531 14.8325 17.8475 11.5378 17.8475 7.47397C17.8475 3.41011 14.5531 0.115234 10.489 0.115234C8.06472 5.13616 7.87156 10.051 10.489 14.8325Z"
                      fill="#FFCC5B"
                    />
                    <path
                      d="M10.4874 14.8325C6.42332 14.8325 3.12891 11.5378 3.12891 7.47397C3.12891 3.41011 6.42332 0.115234 10.4874 0.115234V14.8249"
                      fill="#FDBC4B"
                    />
                    <path
                      d="M9.05499 12.6572C9.03379 12.6572 9.01212 12.6542 8.99068 12.6482C6.13769 11.8216 4.4884 8.82823 5.31477 5.975C5.35004 5.8526 5.47774 5.7823 5.60037 5.8178C5.72254 5.85307 5.79308 5.981 5.75758 6.1034C5.0022 8.71228 6.50996 11.4496 9.11907 12.2052C9.24124 12.2407 9.31178 12.3686 9.27628 12.4908C9.24701 12.5917 9.1548 12.6572 9.05499 12.6572Z"
                      fill="#EC9922"
                    />
                    <path
                      d="M15.4407 9.13877C15.4195 9.13877 15.3978 9.13577 15.3766 9.12955C15.2545 9.09405 15.1839 8.96635 15.2192 8.84395C15.5855 7.58008 15.4373 6.24936 14.8024 5.09682C14.1674 3.94428 13.1218 3.10799 11.8579 2.74195C11.7358 2.70668 11.6652 2.57875 11.7005 2.45635C11.736 2.33418 11.8637 2.26388 11.9861 2.29914C13.3682 2.6993 14.5118 3.61396 15.2061 4.87438C15.9006 6.13479 16.0624 7.58999 15.6622 8.97211C15.633 9.07331 15.541 9.13877 15.4407 9.13877Z"
                      fill="#EC9922"
                    />
                    <path
                      d="M8.65624 11.1095C8.60438 11.1095 8.55275 11.0922 8.51033 11.0572C8.42412 10.9866 8.40061 10.8645 8.45478 10.767L10.0045 7.97297L8.82267 7.29758C8.75744 7.26024 8.71433 7.19362 8.70742 7.1187C8.7005 7.04379 8.73047 6.97026 8.78763 6.92185L12.0555 4.14654C12.1383 4.07646 12.2579 4.07347 12.3444 4.1387C12.4306 4.20439 12.4594 4.32103 12.414 4.41923L11.2531 6.92254L12.4278 7.56013C12.4944 7.59632 12.5389 7.66316 12.547 7.73877C12.5548 7.81438 12.5251 7.88883 12.4672 7.93816L8.80561 11.0546C8.76274 11.091 8.70949 11.1095 8.65624 11.1095Z"
                      fill="#EC9922"
                    />
                  </g>
                  <defs>
                    <linearGradient
                      id="paint0_linear_661_5741"
                      x1="10.4336"
                      y1="16.6795"
                      x2="18.6003"
                      y2="16.6795"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#AC2323" />
                      <stop offset="1" stop-color="#EF6529" />
                    </linearGradient>
                    <linearGradient
                      id="paint1_linear_661_5741"
                      x1="2.37695"
                      y1="16.663"
                      x2="10.5436"
                      y2="16.663"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#AC2323" />
                      <stop offset="1" stop-color="#EF6529" />
                    </linearGradient>
                    <clipPath id="clip0_661_5741">
                      <rect width="21" height="21" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <small>Team Lead</small>
              </span>
            )}
            {child && (
              <div className=" sm:hidden border size-4 bg-black">{child}</div>
            )}
          </div>
        </div>
        <p className=" text-[#4B4357] text-[1rem]">{subHeading}</p>
      </div>
      {child && <div className="hidden sm:block">{child}</div>}
    </div>
  );
}

export default WelcomeBackHeader;
