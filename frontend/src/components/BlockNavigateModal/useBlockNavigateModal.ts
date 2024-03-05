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

interface useBlockNavigateParams {
  condition: boolean;
  onOk?: () => void;
  onCancel?: () => void;
}

export const useBlockNavigateModal = ({ condition, onOk, onCancel }: useBlockNavigateParams) => {
  const [showModal, setShowModal] = useState(false);
  const onOpenChange = useCallback((open: boolean) => setShowModal(open), [setShowModal]);

  const blockerFunction = ({ currentLocation, nextLocation }: BlockerFunctionParams) => {
    if (!condition) {
      return false;
    }

    return condition && currentLocation.pathname !== nextLocation.pathname;
  };

  const blocker = useBlocker(blockerFunction);
  const onCompleteAction = () => {
    if (blocker.state === 'blocked') {
      onOk && onOk();
      blocker.proceed();
    }
  };

  const onCancelAction = () => {
    if (blocker.state === 'blocked') {
      onCancel && onCancel();
      blocker.reset();
    }
  };

  useEffect(() => {
    if (blocker.state === 'blocked') {
      if (!condition) {
        blocker.proceed();
        return;
      }
      onOpenChange(true);
    } else {
      onOpenChange(false);
    }
  }, [blocker, condition, onOpenChange]);

  return {
    visible: showModal,
    onOpenChange,
    onCompleteAction,
    onCancelAction
  };
};
