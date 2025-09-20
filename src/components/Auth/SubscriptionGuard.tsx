import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useSubscription } from '../../hooks/useSubscription';
import { AuthPage } from './AuthPage';

interface SubscriptionGuardProps {
  children: React.ReactNode;
}

export function SubscriptionGuard({ children }: SubscriptionGuardProps) {
  const { user, loading: authLoading } = useAuth();
  const { loading: subscriptionLoading } = useSubscription();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (!authLoading && !subscriptionLoading) {
      setShowContent(true);
    }
  }, [authLoading, subscriptionLoading]);

  // Show loading while checking auth and subscription
  if (authLoading || subscriptionLoading || !showContent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show auth page if not logged in
  if (!user) {
    return <AuthPage />;
  }

  // Show main app content if authenticated (regardless of subscription)
  return <>{children}</>;
}