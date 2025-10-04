import { useState } from 'react';
import { useSubscription } from './useSubscription';

export function useSubscriptionCheck() {
  const { hasActiveSubscription } = useSubscription();
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  const checkSubscription = (callback?: () => void) => {
    if (hasActiveSubscription) {
      callback?.();
    } else {
      setShowSubscriptionModal(true);
    }
  };

  return {
    showSubscriptionModal,
    setShowSubscriptionModal,
    checkSubscription,
    hasActiveSubscription
  };
}