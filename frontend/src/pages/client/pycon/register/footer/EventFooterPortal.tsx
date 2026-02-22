import { FC, PropsWithChildren, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { REGISTER_BUTTON_ID } from '../EventDetails';

interface Props extends PropsWithChildren {
  portalId?: string;
  retryInterval?: number; // ms between retries
  maxRetries?: number; // optional safety limit
}

export const EventFooterPortal: FC<Props> = ({
  portalId = REGISTER_BUTTON_ID,
  children,
  retryInterval = 300, // default: check every 300ms
  maxRetries = 20 // 6 seconds max by default
}) => {
  const [targetNode, setTargetNode] = useState<HTMLElement | null>(null);

  useEffect(() => {
    let retries = 0;
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const checkNode = () => {
      const node = document.getElementById(portalId);
      if (node) {
        setTargetNode(node);
        if (intervalId) clearInterval(intervalId);
      } else if (retries >= maxRetries) {
        if (intervalId) clearInterval(intervalId);
      }
      retries++;
    };

    // run once immediately
    checkNode();

    // retry if not found
    intervalId = setInterval(checkNode, retryInterval);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [portalId, retryInterval, maxRetries]);

  if (!targetNode) {
    return null;
  }

  return ReactDOM.createPortal(children, targetNode);
};
