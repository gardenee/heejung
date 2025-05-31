import { getBrighterColor, getDarkerColor } from "@/utils/color";
import { memo, useMemo } from "react";

type OnboardingBannerProps = {
  mainColor?: string;
};

const OnboardingBannerComponent = ({
  mainColor = "#9333ea",
}: OnboardingBannerProps) => {
  const gradientColors = useMemo(() => {
    const gradientFrom = getBrighterColor(mainColor, 0.1);
    const gradientVia = mainColor;
    const gradientTo = getDarkerColor(mainColor, 0.3);

    return { gradientFrom, gradientVia, gradientTo };
  }, [mainColor]);

  const backgroundStyle = useMemo(
    () => ({
      background: `linear-gradient(to bottom right, ${gradientColors.gradientFrom}, ${gradientColors.gradientVia}, ${gradientColors.gradientTo})`,
    }),
    [gradientColors]
  );

  return (
    <div
      className="relative w-full h-64 md:h-72 flex justify-center items-center overflow-hidden"
      style={backgroundStyle}
    >
      {/* 배경 장식 요소들 */}
      <div className="absolute inset-0">
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-white opacity-10 rounded-full animate-pulse"></div>
        <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-white opacity-10 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-6 right-8 w-6 h-6 border-2 border-white opacity-30 rounded-full animate-ping"></div>
        <div className="absolute bottom-8 left-8 w-4 h-4 bg-white opacity-20 rounded-full animate-ping"></div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="relative z-10 text-center px-4 flex flex-col gap-3">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 relative flex flex-row gap-2">
          <span className="inline-block animate-fade-in-up">희망</span>
          <span className="inline-block animate-fade-in-up delay-300">
            정치
          </span>
          <span className="inline-block animate-fade-in-up delay-700">
            이야기
          </span>

          {/* 텍스트 글로우 효과 */}
          <div className="absolute inset-0 text-4xl md:text-6xl font-bold text-purple-200 opacity-30 blur-sm -z-10">
            희망 정치 이야기
          </div>
        </h1>

        <p className="text-lg md:text-xl text-purple-100 opacity-90 animate-simple-fade-in delay-1500">
          함께 만들어가는 더 나은 미래
        </p>
      </div>

      {/* 하단 웨이브 효과 */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg
          className="w-full h-12 fill-gray-50"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path d="M0,120 C150,100 350,60 600,80 C850,100 1050,120 1200,100 L1200,120 Z"></path>
        </svg>
      </div>
    </div>
  );
};

export const OnboardingBanner = memo(OnboardingBannerComponent);
