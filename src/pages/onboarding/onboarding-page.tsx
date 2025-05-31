import { OnboardingBanner } from "./banner/onboarding-banner";

export const OnboardingPage = () => {
  return (
    <div className="w-full min-h-screen flex flex-col bg-gray-50 gap-12">
      <OnboardingBanner />
    </div>
  );
};
