import { useCallback, useEffect, useState } from 'react';
import { Location, useBlocker } from 'react-router-dom';

enum Action {
  Pop = 'POP',
  Push = 'PUSH',
  Replace = 'REPLACE'
}

interface BlockerFunctionParams {
  currentLocation: Location;
  nextLocation: Location;
  historyAction: Action;
}

export const useBlockNavigateModal = (condition: boolean) => {
  const [showModal, setShowModal] = useState(false);
  const onOpenChange = useCallback((open: boolean) => setShowModal(open), [setShowModal]);

  const blockerFunction = ({ currentLocation, nextLocation }: BlockerFunctionParams) => {
    if (!condition) {
      return false;
    }

    return currentLocation.pathname !== nextLocation.pathname;
  };

  const blocker = useBlocker(blockerFunction);
  const onCompleteAction = () => {
    if (blocker.state === 'blocked') {
      blocker.proceed();
    }
  };

  const onCancelAction = () => {
    if (blocker.state === 'blocked') {
      blocker.reset();
    }
  };

  useEffect(() => {
    if (blocker.state === 'blocked') {
      onOpenChange(true);
    } else {
      onOpenChange(false);
    }
  }, [blocker, onOpenChange]);

  return {
    visible: showModal,
    onOpenChange,
    onCompleteAction,
    onCancelAction
  };
};
