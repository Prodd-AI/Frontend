import AuthLayout from "@/shared/components/auth.layout.component";
import Logo from "@/shared/components/Logo.component";
import frame1 from "/assets/images/Frame 281.png";
import frame2 from "/assets/images/Frame 284-1.png";
import frame3 from "/assets/images/Frame 284.png";
import { Button } from "@/components/ui/button";
import { LuArrowUpRight } from "react-icons/lu";
import useIsMobile from "@/shared/hooks/useIsMobile";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function OnboardingPage() {
  return <AuthLayout children={<OnboardingComponent />} />;
}

export default OnboardingPage;
interface BaseCardInt {
  img: string;
  title: string;
  subTitle: string;
}
const mobile_carousel_cards: BaseCardInt[] = [
  {
    img: "/assets/images/Carousel-img1.png",
    title: `Log Your Mood Daily`,
    subTitle: `Start your day with a quick check-in-emoji or 1-5 scale`,
  },
  {
    img: "/assets/images/Carousel-img2.png",
    title: `Stay Focused with smart Nudges`,
    subTitle: `Get friendly reminders to pause, focus, or celebrate wins.`,
  },
  {
    img: "/assets/images/Carousel-img3.png",
    title: `Own Your Workday`,
    subTitle: `Track tasks, see progress, and stay in control`,
  },
];
const desktop_carousel_cards: BaseCardInt[] = [
  {
    img: "/assets/images/447785c91fbf058e4f9b216c6d28d77ec2a080c2.png",
    title: `Stay on top of your work and emotions.`,
    subTitle: `Track tasks and moods in one seamless flow.`,
  },
  {
    img: "/assets/images/9e313d37613d7c5b94bd1063598b5644c514d474.png",
    title: `See how your team feels, not just what they do.`,
    subTitle: `Boost collaboration with real-time mood insights.`,
  },
  {
    img: "/assets/images/afe7bafdcaace231466db2c5d67bc70514a871ce.png",
    title: `Empower leadership with emotional visibility.`,
    subTitle: `Understand team dynamics and act before burnout happens.`,
  },
  {
    img: "/assets/images/be1ab28de78a78468b3609d9cb6820d97dc420a1.png",
    title: `Your voice, your vibe, your work.
 Log how you feel and let your team understand you better.`,
    subTitle: ` Log how you feel and let your team understand you better.`,
  },
];
const features_card: BaseCardInt[] = [
  {
    img: frame1,
    title: "Log Your Mood Daily",
    subTitle: "Start your day with a quick check-in-emoji or 1-5 scale",
  },
  {
    img: frame2,
    title: "Stay Focused with smart Nudges",
    subTitle: "Get friendly reminders to pause, focus, or celeberate wins.",
  },
  {
    img: frame3,
    title: "Own Your Workday",
    subTitle: "Track tasks, see progress, and stay in control",
  },
];
const OnboardingComponent = () => {
  const isMobile = useIsMobile();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [desktopCurrentSlide, setDesktopCurrentSlide] = useState(0);

  // Touch/swipe handling
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  // Auto-play functionality for desktop carousel
  useEffect(() => {
    if (!isMobile) {
      const interval = setInterval(() => {
        setDesktopCurrentSlide((prevSlide) =>
          prevSlide === desktop_carousel_cards.length - 1 ? 0 : prevSlide + 1
        );
      }, 4000); // Change slide every 4 seconds

      return () => clearInterval(interval);
    }
  }, [isMobile]);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentSlide < mobile_carousel_cards.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
    if (isRightSwipe && currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };
  return (
    <div className="mx-auto max-w-[1900px] h-full">
      <div className="animate-fade-in">
        <Logo />
      </div>
      <div className="mt-6 w-full grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-[44px] min-h-[600px]">
        <div className="h-full bg relative group animate-slide-in-left hidden lg:block">
          <img
            src={desktop_carousel_cards[desktopCurrentSlide].img}
            alt="onboarding-image"
            className="w-full h-full object-cover rounded-[42px] transition-transform duration-700 ease-out group-hover:scale-105"
          />
          {/* Dark gradient overlay at the bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent rounded-b-[42px] transition-opacity duration-300"></div>
          <div className="absolute bottom-6 w-full h-32 text-[#fff] px-12 animate-slide-up">
            <div className="flex flex-col space-y-2">
              <h3 className="font-bold text-xl text-[#F3F4F6] w-4/5 transition-all duration-500 ease-out leading-tight">
                {desktop_carousel_cards[desktopCurrentSlide].title}
              </h3>
              <h4 className="text-[#FFFFFF] font-[400] italic transition-all duration-500 ease-out delay-200 text-sm leading-relaxed">
                {desktop_carousel_cards[desktopCurrentSlide].subTitle}
              </h4>
            </div>
          </div>

          {/* Desktop Carousel Navigation Dots */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {desktop_carousel_cards.map((_, index) => (
              <button
                key={index}
                onClick={() => setDesktopCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ease-out ${
                  index === desktopCurrentSlide
                    ? "bg-white w-6"
                    : "bg-white/50 hover:bg-white/70"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="h-full flex flex-col gap-8 animate-slide-in-right w-full">
          <div className="animate-fade-in-up delay-300">
            <h1 className="text-[#251F2D] lg:text-[3.17rem] lg:font-bold font-[600] transition-all duration-700 ease-out hover:text-[#6B46C1] text-[1.75rem]">
              Welcome to Prod AI
            </h1>
            <h2 className="text-[#3A404D] lg:text-[1.375rem] lg:w-2/4 transition-all duration-500 ease-out w-full text-[1rem] font-medium">
              Your new AI companion for focus, well-being, and daily
              productivity
            </h2>
          </div>
          {!isMobile ? (
            <>
              {" "}
              <div className="flex flex-col gap-[1rem]">
                {features_card.map(({ img, title, subTitle }, index) => (
                  <div
                    key={index}
                    className="bg-[#EDE2FF] w-full h-[9.063rem] p-[14px] rounded-[24px] flex transition-all duration-500 ease-out hover:bg-[#DDD6FE] hover:shadow-lg hover:scale-[1.02] hover:-translate-y-1 animate-fade-in-up cursor-pointer"
                    style={{ animationDelay: `${(index + 1) * 200 + 400}ms` }}
                  >
                    <div className="w-[167px] overflow-hidden rounded-[16px]">
                      <img
                        src={img}
                        alt={img}
                        className="w-full h-full transition-transform duration-500 ease-out hover:scale-110"
                      />
                    </div>
                    <div className="w-full flex justify-center items-start flex-col pl-8">
                      <h4 className="text-[1.375rem] text-[#251F2D] font-semibold transition-colors duration-300 ease-out">
                        {title}
                      </h4>
                      <h5 className="text-[1.125rem] font-[400] transition-colors duration-300 ease-out">
                        {subTitle}
                      </h5>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div>
              <div className=" flex justify-end mr-5">
                {" "}
                <button className=" text-[#6619DE] text-[1rem] font-[500]">
                  Skip
                </button>
              </div>

              {/* Carousel */}
              <div className="flex flex-col items-center gap-6 mt-8">
                {/* Carousel Content */}
                <div
                  className="w-full rounded-[24px] p-6 transition-all duration-500 ease-out cursor-grab active:cursor-grabbing"
                  onTouchStart={onTouchStart}
                  onTouchMove={onTouchMove}
                  onTouchEnd={onTouchEnd}
                >
                  <div className="flex flex-col items-center text-center">
                    {/* Image */}
                    <div className="w-full max-w-[280px] h-[200px] mb-6 overflow-hidden rounded-[16px]">
                      <img
                        src={mobile_carousel_cards[currentSlide].img}
                        alt={mobile_carousel_cards[currentSlide].title}
                        className="w-full h-full object-cover transition-transform duration-500 ease-out"
                      />
                    </div>

                    {/* Fixed height container for text to prevent overflow */}
                    <div className="flex flex-col gap-[1.65px] h-[120px] justify-center">
                      {/* Title */}
                      <h3 className="text-[1.75rem] font-semibold text-[#251F2D] leading-tight">
                        {mobile_carousel_cards[currentSlide].title}
                      </h3>

                      {/* Subtitle */}
                      <p className="text-[1rem] text-[#251F2D] font-semibold leading-relaxed">
                        {mobile_carousel_cards[currentSlide].subTitle}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Carousel Navigation Dots */}
                <div className="flex gap-2">
                  {mobile_carousel_cards.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ease-out  ${
                        index === currentSlide
                          ? "bg-[#6619DE] w-8"
                          : "bg-[#D1D5DB] hover:bg-[#9CA3AF]"
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>

                {/* Navigation Arrows */}
                <div className="flex gap-4">
                  <button
                    onClick={() =>
                      setCurrentSlide(
                        currentSlide === 0
                          ? mobile_carousel_cards.length - 1
                          : currentSlide - 1
                      )
                    }
                    className={`size-[3.368rem] rounded-full flex items-center justify-center transition-all duration-300 ease-out ${
                      currentSlide === 0
                        ? "bg-gray-400 text-gray-600 cursor-not-allowed opacity-60"
                        : "bg-[#6619DE] text-white hover:bg-[#5915c7]"
                    }`}
                    aria-label="Previous slide"
                    disabled={currentSlide === 0}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>

                  <button
                    onClick={() =>
                      setCurrentSlide(
                        currentSlide === mobile_carousel_cards.length - 1
                          ? 0
                          : currentSlide + 1
                      )
                    }
                    className={`size-[3.368rem] rounded-full flex items-center justify-center transition-all duration-300 ease-out ${
                      currentSlide === mobile_carousel_cards.length - 1
                        ? "bg-gray-400 text-gray-600 cursor-not-allowed opacity-60"
                        : "bg-[#6619DE] text-white hover:bg-[#5915c7]"
                    }`}
                    aria-label="Next slide"
                    disabled={currentSlide === mobile_carousel_cards.length - 1}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
          <Link to="/auth/login" className=" w-full">
            <Button
              className={`h-[3.188rem] transition-all duration-300 ease-out animate-fade-in-up w-full group ${
                isMobile && currentSlide !== mobile_carousel_cards.length - 1
                  ? "bg-gray-400 text-gray-600 cursor-not-allowed opacity-60 hover:bg-gray-400 hover:scale-100 hover:shadow-none"
                  : "bg-[#6619DE] text-white hover:bg-[#5915c7] hover:shadow-xl hover:scale-105"
              }`}
              style={{ animationDelay: "1000ms" }}
              disabled={
                isMobile && currentSlide !== mobile_carousel_cards.length - 1
              }
            >
              Let's Explore{" "}
              <LuArrowUpRight
                className={`transition-transform duration-300 ease-out ${
                  isMobile && currentSlide !== mobile_carousel_cards.length - 1
                    ? ""
                    : "group-hover:translate-x-1 group-hover:-translate-y-1"
                }`}
              />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
