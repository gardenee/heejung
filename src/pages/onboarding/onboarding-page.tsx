import { OnboardingBanner } from './banner/onboarding-banner';
import { VotingSection } from './vote-section/voting-section';

export const OnboardingPage = () => {
  return (
    <div className='flex h-full w-full flex-col gap-12 bg-gray-50'>
      <OnboardingBanner />
      <VotingSection />
    </div>
  );
};
