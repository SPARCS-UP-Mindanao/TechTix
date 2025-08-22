import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { extractCustomState, urlSafeDecode } from '@/utils/amplify';

const Callback = () => {
  const [hash, setHash] = useState('');

  const state = hash
    ?.split('&')
    .find((x) => x.startsWith('state='))
    ?.split('=')[1];

  const routeTo = urlSafeDecode(extractCustomState(state ?? ''));

  useEffect(() => {
    if (location.hash.trim()) {
      setHash(location.hash);
    }
  }, [location.hash]);

  if (routeTo) {
    return <Navigate to={routeTo} />;
  }

  return <></>;
};

export default Callback;
