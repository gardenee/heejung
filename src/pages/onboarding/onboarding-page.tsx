import { OnboardingBanner } from './banner/onboarding-banner';
import { VotingSection } from './vote-section/voting-section';
import { VotedSection } from './vote-section/voted-section';

export const OnboardingPage = () => {
  return (
    <div className='flex h-full w-full flex-col gap-8 bg-gray-50'>
      <OnboardingBanner />
      <VotingSection />
      <VotedSection />
    </div>
  );
};
