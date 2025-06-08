import { getBrighterColor, getDarkerColor } from '@/utils/color';
import { memo, useMemo } from 'react';
import { BannerDivider } from '@/pages/onboarding/banner/banner-divider';

type OnboardingBannerProps = {
  mainColor?: string;
};

const OnboardingBannerComponent = ({
  mainColor = '#9333ea',
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
    [gradientColors],
  );

  return (
    <div
      className='relative flex h-96 w-full min-w-96 items-center justify-center overflow-hidden'
      style={backgroundStyle}
    >
      {/* 배경 장식 요소들 */}
      <div className='absolute inset-0'>
        <div className='absolute -top-20 -left-20 h-40 w-40 animate-pulse rounded-full bg-white opacity-10'></div>
        <div className='absolute -right-16 -bottom-16 h-32 w-32 animate-pulse rounded-full bg-white opacity-10 delay-1000'></div>
        <div className='absolute top-6 right-8 h-6 w-6 animate-ping rounded-full border-2 border-white opacity-30'></div>
        <div className='absolute bottom-8 left-8 h-4 w-4 animate-ping rounded-full bg-white opacity-20'></div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className='relative z-10 flex flex-col px-4 text-center'>
        <h1 className='relative mb-2 flex flex-row gap-2 text-5xl font-bold text-white md:text-5xl'>
          <span className='animate-fade-in-up inline-block'>희망</span>
          <span className='animate-fade-in-up inline-block delay-300'>
            정치
          </span>
          <span className='animate-fade-in-up inline-block delay-700'>
            이야기
          </span>

          {/* 텍스트 글로우 효과 */}
          <div className='absolute inset-0 -z-10 text-5xl font-bold text-purple-200 opacity-30 blur-sm md:text-5xl'>
            희망 정치 이야기
          </div>
        </h1>

        <p className='animate-simple-fade-in text-lg text-purple-100 opacity-90 delay-1500 md:text-lg'>
          함께 만들어가는 더 나은 미래
        </p>
      </div>

      {/* 하단 웨이브 효과 */}
      <div className='absolute bottom-0 left-0 w-full'>
        <BannerDivider />
      </div>
    </div>
  );
};

export const OnboardingBanner = memo(OnboardingBannerComponent);
