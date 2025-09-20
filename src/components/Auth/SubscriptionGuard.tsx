import { useEffect, useState } from 'react';
import { useSubscription } from '../../hooks/useSubscription';
import { SubscriptionExpiredPage } from './SubscriptionExpiredPage';

interface SubscriptionGuardProps {
  children: React.ReactNode;
}

export function SubscriptionGuard({ children }: SubscriptionGuardProps) {
  const { hasActiveSubscription, loading } = useSubscription();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (!loading) {
      setShowContent(true);
    }
  }, [loading]);

  // Show loading while checking subscription
  if (loading || !showContent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show expired page if no active subscription
  if (!hasActiveSubscription) {
    return <SubscriptionExpiredPage />;
  }

  // Show main app content if subscription is active
  return <>{children}</>;
}