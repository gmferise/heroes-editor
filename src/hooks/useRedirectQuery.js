import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import queryString from 'query-string';

/** onMount,
 * parse the redirect query param
 * and execute a redirect if it exists
 */
const useRedirectQuery = () => {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (!location || !navigate) return;
    const { redirect } = queryString.parse(location);
    if (redirect) {
      navigate(redirect);
    }
  }, [navigate, location]);
};

export default useRedirectQuery;
