import { useEffect } from 'react';

export const usePyconStyles = () => {
  useEffect(() => {
    document.body.setAttribute('data-page', 'pycon');
    return () => document.body.setAttribute('data-page', '');
  }, []);
};
