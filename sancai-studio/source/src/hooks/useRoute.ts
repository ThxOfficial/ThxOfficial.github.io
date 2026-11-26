import { useEffect, useState } from 'react';
export function useRoute() {
  const [route, setRoute] = useState(() => location.hash.slice(1) || '/');
  useEffect(() => { const read = () => { setRoute(location.hash.slice(1) || '/'); window.scrollTo({ top: 0, behavior: 'instant' }); }; addEventListener('hashchange', read); return () => removeEventListener('hashchange', read); }, []);
  return { route, navigate: (path: string) => { location.hash = path; } };
}
