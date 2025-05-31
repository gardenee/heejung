import { OnboardingBanner } from "./banner/onboarding-banner";
import { VotingSection } from "./voting/voting-section";

export const OnboardingPage = () => {
  return (
    <div className="flex flex-col w-full h-full gap-12 bg-gray-50">
      <OnboardingBanner />
      <VotingSection />
    </div>
  );
};
