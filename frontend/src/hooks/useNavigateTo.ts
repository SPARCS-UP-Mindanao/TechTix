import { useMemo } from 'react';
import { useNavigate, useSearchParams, To, NavigateOptions } from 'react-router-dom';

export function useNavigateTo() {
  const _navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const rawTo = searchParams.has('to') ? decodeURIComponent(searchParams.get('to')!) : '/';
  const toUrl = useMemo(() => new URL(rawTo, window.location.origin), [rawTo]);

  const navigate = (defaultTo: To, options?: NavigateOptions) => {
    if (rawTo === '/') {
      return _navigate(defaultTo, options);
    }

    return _navigate(toUrl, options);
  };

  return {
    navigate,
    toUrl
  };
}
