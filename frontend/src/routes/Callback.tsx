import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { extractCustomState, urlSafeDecode } from '@/utils/amplify';

const Callback = () => {
  const location = useLocation();
  const [hash, setHash] = useState('');

  const state = hash
    ?.split('&')
    .find((x) => x.startsWith('state='))
    ?.split('=')[1];

  const eventRoute = urlSafeDecode(extractCustomState(state ?? '')).replace('/signin/callback', '');
  const routeTo = stripPathPrefix(eventRoute, '/signin/callback');

  useEffect(() => {
    if (location.hash.trim()) {
      setHash(location.hash);
    }
  }, [location.hash]);

  if (routeTo) {
    return <Navigate to={{ pathname: routeTo }} replace />;
  }

  return <></>;
};

export function stripPathPrefix(input: string, prefix: string): string {
  const [noHash, hash = ''] = input.split('#', 2);
  const [pathLike, search = ''] = noHash.split('?', 2);

  const normalize = (s: string) => {
    if (!s.startsWith('/')) s = `/${s}`;
    if (s.length > 1 && s.endsWith('/')) s = s.slice(0, -1);
    return s;
  };

  const pfx = normalize(prefix);
  const path = pathLike.startsWith('/') ? pathLike : `/${pathLike}`;

  let stripped = path === pfx ? '/' : path.startsWith(pfx + '/') ? path.slice(pfx.length) : path;

  stripped = stripped.replace(/\/{2,}/g, '/');
  const q = search ? `?${search}` : '';
  const h = hash ? `#${hash}` : '';
  return stripped + q + h;
}

export default Callback;
