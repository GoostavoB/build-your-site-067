import { OnboardingFlow } from "./OnboardingFlow";
import { useOnboarding } from "@/hooks/useOnboarding";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "react-router-dom";

export const OnboardingWrapper = () => {
  const { user } = useAuth();
  const { showOnboarding, loading, completeOnboarding } = useOnboarding();
  const location = useLocation();

  const isPublicPage = ['/auth', '/'].includes(location.pathname) || 
    location.pathname.startsWith('/blog') || 
    location.pathname.startsWith('/pricing') ||
    location.pathname.startsWith('/legal') ||
    location.pathname.startsWith('/terms') ||
    location.pathname.startsWith('/privacy');

  if (!user || loading || !showOnboarding || isPublicPage) {
    return null;
  }

  return <OnboardingFlow open={showOnboarding} onComplete={completeOnboarding} />;
};
