import { cn } from "@/lib/utils";

interface LoaderProps {
  size?: number;
  className?: string;
}

function Loader({ size = 48, className }: LoaderProps) {
  // The path length of the spiral SVG (approximate)
  const pathLength = 350;

  return (
    <div
      className={cn("relative flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 31"
        fill="none"
        style={{ width: size, height: size }}
      >
        <defs>
          <linearGradient
            id="spiral_gradient"
            x1="3.97448"
            y1="0.0684525"
            x2="26.1087"
            y2="27.0328"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#20D6FE" />
            <stop offset="1" stopColor="#9747FF" />
          </linearGradient>
        </defs>

        {/* The spiral path that draws itself */}
        <path
          d="M2.65308 23.998C2.5664 23.5545 2.62404 16.5231 2.63364 15.4878C2.65844 12.8656 3.46267 10.5161 4.49969 8.77583C6.34719 5.67551 10.3411 2.44205 15.813 2.84372C20.4047 3.18083 24.5101 6.25411 24.8539 11.0643C25.1159 14.731 22.7991 17.6841 19.7897 18.8404C19.3945 18.9923 16.2629 19.8821 16.0123 19.2295C15.9414 19.0452 15.9716 18.8145 15.9725 18.5866C15.9738 18.277 15.9551 17.9609 15.9908 17.6548C16.9496 17.4879 17.4887 17.5308 18.515 17.0121C20.6938 15.911 22.0353 13.3881 21.4746 10.7317C20.835 7.70151 17.3705 5.64245 13.4541 6.31175C2.90999 8.11368 2.97031 28.591 12.374 30.6318C21.265 32.5612 29.421 26.6798 31.0572 18.3455C31.3655 16.7751 31.5049 14.1186 31.0501 12.6038C30.9424 13.4585 30.9781 14.2118 30.822 15.0833C29.9518 19.939 26.9623 23.6705 22.5265 25.9797C20.2622 27.1586 16.5415 28.0497 13.4448 27.2227C6.62509 25.4011 7.45569 9.69267 14.6498 9.42727C16.4066 9.36247 17.8035 10.0899 18.1741 11.4166C18.6365 13.0714 17.4737 14.2813 16.0219 14.4533C15.0738 14.5657 14.4384 14.5384 13.7926 14.9756C12.4082 15.9121 12.7643 17.7728 12.7623 19.4802C12.7609 20.5348 12.8655 21.0498 13.38 21.65C14.2838 22.7045 16.0248 22.8032 17.7389 22.6317C23.7416 22.0307 28.3242 16.8827 28.0418 11.0974C27.746 5.03213 23.1201 0.931661 17.0861 0.127653C11.1002 -0.669877 5.29364 2.34353 2.34055 7.0999C0.994799 9.26753 -0.00334255 12.3721 8.41222e-06 15.6976C0.00224239 17.9039 0.718232 20.452 1.63774 22.3189C1.80015 22.6486 1.94491 22.87 2.12519 23.1998C2.2465 23.4216 2.4136 23.9028 2.65308 23.998Z"
          fill="none"
          stroke="url(#spiral_gradient)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={pathLength}
          style={{
            strokeDasharray: pathLength,
            strokeDashoffset: pathLength,
            animation: "draw-spiral 2s ease-in-out infinite alternate",
          }}
        />

        <style>
          {`
            @keyframes draw-spiral {
              0% {
                stroke-dashoffset: ${pathLength};
              }
              100% {
                stroke-dashoffset: 0;
              }
            }
          `}
        </style>
      </svg>
    </div>
  );
}

export default Loader;
